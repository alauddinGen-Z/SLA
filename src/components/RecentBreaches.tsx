import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface RecentBreachesProps {
    breaches: any[];
}

export default function RecentBreaches({ breaches }: RecentBreachesProps) {
    if (!breaches || breaches.length === 0) {
        return (
            <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Recent Breaches</h3>
                <p className="text-gray-400 text-sm">No recent breaches detected.</p>
            </div>
        );
    }

    return (
        <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Recent Breaches</h3>
            <div className="space-y-4">
                {breaches.map((breach, index) => (
                    <motion.div
                        key={breach.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-white">{breach.vendor}</h4>
                                <p className="text-sm text-gray-400">{breach.issue}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="font-bold text-white">{breach.penalty}</p>
                            <p className="text-xs text-gray-500">{breach.time}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
