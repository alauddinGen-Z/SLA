import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import { FileText, Calendar, X, Code } from 'lucide-react';
import TableSkeleton from '../components/TableSkeleton';
import EmptyState from '../components/EmptyState';

interface Contract {
    id: string;
    file_url: string;
    created_at: string;
    extracted_data_json?: any;
}

export default function Contracts() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [showRulesModal, setShowRulesModal] = useState(false);

    useEffect(() => {
        const fetchContracts = async () => {
            const { data } = await supabase
                .from('contracts')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setContracts(data);
            setLoading(false);
        };
        fetchContracts();
    }, []);

    const viewRules = (contract: Contract) => {
        setSelectedContract(contract);
        setShowRulesModal(true);
    };

    return (
        <Layout>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Contracts</h1>
                        <p className="text-gray-400">Manage your uploaded SLA agreements.</p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/upload'}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all flex items-center gap-2"
                    >
                        <FileText size={18} />
                        Upload New Contract
                    </button>
                </div>

                <div className="glass rounded-2xl overflow-hidden">
                    {!loading && contracts.length === 0 ? (
                        <EmptyState
                            icon="file"
                            title="No contracts yet"
                            description="Upload your first SLA contract to start monitoring breaches and recovering money."
                            action={{
                                label: "Upload Contract",
                                onClick: () => window.location.href = '/upload'
                            }}
                        />
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400">
                                <tr>
                                    <th className="p-4 font-medium">Name</th>
                                    <th className="p-4 font-medium">Uploaded</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <TableSkeleton rows={5} />
                                ) : (
                                    contracts.map((contract) => (
                                        <tr key={contract.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                        <FileText size={20} />
                                                    </div>
                                                    <span className="font-medium text-white">
                                                        {contract.file_url?.split('/').pop()?.split('?')[0] || 'Unknown Contract'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    {new Date(contract.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/20">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => viewRules(contract)}
                                                    className="px-3 py-1 text-sm hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white flex items-center gap-2"
                                                >
                                                    <Code size={16} />
                                                    View Rules
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* View Rules Modal */}
            {showRulesModal && selectedContract && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Extracted SLA Rules</h2>
                            <button
                                onClick={() => setShowRulesModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <pre className="bg-black/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                                {JSON.stringify(selectedContract.extracted_data_json, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
