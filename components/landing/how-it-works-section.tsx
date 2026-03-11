const steps = [
    {
        number: '01',
        title: 'Connect Your Wallet',
        description:
            'Link your wallet in seconds. We support MetaMask, Coinbase, WalletConnect, and more — all secured onchain.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="6" width="20" height="14" rx="2" />
                <path d="M2 10H22" />
                <path d="M6 14H10" />
            </svg>
        ),
        color: '#7b3fe4',
    },
    {
        number: '02',
        title: 'Choose Your Quest',
        description:
            'Pick from Daily Streaks, Risk Challenges, or Guild Missions. Each quest matches your risk appetite and savings goals.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
        ),
        color: '#00e5ff',
    },
    {
        number: '03',
        title: 'Earn & Level Up',
        description:
            'Watch your yields grow automatically. Earn Quest Coins, collect badges, climb leaderboards, and unlock rare rewards.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2V6" />
                <path d="M12 18V22" />
                <path d="M4.93 4.93L7.76 7.76" />
                <path d="M16.24 16.24L19.07 19.07" />
                <path d="M2 12H6" />
                <path d="M18 12H22" />
                <path d="M4.93 19.07L7.76 16.24" />
                <path d="M16.24 7.76L19.07 4.93" />
            </svg>
        ),
        color: '#ffd700',
    },
]

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="relative py-24 sm:py-32">
            <div className="relative mx-auto max-w-5xl px-6">
                {/* Section header */}
                <div className="mx-auto max-w-2xl text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-mystic-cyan">
                        The Quest Path
                    </span>
                    <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        Three Steps to{' '}
                        <span className="mystic-gradient-text">Adventure</span>
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                        From wallet connection to earning rewards — your journey is simple,
                        secure, and automatically optimized.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative mt-20">
                    {/* Connecting line */}
                    <div className="absolute left-8 top-0 bottom-0 hidden w-px quest-path-line md:left-1/2 md:block" />

                    <div className="space-y-12 md:space-y-16">
                        {steps.map((step, i) => (
                            <div
                                key={step.number}
                                className={`relative flex flex-col gap-6 md:flex-row md:items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Step content */}
                                <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                                    <div
                                        className={`glass-card rounded-2xl p-8 ${i % 2 === 1 ? 'md:ml-auto' : ''
                                            } max-w-lg`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                                                style={{ background: step.color }}
                                            >
                                                {step.icon}
                                            </div>
                                            <div>
                                                <span
                                                    className="text-xs font-bold uppercase tracking-widest"
                                                    style={{ color: step.color }}
                                                >
                                                    Step {step.number}
                                                </span>
                                                <h3 className="text-xl font-bold text-foreground">
                                                    {step.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Center node */}
                                <div className="absolute left-8 hidden h-5 w-5 -translate-x-1/2 md:left-1/2 md:block">
                                    <div
                                        className="h-5 w-5 rounded-full border-2"
                                        style={{
                                            borderColor: step.color,
                                            boxShadow: `0 0 20px ${step.color}40`,
                                            background: '#0a0a1a',
                                        }}
                                    />
                                </div>

                                {/* Empty space for alternating layout */}
                                <div className="hidden flex-1 md:block" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
