import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import { AlertTriangle, Clock } from 'lucide-react';
import TableSkeleton from '../components/TableSkeleton';
import EmptyState from '../components/EmptyState';

interface Incident {
    id: string;
    downtime_duration: string;
    created_at: string;
    contracts: {
        file_url: string;
    };
}

export default function Incidents() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIncidents = async () => {
            const { data } = await supabase
                .from('incidents')
                .select('*, contracts(file_url)')
                .order('created_at', { ascending: false });

            if (data) setIncidents(data);
            setLoading(false);
        };
        fetchIncidents();
    }, []);

    return (
        <Layout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Incidents</h1>
                    <p className="text-gray-400">Track downtime events and potential breaches.</p>
                </div>

                <div className="glass rounded-2xl overflow-hidden">
                    {!loading && incidents.length === 0 ? (
                        <EmptyState
                            icon="alert"
                            title="No incidents yet"
                            description="SLA breaches will appear here once detected. Use the Simulate Breach feature to test the system."
                        />
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400">
                                <tr>
                                    <th className="p-4 font-medium">Contract</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Duration</th>
                                    <th className="p-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <TableSkeleton rows={5} />
                                ) : (
                                    incidents.map((incident) => (
                                        <tr key={incident.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                                                        <AlertTriangle size={20} />
                                                    </div>
                                                    <span className="font-medium text-white">
                                                        {incident.contracts?.file_url?.split('/').pop()?.split('?')[0] || 'Unknown Contract'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-400">
                                                {new Date(incident.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-white">
                                                    <Clock size={16} className="text-gray-400" />
                                                    {incident.downtime_duration || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">
                                                    Processing
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    );
}
