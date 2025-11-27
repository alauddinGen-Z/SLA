
import { clsx } from 'clsx';

interface StatsCardProps {
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    highlight?: boolean;
}

export default function StatsCard({ title, value, trend, trendUp, highlight }: StatsCardProps) {
    return (
        <div className={clsx(
            "relative overflow-hidden rounded-2xl p-6 glass transition-all duration-300 hover:bg-white/10",
            highlight && "border-primary/50"
        )}>
            {highlight && (
                <div className="absolute inset-0 pointer-events-none rounded-2xl border border-primary/50 [mask-image:linear-gradient(transparent,black)]">
                    <div className="absolute inset-0 rounded-2xl border border-primary/50 animate-border-beam" />
                </div>
            )}

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-gray-400">{title}</h3>
                    {trend && (
                        <span className={clsx(
                            "text-xs font-medium px-2 py-1 rounded-full",
                            trendUp ? "bg-primary/20 text-primary" : "bg-red-500/20 text-red-500"
                        )}>
                            {trend}
                        </span>
                    )}
                </div>

                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
                </div>

                {highlight && (
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
                )}
            </div>
        </div>
    );
}
