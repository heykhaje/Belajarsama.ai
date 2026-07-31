"use client"
import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion'
import { cn } from '@/lib/utils';

export interface PricingPlan {
    name: string;
    price: number;
    features: string[];
    isPopular?: boolean;
    accent: string;
}

interface PricingProps {
    title?: string;
    plans: PricingPlan[];
    className?: string;
}

// Counter Component
const Counter = ({ from, to }: { from: number; to: number }) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    React.useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;
        const controls = animate(from, to, {
            duration: 1,
            onUpdate(value) {
                node.textContent = new Intl.NumberFormat('id-ID').format(value);
            },
        });
        return () => controls.stop();
    }, [from, to]);
    return <span ref={nodeRef} />;
};

// Header Component
const PricingHeader = ({ title }: { title: string }) => (
    <div className="text-center mb-16 relative z-10">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
        >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-ink-text mb-4">
                {title}
            </h1>
            <p className="text-ink-muted max-w-xl mx-auto text-sm md:text-base">
                Pilih paket donasi yang sesuai dengan hati Anda. Dukungan Anda sangat berharga bagi kelangsungan server dan pengembangan AI kami.
            </p>
        </motion.div>
    </div>
);

// BackgroundEffects Component
const BackgroundEffects = () => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-accent-sky/20 rounded-full blur-[1px]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -40, 0],
                            opacity: [0.1, 0.5, 0.1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "24px 24px"
            }} />
        </>
    );
};

// Pricing Card Component
const PricingCard = ({
    plan,
    index
}: {
    plan: PricingPlan;
    index: number
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 20, stiffness: 100 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
                rotateX,
                rotateY,
                perspective: 1000,
            }}
            onMouseMove={(e) => {
                if (!cardRef.current) return;
                const rect = cardRef.current.getBoundingClientRect();
                const centerX = rect.x + rect.width / 2;
                const centerY = rect.y + rect.height / 2;
                mouseX.set((e.clientX - centerX) / rect.width);
                mouseY.set((e.clientY - centerY) / rect.height);
            }}
            onMouseLeave={() => {
                mouseX.set(0);
                mouseY.set(0);
            }}
            className={`relative w-full bg-surface-raised rounded-2xl p-6 border border-surface-border
                shadow-xl shadow-black/20 hover:border-accent-sky/50 hover:shadow-accent-sky/10
                transition-all duration-300 flex flex-col`}
        >
            {plan.isPopular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-accent-sky text-surface-base font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-accent-sky/20">
                        Paling Populer
                    </span>
                </div>
            )}

            <div className="text-center mb-6 pt-4">
                <h3 className="text-lg font-medium text-ink-muted mb-2">{plan.name}</h3>
                <div className="flex items-end justify-center gap-1">
                    <span className="text-lg font-medium text-ink-muted mb-1">Rp</span>
                    <span className="text-4xl font-display font-semibold text-ink-text">
                        <Counter from={0} to={plan.price} />
                    </span>
                </div>
                <div className="text-xs text-ink-muted/50 mt-2 font-mono uppercase tracking-widest">Satu Kali Bayar</div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-surface-border to-transparent mb-6" />

            <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                    <div key={feature} className="flex items-start gap-3">
                        <div className={cn("mt-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-opacity-10", plan.accent.replace('bg-', 'text-').replace('500', '400'), plan.accent.replace('bg-', 'bg-').replace('500', '500/10'))}>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-sm text-ink-text/90 leading-relaxed">{feature}</span>
                    </div>
                ))}
            </div>

            <button
                className={cn(
                    `w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]`,
                    plan.isPopular ? "bg-accent-sky text-surface-base shadow-lg shadow-accent-sky/20" : "bg-surface-base border border-surface-border text-ink-text hover:bg-white/5"
                )}
            >
                Donasi Sekarang
            </button>
        </motion.div>
    );
};

export const PricingContainer = ({ title = "Paket Donasi", plans, className = "" }: PricingProps) => {
    return (
        <div className={`min-h-[75vh] w-full bg-surface-base relative rounded-2xl ${className}`}>
            <BackgroundEffects />
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
                <PricingHeader title={title!} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-sm md:max-w-none mx-auto pt-4">
                    {plans.map((plan, index) => (
                        <PricingCard
                            key={plan.name}
                            plan={plan}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
