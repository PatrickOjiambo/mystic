'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Wireframe, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function BrutalistArtifact() {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (!meshRef.current) return
        const t = state.clock.getElapsedTime()
        meshRef.current.rotation.x = Math.sin(t / 4)
        meshRef.current.rotation.y = Math.sin(t / 2)
    })

    return (
        <mesh ref={meshRef} scale={1.8}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial color="#000000" />
            <Wireframe
                stroke="#eae3d9" // Bone white
                thickness={0.03}
                colorBackfaces={false}
            />
        </mesh>
    )
}

function FloatingNumbers() {
    const meshRef = useRef<THREE.InstancedMesh>(null)

    return null // Placeholder for potential future glitch elements
}

export function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden border-b border-iron-grey pb-12 pt-32">
            {/* 3D Background Element */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <BrutalistArtifact />
                </Canvas>
            </div>

            <div className="relative z-10 px-6 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">

                    {/* Main Typography */}
                    <div className="col-span-1 md:col-span-8">
                        <div className="font-mono text-xs uppercase tracking-[0.2em] text-blood-crimson mb-6 border-l border-blood-crimson pl-4">
                            Version 1.0.0 / Protocol Live
                        </div>

                        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-serif leading-[0.85] tracking-tighter">
                            <span className="block hover:text-blood-crimson transition-colors duration-500 cursor-default">YOUR</span>
                            <span className="block hover:text-tarnished-gold transition-colors duration-500 cursor-default">QUEST</span>
                            <span className="block italic text-iron-grey hover:text-bone-white transition-colors duration-500 cursor-default">BEGINS.</span>
                        </h1>
                    </div>

                    {/* Call to action & brutal text block */}
                    <div className="col-span-1 md:col-span-4 flex flex-col gap-8 md:pl-12 md:pb-8">
                        <p className="font-mono text-sm leading-relaxed text-bone-white/80">
                            Transform passive crypto holding into a raw, uncompromising RPG architecture. No soft gradients. No AI slop. Just pure yield optimization and brutal efficiency.
                        </p>

                        <div className="flex flex-col gap-4 items-start w-full">
                            <a href="/terminal" className="brutalist-button w-full">
                                [ ENGAGE PROTOCOL ]
                            </a>
                            <div className="flex w-full mt-4 border-t border-iron-grey pt-4">
                                <div className="flex-1">
                                    <div className="font-mono text-[10px] text-iron-grey uppercase tracking-widest mb-1">Status</div>
                                    <div className="font-mono text-xs text-bone-white uppercase">Operational</div>
                                </div>
                                <div className="flex-1 border-l border-iron-grey pl-4">
                                    <div className="font-mono text-[10px] text-iron-grey uppercase tracking-widest mb-1">Network</div>
                                    <div className="font-mono text-xs text-bone-white uppercase">L2 Focused</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
