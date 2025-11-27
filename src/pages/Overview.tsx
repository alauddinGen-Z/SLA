import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import RecentBreaches from '../components/RecentBreaches';
import RecoveryChart from '../components/RecoveryChart';
import { useDashboardData } from '../hooks/useDashboardData';

export default function Overview() {
    const { stats, loading } = useDashboardData();

    return (
        <Layout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                    <p className="text-gray-400">Real-time insights into your SLA performance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        title="Total Money Recovered"
                        value={loading ? "..." : `$${stats.totalRecovered.toLocaleString()}`}
                        trend={loading ? undefined : "+0.0%"}
                        trendUp={true}
                        highlight={true}
                    />
                    <StatsCard
                        title="Active Contracts"
                        value={loading ? "..." : stats.activeContracts.toString()}
                        trend={loading ? undefined : "+0"}
                        trendUp={true}
                    />
                    <StatsCard
                        title="Pending Claims"
                        value={loading ? "..." : `$${stats.pendingClaims.toLocaleString()}`}
                        trend={loading ? undefined : "Action Required"}
                        trendUp={false}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <RecoveryChart />
                    </div>
                    <div className="lg:col-span-1">
                        <RecentBreaches breaches={stats.recentBreaches} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
