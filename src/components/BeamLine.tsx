import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface BeamLineProps {
    className?: string;
}

export function BeamLine({ className = '' }: BeamLineProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const height = useTransform(scrollYProgress, [0, 0.5], ['0%', '100%']);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 1, 1]);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Background line */}
            <div className="absolute left-1/2 top-0 w-px h-full bg-gray-800 -translate-x-1/2" />

            {/* Animated beam */}
            <motion.div
                className="absolute left-1/2 top-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent -translate-x-1/2"
                style={{ height, opacity }}
            >
                {/* Glowing effect */}
                <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50"
                    style={{ opacity }}
                />
            </motion.div>
        </div>
    );
}

interface ConnectedStepsProps {
    steps: {
        title: string;
        description: string;
        icon: React.ReactNode;
    }[];
}

export function ConnectedSteps({ steps }: ConnectedStepsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start center', 'end center'],
    });

    return (
        <div ref={containerRef} className="relative py-12">
            {/* Vertical connecting line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
                <div className="absolute inset-0 bg-gray-800" />
                <motion.div
                    className="absolute top-0 left-0 right-0 bg-gradient-to-b from-primary via-primary/80 to-transparent"
                    style={{
                        height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
                    }}
                />
            </div>

            {/* Steps */}
            <div className="space-y-24 relative z-10">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="flex items-center gap-8"
                    >
                        {/* Icon circle */}
                        <div className="flex-shrink-0 w-16 h-16 rounded-full glass flex items-center justify-center text-primary border-2 border-primary/20">
                            {step.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-gray-400">{step.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
