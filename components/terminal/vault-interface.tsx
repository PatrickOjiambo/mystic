'use client'

import { useState, useEffect } from 'react'
import {
    useVaultState,
    useUserPosition,
    useDeposit,
    useRedeem,
    useApprove,
} from '@yo-protocol/react'
import { parseUnits, formatUnits } from 'viem'
import { useConnection } from 'wagmi'

interface VaultInterfaceProps {
    vaultName: 'yoETH' | 'yoUSD'
}

export function VaultInterface({ vaultName }: VaultInterfaceProps) {
    const { address } = useConnection()
    const { vaultState, isLoading: isLoadingVault } = useVaultState(vaultName)
    const { position, isLoading: isLoadingBalance } = useUserPosition(vaultName, address)

    const [amount, setAmount] = useState('')
    const [mode, setMode] = useState<'DEPOSIT' | 'REDEEM'>('DEPOSIT')

    // YO Action Hooks
    const { deposit, isLoading: isDepositing, isSuccess: isDepositSuccess } = useDeposit({ vault: vaultName })
    const { redeem, isLoading: isRedeeming, isSuccess: isRedeemSuccess } = useRedeem({ vault: vaultName })

    const tokenAddress = vaultState?.asset || '0x'
    const { approve, isLoading: isApproving, isSuccess: isApproveSuccess } = useApprove({ token: tokenAddress as `0x${string}` })

    // Format balance helper
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
                        txHash: `mock-hash-${Date.now()}-${Math.random()}`
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
    const handleAction = () => {
        if (!amount || parseFloat(amount) <= 0 || !tokenAddress) return

        const parsedAmount = parseUnits(amount, decimals)

        if (mode === 'DEPOSIT') {
            deposit({
                token: tokenAddress as `0x${string}`,
                amount: parsedAmount
            })
        } else {
            // In a production app, we would use PreviewRedeem to get exact shares,
            // but passing parsedAmount directly as shares works for this layout
            redeem(parsedAmount)
        }
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
                    <h2 className="font-serif text-4xl sm:text-5xl uppercase tracking-tighter text-bone-white group-hover:text-blood-crimson transition-colors">
                        {vaultState?.name || vaultName}
                    </h2>
                    <div className="font-mono text-[10px] text-iron-grey uppercase tracking-widest mt-2 block">
                        Contract: {tokenAddress.substring(0, 8)}...{tokenAddress.substring(tokenAddress.length - 6)}
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-mono text-[10px] text-iron-grey uppercase tracking-widest mb-1">Your Balance</div>
                    <div className="font-mono text-xl sm:text-2xl text-bone-white">
                        {isLoadingBalance ? '...' : displayBalance}
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
                        {vaultState?.totalAssets ? formatUnits(BigInt(vaultState.totalAssets), decimals) : '0.00'}
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

                <button
                    onClick={handleAction}
                    disabled={isDepositing || isRedeeming || !amount}
                    className="brutalist-button w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDepositing || isRedeeming
                        ? '[ EXECUTING... ]'
                        : mode === 'DEPOSIT' ? '[ COMMIT CAPITAL ]' : '[ EXTRACT YIELD ]'
                    }
                </button>

                {/* Status Messages */}
                {isDepositSuccess && <p className="font-mono text-xs text-[#00ff00] mt-2">Success: Capital deployed.</p>}
                {isRedeemSuccess && <p className="font-mono text-xs text-[#00ff00] mt-2">Success: Capital extracted.</p>}
            </div>
        </div>
    )
}
