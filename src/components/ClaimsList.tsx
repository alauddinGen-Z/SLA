import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, DollarSign, CheckCircle, Send } from 'lucide-react';
import PaddlePayButton from './PaddlePayButton';
import { toast } from 'sonner';

export default function ClaimsList({ refreshTrigger }: { refreshTrigger: number }) {
    const [claims, setClaims] = useState<any[]>([]);
    const [userEmail, setUserEmail] = useState<string>('');
    const [approvingId, setApprovingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchClaims = async () => {
            const { data } = await supabase
                .from('claims')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (data) setClaims(data);
        };

        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) setUserEmail(user.email);
        };

        fetchClaims();
        fetchUser();
    }, [refreshTrigger]);

    const approveClaim = async (claimId: string) => {
        setApprovingId(claimId);

        try {
            const { error } = await supabase
                .from('claims')
                .update({ status: 'sent' })
                .eq('id', claimId);

            if (error) throw error;

            // Update local state
            setClaims(claims.map(claim =>
                claim.id === claimId ? { ...claim, status: 'sent' } : claim
            ));

            toast.success('Claim approved! Email draft ready to send.');
        } catch (error: any) {
            console.error('Error approving claim:', error);
            toast.error(error.message || 'Failed to approve claim');
        } finally {
            setApprovingId(null);
        }
    };

    if (claims.length === 0) return null;

    return (
        <div className="glass p-6 rounded-2xl border border-white/10 mt-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Mail className="text-primary" />
                Drafted Claims (Agent C)
            </h3>

            <div className="space-y-4">
                {claims.map((claim) => (
                    <div key={claim.id} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2 text-primary font-mono font-bold">
                                <DollarSign size={16} />
                                ${claim.refund_amount}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider font-bold ${claim.status === 'sent'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                                    : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20'
                                }`}>
                                {claim.status}
                            </span>
                        </div>

                        <div className="bg-black/30 p-3 rounded-lg text-gray-300 text-sm font-mono whitespace-pre-wrap max-h-40 overflow-y-auto custom-scrollbar">
                            {claim.email_body}
                        </div>

                        <div className="mt-3 flex justify-between items-center">
                            {claim.status === 'draft' ? (
                                <button
                                    onClick={() => approveClaim(claim.id)}
                                    disabled={approvingId === claim.id}
                                    className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                                >
                                    {approvingId === claim.id ? (
                                        <>
                                            <Send size={12} className="animate-pulse" /> Sending...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={12} /> Approve & Send
                                        </>
                                    )}
                                </button>
                            ) : (
                                <span className="text-xs text-green-400 flex items-center gap-1">
                                    <CheckCircle size={12} /> Email Sent
                                </span>
                            )}

                            {claim.status === 'draft' && (
                                <PaddlePayButton
                                    amount={claim.refund_amount || 10}
                                    email={userEmail}
                                    claimId={claim.id}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
