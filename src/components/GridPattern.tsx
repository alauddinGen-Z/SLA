import { useEffect, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GridPatternProps {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    strokeDasharray?: string;
    className?: string;
}

export function GridPattern({
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    strokeDasharray = '0',
    className,
    ...props
}: GridPatternProps) {
    const id = useId();

    return (
        <svg
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 h-full w-full fill-gray-400/10 stroke-gray-400/10 ${className}`}
            {...props}
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path
                        d={`M.5 ${height}V.5H${width}`}
                        fill="none"
                        strokeDasharray={strokeDasharray}
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
        </svg>
    );
}

export function GridPatternWithSpotlight() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden">
            <GridPattern className="opacity-50" />

            {/* Spotlight effect */}
            <motion.div
                className="pointer-events-none absolute h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
                style={{
                    background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
                    left: mousePosition.x,
                    top: mousePosition.y,
                }}
                animate={{
                    left: mousePosition.x,
                    top: mousePosition.y,
                }}
                transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            />

            {/* Additional ambient lights */}
            <div className="absolute top-0 left-1/4 h-96 w-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-primary/5 rounded-full blur-3xl" />
        </div>
    );
}
