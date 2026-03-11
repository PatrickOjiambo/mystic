const features = [
    {
        num: '01',
        title: 'ROUTINE DEPOSITS',
        desc: 'Uncompromising savings automation. Escalate daily deposits from $0.01. Break streaks at your own peril. Zero forgiveness without a freeze protocol.',
    },
    {
        num: '02',
        title: 'YIELD BADGES',
        desc: 'Not participation trophies. High-risk, high-reward milestones. Unlock exclusive APR tiers and $YO airdrops by proving risk mastery.',
    },
    {
        num: '03',
        title: 'GUILD WARFARE',
        desc: 'Anonymous leaderboards. Aggregate capital in syndicates. Annihilate competing guilds in yield generation metrics.',
    },
    {
        num: '04',
        title: 'ACADEMY TRIALS',
        desc: 'Pass relentless DeFi architecture quizzes to unlock restricted vaults. Knowledge governs access limits.',
    },
]

export function FeaturesSection() {
    return (
        <section id="features" className="min-h-screen bg-void-black border-b border-iron-grey">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">

                    {/* Header block */}
                    <div className="md:col-span-2 border-b-4 border-blood-crimson pb-8 mb-12">
                        <h2 className="text-5xl sm:text-6xl md:text-8xl font-serif text-bone-white tracking-tighter uppercase">
                            Operational<br />
                            <span className="text-iron-grey italic">Directives.</span>
                        </h2>
                        <p className="mt-8 font-mono text-sm uppercase tracking-[0.2em] text-blood-crimson max-w-lg">
                            Every mechanic engineered for maximum capital velocity. Reject stagnation.
                        </p>
                    </div>

                    {/* Feature Blocks */}
                    {features.map((feature, i) => (
                        <div
                            key={feature.num}
                            className={`group flex flex-col pt-8 border-t border-iron-grey transition-colors duration-300 hover:bg-bone-white hover:border-bone-white p-8 -mx-8 ${i % 2 !== 0 ? 'md:mt-32' : ''}`}
                        >
                            <div className="flex justify-between items-baseline mb-6">
                                <span className="font-mono text-xs uppercase tracking-widest text-iron-grey group-hover:text-blood-crimson transition-colors">
                                    System Module
                                </span>
                                <span className="font-serif text-5xl sm:text-7xl font-bold text-tarnished-gold group-hover:text-void-black transition-colors">
                                    {feature.num}
                                </span>
                            </div>

                            <h3 className="font-serif text-3xl sm:text-4xl uppercase tracking-tighter text-bone-white mb-6 group-hover:text-void-black transition-colors">
                // {feature.title}
                            </h3>

                            <p className="font-mono text-sm leading-relaxed text-bone-white/60 group-hover:text-void-black/80 transition-colors">
                                {feature.desc}
                            </p>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    )
}
