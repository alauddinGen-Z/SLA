import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertTriangle, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface SimulateBreachProps {
    contractId: string | null;
    onClaimGenerated: () => void;
}

export default function SimulateBreach({ contractId, onClaimGenerated }: SimulateBreachProps) {
    const [loading, setLoading] = useState(false);

    const handleSimulate = async () => {
        if (!contractId) {
            toast.error("No contract selected/available.");
            return;
        }

        try {
            setLoading(true);

            // 1. Create a Fake Incident
            const { data: incident, error: incidentError } = await supabase
                .from('incidents')
                .insert({
                    contract_id: contractId,
                    downtime_duration: 60, // 1 hour
                    penalty_amount: 0, // To be calculated
                    status: 'open'
                })
                .select()
                .maybeSingle();

            if (incidentError || !incident) {
                throw incidentError || new Error('Failed to create incident');
            }

            toast.info("Incident detected! Triggering Enforcer Agent...");

            // 2. Call Enforcer Agent
            const { data: claim, error: enforcerError } = await supabase.functions.invoke('enforcer', {
                body: {
                    incident_id: incident.id,
                    contract_id: contractId,
                    downtime_minutes: 60
                }
            });

            if (enforcerError) throw enforcerError;

            toast.success(`Claim Drafted! Refund: $${claim.refund_amount}`);
            onClaimGenerated();

        } catch (error: any) {
            console.error("Simulation failed:", error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass p-6 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="text-red-500" />
                    Breach Simulator
                </h3>
            </div>
            <p className="text-gray-400 mb-6">
                Test the "Enforcer" agent by simulating a 1-hour service outage.
            </p>

            <button
                onClick={handleSimulate}
                disabled={loading || !contractId}
                className="w-full py-4 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Zap className="animate-pulse" />
                ) : (
                    <Zap />
                )}
                {loading ? "Enforcing Rules..." : "🔴 Simulate 1 Hour Outage"}
            </button>
        </div>
    );
}
