export function Footer() {
    return (
        <footer className="bg-void-black text-bone-white py-24 border-t-8 border-bone-white">
            <div className="mx-auto max-w-7xl px-6">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-iron-grey pb-16">

                    <div className="col-span-1 md:col-span-2">
                        <h2 className="font-serif text-6xl font-bold tracking-tighter mb-6">MYSTIC.</h2>
                        <p className="font-mono text-sm uppercase tracking-widest text-iron-grey max-w-xs leading-relaxed">
                            Gamified yield architecture. Reject stagnation. Zero management fees. Execute.
                        </p>
                    </div>

                    <div className="col-span-1">
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-blood-crimson mb-6 border-l border-blood-crimson pl-2">Navigation</h3>
                        <ul className="flex flex-col gap-4 font-serif text-lg">
                            <li><a href="#features" className="hover:text-blood-crimson transition-colors">Features</a></li>
                            <li><a href="#quests" className="hover:text-blood-crimson transition-colors">Directives</a></li>
                            <li><a href="#stats" className="hover:text-blood-crimson transition-colors">Telemetry</a></li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-blood-crimson mb-6 border-l border-blood-crimson pl-2">Network</h3>
                        <ul className="flex flex-col gap-4 font-serif text-lg">
                            <li><a href="#" className="hover:text-tarnished-gold transition-colors">X (Twitter)</a></li>
                            <li><a href="#" className="hover:text-tarnished-gold transition-colors">Discord</a></li>
                            <li><a href="#" className="hover:text-tarnished-gold transition-colors">Github Archive</a></li>
                        </ul>
                    </div>

                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-iron-grey">
                        © {new Date().getFullYear()} MYSTIC PROTOCOL. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-4">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-bone-white px-2 py-1 border border-iron-grey">ETH</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-bone-white px-2 py-1 border border-iron-grey">BASE</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-bone-white px-2 py-1 border border-iron-grey">ARB</span>
                    </div>
                </div>

            </div>
        </footer>
    )
}
