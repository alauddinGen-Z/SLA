import React, { useState, useCallback } from 'react';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import RecentBreaches from '../components/RecentBreaches';
import SimulateBreach from '../components/SimulateBreach';
import ClaimsList from '../components/ClaimsList';
import { Upload, Loader2, FileCheck } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export default function UploadContract() {
    const { stats, loading: dataLoading } = useDashboardData();
    const [uploading, setUploading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [refreshClaims, setRefreshClaims] = useState(0);
    const [contractId, setContractId] = useState<string | null>(null);

    // Fetch the latest contract ID for simulation
    React.useEffect(() => {
        const fetchLatestContract = async () => {
            const { data } = await supabase.from('contracts').select('id').order('created_at', { ascending: false }).limit(1).maybeSingle();
            if (data) setContractId(data.id);
        };
        fetchLatestContract();
    }, [uploadSuccess]);

    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setUploadSuccess(false);

            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('contract_docs')
                .upload(filePath, file);

            if (uploadError) {
                if (uploadError.message.includes('bucket not found')) {
                    throw new Error('Storage bucket "contract_docs" not found. Please run the SQL migration.');
                }
                throw uploadError;
            }

            setUploading(false);
            setScanning(true);

            // 2. Trigger Paralegal Agent
            const { data, error: functionError } = await supabase.functions.invoke('paralegal', {
                body: { file_path: filePath, file_name: file.name },
            });

            if (functionError) throw functionError;

            setScanning(false);
            setUploadSuccess(true);

            toast.success(`Contract Scanned! Found ${data?.length || 0} SLA rules.`);

        } catch (error: any) {
            let msg = error.message;
            if (msg.includes('row-level security policy')) {
                msg = 'Database permission error. Please check RLS policies.';
            } else if (msg.includes('relation') && msg.includes('does not exist')) {
                msg = 'Database tables missing. Please run the SQL migration.';
            }
            toast.error('Error: ' + msg);
            setUploading(false);
            setScanning(false);
        }
    }, []);

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Contract Enforcement</h1>
                    <p className="text-gray-400">Monitor SLAs and automate penalty recovery.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        title="Total Money Recovered"
                        value={dataLoading ? "..." : `$${stats.totalRecovered.toLocaleString()}`}
                        trend={dataLoading ? undefined : "+0.0%"}
                        trendUp={true}
                        highlight={true}
                    />
                    <StatsCard
                        title="Active Contracts"
                        value={dataLoading ? "..." : stats.activeContracts.toString()}
                        trend={dataLoading ? undefined : "+0"}
                        trendUp={true}
                    />
                    <StatsCard
                        title="Pending Claims"
                        value={dataLoading ? "..." : `$${stats.pendingClaims.toLocaleString()}`}
                        trend={dataLoading ? undefined : "Action Required"}
                        trendUp={false}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Upload Zone */}
                        <div className="glass rounded-2xl p-8 border-dashed border-2 border-white/10 hover:border-primary/50 transition-colors relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
                            <input
                                type="file"
                                accept=".pdf,.txt"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                disabled={uploading || scanning}
                            />

                            {uploading || scanning ? (
                                <div className="text-center z-10">
                                    <Loader2 size={48} className="text-primary animate-spin mb-4 mx-auto" />
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        {uploading ? 'Uploading Contract...' : 'Paralegal Agent Scanning...'}
                                    </h3>
                                    <p className="text-gray-400">Extracting SLA logic and penalty clauses.</p>
                                </div>
                            ) : uploadSuccess ? (
                                <div className="text-center z-10">
                                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 mx-auto">
                                        <FileCheck size={40} className="text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Scan Complete</h3>
                                    <p className="text-gray-400 mb-6">Contract rules have been extracted.</p>
                                    <button className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors" onClick={() => setUploadSuccess(false)}>
                                        Upload Another
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center z-10 pointer-events-none">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                                        <Upload size={40} className="text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Upload Contract PDF</h3>
                                    <p className="text-gray-400 text-center max-w-md mb-8 mx-auto">
                                        Drag and drop your SLA contracts here. Our AI will automatically extract penalty clauses and enforcement rules.
                                    </p>
                                    <span className="px-6 py-3 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 transition-colors inline-block">
                                        Select Files
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Claims List */}
                        <ClaimsList refreshTrigger={refreshClaims} />
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-1 space-y-8">
                        <SimulateBreach
                            contractId={contractId}
                            onClaimGenerated={() => setRefreshClaims(prev => prev + 1)}
                        />
                        <RecentBreaches breaches={stats.recentBreaches} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
