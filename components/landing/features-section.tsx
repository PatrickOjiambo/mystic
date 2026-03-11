const features = [
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: 'Daily Streaks & Micro-Deposits',
        description:
            'Build unstoppable savings habits with automated round-ups and escalating daily deposits. Streak freezes keep your momentum alive.',
        accent: 'from-mystic-purple to-mystic-purple-light',
        glowColor: 'rgba(123, 63, 228, 0.3)',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.134 15.866 1 12 1C8.134 1 5 4.134 5 8C5 11.866 8.134 15 12 15Z" />
                <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: 'Badges & Milestones',
        description:
            'Collect rare achievement badges like "Yield Hero" and "Risk Master." Unlock bonus yields, prize draws, and $YO token airdrops.',
        accent: 'from-mystic-gold to-mystic-gold-light',
        glowColor: 'rgba(255, 215, 0, 0.3)',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13" />
                <path d="M16 3.13C17.7699 3.58307 19.0078 5.17787 19.0078 7.005C19.0078 8.83213 17.7699 10.4269 16 10.88" />
            </svg>
        ),
        title: 'Leaderboards & Guilds',
        description:
            'Compete globally on anonymous leaderboards or form guilds for group savings pools. Earn XP through collective quests.',
        accent: 'from-mystic-cyan to-mystic-cyan-light',
        glowColor: 'rgba(0, 229, 255, 0.3)',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" />
                <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" />
            </svg>
        ),
        title: 'Educational Mini-Games',
        description:
            'Learn DeFi through bite-sized quizzes and challenges. Unlock higher-risk vaults by mastering risk ratings and yield strategies.',
        accent: 'from-mystic-emerald to-mystic-cyan',
        glowColor: 'rgba(0, 255, 136, 0.3)',
    },
]

export function FeaturesSection() {
    return (
        <section id="features" className="relative py-24 sm:py-32">
            {/* Section background */}
            <div className="absolute inset-0 shimmer-bg opacity-50" />

            <div className="relative mx-auto max-w-7xl px-6">
                {/* Section header */}
                <div className="mx-auto max-w-2xl text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-mystic-purple">
                        Game Features
                    </span>
                    <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        Your Adventure,{' '}
                        <span className="mystic-gradient-text">Your Rules</span>
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                        Every feature is designed to make saving addictive and DeFi accessible.
                        No finance jargon — just quests, rewards, and growing yields.
                    </p>
                </div>

                {/* Feature cards grid */}
                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:gap-8">
                    {features.map((feature, i) => (
                        <div
                            key={feature.title}
                            className="glass-card group relative overflow-hidden rounded-2xl p-8"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {/* Card glow on hover */}
                            <div
                                className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                style={{ background: feature.glowColor }}
                            />

                            {/* Icon */}
                            <div
                                className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent} text-white shadow-lg`}
                            >
                                {feature.icon}
                            </div>

                            {/* Text */}
                            <h3 className="mt-6 text-xl font-bold text-foreground">
                                {feature.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                {feature.description}
                            </p>

                            {/* Decorative corner line */}
                            <div className="absolute bottom-0 right-0 h-16 w-16 border-b border-r border-mystic-purple/10 rounded-tl-3xl transition-colors duration-300 group-hover:border-mystic-purple/30" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
