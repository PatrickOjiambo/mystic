'use client'

import { useState, useEffect, useRef } from 'react'

interface StatCardProps {
    label: string
    value: number
    prefix?: string
    suffix?: string
    color: string
}

function useCountUp(target: number, duration: number, shouldStart: boolean) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!shouldStart) return

        let startTime: number | null = null
        let animationFrame: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        animationFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrame)
    }, [target, duration, shouldStart])

    return count
}

function StatCard({ label, value, prefix = '', suffix = '', color }: StatCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.3 },
        )

        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    const count = useCountUp(value, 2000, isVisible)

    return (
        <div ref={ref} className="glass-card rounded-2xl p-8 text-center">
            <div
                className="mx-auto mb-4 h-1 w-12 rounded-full"
                style={{ background: color }}
            />
            <p className="text-3xl font-bold text-foreground sm:text-4xl">
                {prefix}
                {count.toLocaleString()}
                {suffix}
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">{label}</p>
        </div>
    )
}

const stats = [
    {
        label: 'Total Value Locked',
        value: 12400000,
        prefix: '$',
        color: '#7b3fe4',
    },
    {
        label: 'Active Questers',
        value: 8420,
        color: '#00e5ff',
    },
    {
        label: 'Quests Completed',
        value: 142000,
        color: '#ffd700',
    },
    {
        label: 'Average APY',
        value: 14,
        suffix: '.2%',
        color: '#00ff88',
    },
]

export function StatsSection() {
    return (
        <section id="stats" className="relative py-24 sm:py-32">
            {/* Background accent */}
            <div className="absolute inset-0 shimmer-bg opacity-30" />

            <div className="relative mx-auto max-w-7xl px-6">
                {/* Section header */}
                <div className="mx-auto max-w-2xl text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-mystic-gold">
                        Protocol Stats
                    </span>
                    <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        The Numbers{' '}
                        <span className="mystic-gradient-text">Speak</span>
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                        Real-time metrics from the Mystic protocol. Every quest completed adds to our
                        collective adventure.
                    </p>
                </div>

                {/* Stats grid */}
                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <StatCard
                            key={stat.label}
                            label={stat.label}
                            value={stat.value}
                            prefix={stat.prefix}
                            suffix={stat.suffix}
                            color={stat.color}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
