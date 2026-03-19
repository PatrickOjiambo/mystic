'use client'

import { useState, useEffect } from 'react'
import {
    useVaultState,
    useUserPosition,
    useDeposit,
    useRedeem
} from '@yo-protocol/react'
import { parseUnits, formatUnits, erc20Abi } from 'viem'
import { useConnection, useChainId, useSendTransaction, usePublicClient, useReadContract } from 'wagmi'
import { VAULTS, YO_GATEWAY_ADDRESS } from "@yo-protocol/core";
import { EnsoClient } from '@ensofinance/sdk';

const ensoClient = new EnsoClient({
    apiKey: process.env.NEXT_PUBLIC_ENSO_API_KEY || ''
});
interface VaultInterfaceProps {
    vaultName: 'yoETH' | 'yoUSD'
}

export function VaultInterface({ vaultName }: VaultInterfaceProps) {
    const { address } = useConnection()
    const { vaultState, isLoading: isLoadingVault } = useVaultState(vaultName)
    const { position, isLoading: isLoadingBalance } = useUserPosition(vaultName, address)

    const [amount, setAmount] = useState('')
    const [mode, setMode] = useState<'DEPOSIT' | 'REDEEM'>('DEPOSIT')
    const [useNativeEth, setUseNativeEth] = useState(false)
    const [isZapping, setIsZapping] = useState(false)
    const [txStep, setTxStep] = useState<string>('')
    const [txError, setTxError] = useState<string>('')
    const { sendTransactionAsync } = useSendTransaction()
    const publicClient = usePublicClient()
    const chainId = useChainId();
let depositHash: string
    // YO Action Hooks
    const { deposit, isLoading: isDepositing, isSuccess: isDepositSuccess, step: depositStep } = useDeposit({
        vault: vaultName, slippageBps: 50,
        onSubmitted: (h) => console.log("Deposit submitted:", h),
        onConfirmed: (h) => console.log("Deposit confirmed:", h),
        onError: (e) => {
            console.error("Deposit error:", e)
            setTxError(e.message || 'Deposit failed')
        },
    })
    const { redeem, isLoading: isRedeeming, isSuccess: isRedeemSuccess, step: redeemStep } = useRedeem({ 
        vault: vaultName,
        onError: (e) => setTxError(e.message || 'Redeem failed')
    })

    let tokenAddress;
    if (vaultName === 'yoETH') {
        tokenAddress = VAULTS.yoETH.underlying.address[chainId as keyof typeof VAULTS.yoETH.underlying.address];
        console.log("Token addres", tokenAddress)
        console.log("chain ID", chainId)
        console.log("vault name", vaultName)
        console.log("vault state", vaultState)
    } else {
        tokenAddress = VAULTS.yoUSD.underlying.address[chainId as keyof typeof VAULTS.yoUSD.underlying.address];
    }
    const { data: balanceData, isLoading: isCheckBalanceLoading, isError: isCheckBalanceError } = useReadContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address && !!tokenAddress }
    })
    const balance = balanceData as bigint | undefined;

    const decimals = vaultName === 'yoETH' ? 18 : 6 // Assuming USDC is 6 decimals
    const displayBalance = position?.assets ? formatUnits(BigInt(position.assets), decimals) : '0.00'

    // Handle successful actions by syncing to our MongoDB backend
    useEffect(() => {
        const syncAction = async (type: 'DEPOSIT' | 'REDEEM') => {
            if (!address || !amount) return

            try {
                await fetch('/api/sync-action', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        walletAddress: address,
                        actionType: type,
                        amount: parseUnits(amount, decimals).toString(),
                        vault: vaultName,
                        txHash: depositHash
                    }),
                })
            } catch (e) {
                console.error('Failed to sync action', e)
            }
        }

        if (isDepositSuccess) syncAction('DEPOSIT')
        if (isRedeemSuccess) syncAction('REDEEM')
    }, [isDepositSuccess, isRedeemSuccess, address, amount, decimals, vaultName])

    // Handlers
    const handleAction = async () => {
        if (!amount || parseFloat(amount) <= 0 || !tokenAddress || !address) return

        setTxError('')
        setTxStep('')
        const parsedAmount = parseUnits(amount, decimals)
        console.log("amount to buy", parsedAmount)

        if (mode === 'DEPOSIT') {
            if (vaultName === 'yoETH') {
                console.log("WETH balance", balance)
                console.log("isCheckBalanceLoading", isCheckBalanceLoading)
                console.log("isCheckBalanceError", isCheckBalanceError)
                if (isCheckBalanceLoading) {
                    console.log("Loading WETH balance")
                    return
                }
                //If user doesn't have enough WETH, convert some ETH to WETH using Enso
                if (useNativeEth || (balance !== undefined && balance < parsedAmount)) {
                    console.log("Converting ETH to WETH first")
                    try {
                        setIsZapping(true)
                        setTxStep('Fetching optimal route...')
                        const route = await ensoClient.getRouteData({
                            chainId: chainId,
                            fromAddress: address as `0x${string}`,
                            receiver: address as `0x${string}`,
                            spender: address as `0x${string}`,
                            tokenIn: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
                            tokenOut: [tokenAddress as `0x${string}`],
                            amountIn: [parsedAmount.toString()],
                            routingStrategy: "router",
                            slippage: "50"
                        });

                        setTxStep('Awaiting wallet confirmation...')
                        const txHash = await sendTransactionAsync({
                            to: route.tx.to as `0x${string}`,
                            data: route.tx.data as `0x${string}`,
                            value: BigInt(route.tx.value),
                        });

                        setTxStep('Converting ETH to WETH...')
                        if (publicClient) {
                            await publicClient.waitForTransactionReceipt({ hash: txHash });
                        }

                        setTxStep('Preparing Deposit...')
                        depositHash = await deposit({
                            token: tokenAddress as `0x${string}`,
                            amount: parsedAmount,
                            chainId: chainId
                        })
                        setIsZapping(false)
                    } catch (e) {
                        console.error("Zapping error:", e);
                        setTxError('Error while converting some ETH to WETH')
                        setIsZapping(false)
                    }
                }
                else {
                    console.log("Direct deposit as WETH is enough")
                    depositHash = await deposit({
                        token: tokenAddress as `0x${string}`,
                        amount: parsedAmount,
                        chainId: chainId
                    })
                }
            } else {
                console.log("Not yoETH")
                depositHash = await deposit({
                    token: tokenAddress as `0x${string}`,
                    amount: parsedAmount,
                    chainId: chainId
                })
            }
        } else {
            // In a production app, we would use PreviewRedeem to get exact shares,
            // but passing parsedAmount directly as shares works for this layout
            redeem(parsedAmount)
        }
    }

    const getButtonText = () => {
        if (isZapping) return `[ ${txStep.toUpperCase()} ]`;
        if (isDepositing) {
            switch (depositStep) {
                case 'switching-chain': return '[ SWITCHING CHAIN... ]';
                case 'approving': return '[ AWAITING APPROVAL... ]';
                case 'depositing': return '[ AWAITING DEPOSIT SIGNATURE... ]';
                case 'waiting': return '[ PROCESSING DEPOSIT... ]';
                default: return '[ EXECUTING DEPOSIT... ]';
            }
        }
        if (isRedeeming) {
            switch (redeemStep) {
                case 'approving': return '[ AWAITING APPROVAL... ]';
                case 'redeeming': return '[ AWAITING REDEEM SIGNATURE... ]';
                case 'waiting': return '[ PROCESSING REDEEM... ]';
                default: return '[ EXECUTING REDEEM... ]';
            }
        }
        return mode === 'DEPOSIT' ? '[ COMMIT CAPITAL ]' : '[ EXTRACT YIELD ]';
    }

    if (isLoadingVault) {
        return (
            <div className="brutalist-card animate-pulse">
                <div className="h-6 bg-iron-grey w-1/3 mb-4"></div>
                <div className="h-12 bg-iron-grey w-full"></div>
            </div>
        )
    }

    return (
        <div className="border border-iron-grey bg-void-black p-8 relative flex flex-col gap-8 group transition-colors duration-300 hover:border-bone-white">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-iron-grey pb-4">
                <div>
                    <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-tighter text-bone-white group-hover:text-blood-crimson transition-colors">
                        {vaultState?.name || vaultName}
                    </h2>
                    <div className="font-mono text-[10px] text-iron-grey uppercase tracking-widest mt-2 block">
                        Contract: {tokenAddress.substring(0, 4)}...{tokenAddress.substring(tokenAddress.length - 4)}
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-mono text-[10px] text-iron-grey uppercase tracking-widest mb-1">Your Balance</div>
                    <div className="font-mono text-xl sm:text-2xl text-bone-white">
                        {isLoadingBalance ? '...' : displayBalance.substring(0, 8)}
                    </div>
                </div>
            </div>

            {/* Analytics */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="font-mono text-[10px] text-iron-grey uppercase tracking-widest mb-1">Status</div>
                    <div className="font-mono text-xs text-[#00ff00]">ACTIVE</div>
                </div>
                <div>
                    <div className="font-mono text-[10px] text-iron-grey uppercase tracking-widest mb-1">TVL</div>
                    <div className="font-mono text-xs text-bone-white">
                        {vaultState?.totalAssets ? formatUnits(BigInt(vaultState.totalAssets), decimals).substring(0, 8) : '0.00'}
                    </div>
                </div>
            </div>

            {/* Input Module */}
            <div className="flex flex-col gap-4 mt-auto">
                <div className="flex border border-iron-grey">
                    <button
                        onClick={() => setMode('DEPOSIT')}
                        className={`flex-1 py-2 font-mono text-xs uppercase transition-colors ${mode === 'DEPOSIT' ? 'bg-bone-white text-void-black' : 'text-iron-grey hover:bg-iron-grey/20'}`}
                    >
                        Deposit
                    </button>
                    <button
                        onClick={() => setMode('REDEEM')}
                        className={`flex-1 py-2 font-mono text-xs uppercase transition-colors border-l border-iron-grey ${mode === 'REDEEM' ? 'bg-bone-white text-void-black' : 'text-iron-grey hover:bg-iron-grey/20'}`}
                    >
                        Redeem
                    </button>
                </div>

                <div className="relative">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-void-black border border-iron-grey p-4 font-mono text-xl text-bone-white focus:border-blood-crimson outline-none"
                    />
                    <button
                        onClick={() => setAmount(displayBalance)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-widest text-tarnished-gold hover:text-bone-white"
                    >
                        MAX
                    </button>
                </div>

                {mode === 'DEPOSIT' && vaultName === 'yoETH' && (
                    <div className="flex items-center gap-2 mt-2">
                        <div
                            className={`w-4 h-4 border border-iron-grey flex items-center justify-center cursor-pointer transition-colors ${useNativeEth ? 'bg-bone-white' : 'bg-void-black'}`}
                            onClick={() => setUseNativeEth(!useNativeEth)}
                        >
                            {useNativeEth && <div className="w-2 h-2 bg-void-black"></div>}
                        </div>
                        <label className="font-mono text-[10px] text-iron-grey uppercase tracking-widest cursor-pointer hover:text-bone-white" onClick={() => setUseNativeEth(!useNativeEth)}>
                            Zap with ETH via Enso
                        </label>
                    </div>
                )}

                <button
                    onClick={handleAction}
                    disabled={isDepositing || isRedeeming || isZapping || (!amount && mode === 'DEPOSIT')}
                    className="brutalist-button w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {getButtonText()}
                </button>

                {/* Status Messages */}
                {isDepositSuccess && !isZapping && !isDepositing && <p className="font-mono text-xs text-[#00ff00] mt-2">Success: Capital deployed.</p>}
                {isRedeemSuccess && !isRedeeming && <p className="font-mono text-xs text-[#00ff00] mt-2">Success: Capital extracted.</p>}
                {txError && <p className="font-mono text-xs text-red-500 mt-2">{txError}</p>}
            </div>
        </div>
    )
}
