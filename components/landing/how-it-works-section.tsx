export function HowItWorksSection() {
    return (
        <section id="quests" className="bg-bone-white text-void-black border-b-8 border-blood-crimson">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Huge Typographic Sidebar */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                        <h2 className="font-serif text-7xl sm:text-8xl md:text-[8rem] leading-[0.8] tracking-tighter uppercase">
                            The<br />
                            <span className="text-blood-crimson">Path</span><br />
                            <span className="italic">Forward.</span>
                        </h2>
                        <div className="mt-12 hidden lg:block">
                            <span className="block w-full h-px bg-void-black mb-4"></span>
                            <p className="font-mono text-xs uppercase tracking-[0.2em]">Executing sequential protocol</p>
                        </div>
                    </div>

                    {/* Sequential Instruction List */}
                    <div className="lg:col-span-7 flex flex-col gap-0 border-t border-void-black">

                        <div className="flex flex-col sm:flex-row gap-8 py-12 border-b border-void-black group hover:bg-void-black hover:text-bone-white transition-colors duration-300 -mx-6 px-6 cursor-crosshair">
                            <div className="font-serif text-6xl text-blood-crimson group-hover:text-bone-white shrink-0">I.</div>
                            <div>
                                <h3 className="font-mono text-xl uppercase tracking-widest font-bold mb-4">Initialize Wallet Link</h3>
                                <p className="font-serif text-2xl leading-relaxed opacity-80">
                                    Authenticate cryptographic signatures. Direct interface with Web3 abstraction layer. MetaMask, WalletConnect, Base Account protocols supported.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-8 py-12 border-b border-void-black group hover:bg-void-black hover:text-bone-white transition-colors duration-300 -mx-6 px-6 cursor-crosshair">
                            <div className="font-serif text-6xl text-blood-crimson group-hover:text-bone-white shrink-0">II.</div>
                            <div>
                                <h3 className="font-mono text-xl uppercase tracking-widest font-bold mb-4">Select Directive</h3>
                                <p className="font-serif text-2xl leading-relaxed opacity-80">
                                    Commit to a risk continuum. Identify target yield metrics. Accept the daily smart contract extraction parameters.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-8 py-12 border-b border-void-black group hover:bg-void-black hover:text-bone-white transition-colors duration-300 -mx-6 px-6 cursor-crosshair">
                            <div className="font-serif text-6xl text-blood-crimson group-hover:text-bone-white shrink-0">III.</div>
                            <div>
                                <h3 className="font-mono text-xl uppercase tracking-widest font-bold mb-4">Harvest Sequence</h3>
                                <p className="font-serif text-2xl leading-relaxed opacity-80">
                                    Automated yield allocation cycles. XP accumulation. Rank escalation. Extract capital upon quest termination.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    )
}
