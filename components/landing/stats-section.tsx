'use client'

import { useState, useEffect, useRef } from 'react'

function useCountUp(target: number, duration: number, shouldStart: boolean) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!shouldStart) return

        let startTime: number | null = null
        let animationFrame: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)

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

export function StatsSection() {
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
            { threshold: 0.1 },
        )

        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    const tvl = useCountUp(124, 2000, isVisible)
    const questers = useCountUp(8420, 2500, isVisible)
    const apy = useCountUp(14, 1500, isVisible)

    return (
        <section id="stats" className="bg-void-black border-b-8 border-tarnished-gold overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32" ref={ref}>

                <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-iron-grey mb-16 border-b border-iron-grey pb-4">
                    Network Data Telemetry
                </h2>

                <div className="flex flex-col gap-24">

                    {/* Stat 1 */}
                    <div className="relative group">
                        <div className="flex flex-col md:flex-row md:items-end justify-between border-t border-iron-grey pt-8 group-hover:border-bone-white transition-colors duration-500">
                            <span className="font-serif text-5xl md:text-7xl text-bone-white uppercase tracking-tighter mb-4 md:mb-0 group-hover:text-blood-crimson transition-colors z-10 w-full md:w-1/2">
                                Total Value Locked.
                            </span>
                            <span className="font-serif text-8xl sm:text-[10rem] md:text-[12rem] text-iron-grey leading-none tracking-tighter w-full md:w-1/2 md:text-right group-hover:text-bone-white transition-colors">
                                ${tvl}M
                            </span>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="relative group">
                        <div className="flex flex-col md:flex-row md:items-end justify-between border-t border-iron-grey pt-8 group-hover:border-bone-white transition-colors duration-500">
                            <span className="font-serif text-5xl md:text-7xl text-bone-white uppercase tracking-tighter mb-4 md:mb-0 group-hover:text-blood-crimson transition-colors z-10 w-full md:w-1/2">
                                Active Operatives.
                            </span>
                            <span className="font-serif text-8xl sm:text-[10rem] md:text-[12rem] text-iron-grey leading-none tracking-tighter w-full md:w-1/2 md:text-right group-hover:text-bone-white transition-colors">
                                {questers.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="relative group">
                        <div className="flex flex-col md:flex-row md:items-end justify-between border-t border-iron-grey pt-8 group-hover:border-bone-white transition-colors duration-500">
                            <span className="font-serif text-5xl md:text-7xl text-bone-white uppercase tracking-tighter mb-4 md:mb-0 group-hover:text-blood-crimson transition-colors z-10 w-full md:w-1/2">
                                Average APY.
                            </span>
                            <span className="font-serif text-8xl sm:text-[10rem] md:text-[12rem] text-iron-grey leading-none tracking-tighter w-full md:w-1/2 md:text-right group-hover:text-tarnished-gold transition-colors">
                                {apy}.2%
                            </span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    )
}
