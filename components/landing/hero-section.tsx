'use client'

import { useMemo } from 'react'

function Particles() {
    const particles = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            duration: `${8 + Math.random() * 12}s`,
            delay: `${Math.random() * 10}s`,
            size: `${2 + Math.random() * 3}px`,
        }))
    }, [])

    return (
        <div className="particle-container">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        animationDuration: p.duration,
                        animationDelay: p.delay,
                    }}
                />
            ))}
        </div>
    )
}

function FloatingOrbs() {
    return (
        <>
            {/* Purple orb */}
            <div
                className="absolute top-1/4 -left-32 h-64 w-64 rounded-full bg-mystic-purple/10 blur-3xl animate-orb"
            />
            {/* Cyan orb */}
            <div
                className="absolute top-1/2 -right-32 h-80 w-80 rounded-full bg-mystic-cyan/5 blur-3xl animate-orb"
                style={{ animationDelay: '-4s' }}
            />
            {/* Gold orb */}
            <div
                className="absolute bottom-1/4 left-1/3 h-48 w-48 rounded-full bg-mystic-gold/5 blur-3xl animate-orb"
                style={{ animationDelay: '-8s' }}
            />
        </>
    )
}

interface StatBadgeProps {
    label: string
    value: string
    delay: string
}

function StatBadge({ label, value, delay }: StatBadgeProps) {
    return (
        <div
            className="glass-card rounded-xl px-5 py-3 animate-float"
            style={{ animationDelay: delay }}
        >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {label}
            </p>
            <p className="mt-1 text-lg font-bold mystic-gradient-text">{value}</p>
        </div>
    )
}

export function HeroSection() {
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
            {/* Background layers */}
            <div className="absolute inset-0 grid-overlay" />
            <Particles />
            <FloatingOrbs />

            {/* Radial gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(123, 63, 228, 0.08) 0%, transparent 70%)',
                }}
            />

            {/* Content */}
            <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pt-24 text-center">
                {/* Eyebrow badge */}
                <div className="mb-8 animate-fade-in-up">
                    <span className="inline-flex items-center gap-2 rounded-full border border-mystic-purple/30 bg-mystic-purple/10 px-4 py-1.5 text-xs font-medium text-mystic-purple-light">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-mystic-emerald animate-pulse" />
                        The Duolingo of DeFi — Now Live
                    </span>
                </div>

                {/* Main heading */}
                <h1 className="animate-fade-in-up text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                    style={{ animationDelay: '0.1s' }}
                >
                    <span className="block text-foreground">Your Quest for</span>
                    <span className="block mystic-gradient-text mt-2">Yield Begins Here</span>
                </h1>

                {/* Subtitle */}
                <p
                    className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg animate-fade-in-up"
                    style={{ animationDelay: '0.2s' }}
                >
                    Transform passive crypto holding into an epic RPG adventure.
                    Level up your Yield Avatar through micro-deposits, daily quests,
                    and community challenges — all powered by automated DeFi optimization.
                </p>

                {/* CTAs */}
                <div
                    className="mt-10 flex flex-col items-center gap-4 sm:flex-row animate-fade-in-up"
                    style={{ animationDelay: '0.3s' }}
                >
                    <a
                        href="#features"
                        className="btn-mystic-primary flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                            <path d="M2 17L12 22L22 17" />
                            <path d="M2 12L12 17L22 12" />
                        </svg>
                        Begin Your Quest
                    </a>
                    <a
                        href="#how-it-works"
                        className="btn-mystic-glass flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold"
                    >
                        Learn More
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17L17 7" />
                            <path d="M7 7H17V17" />
                        </svg>
                    </a>
                </div>

                {/* Floating stat badges */}
                <div
                    className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-in-up"
                    style={{ animationDelay: '0.5s' }}
                >
                    <StatBadge label="Total Value Locked" value="$12.4M" delay="0s" />
                    <StatBadge label="Average APY" value="14.2%" delay="0.5s" />
                    <StatBadge label="Active Questers" value="8,420" delay="1s" />
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a1a] to-transparent" />
        </section>
    )
}
