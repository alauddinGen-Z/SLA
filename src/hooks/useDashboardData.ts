import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface DashboardStats {
    totalRecovered: number;
    activeContracts: number;
    pendingClaims: number;
    recentBreaches: any[];
}

export function useDashboardData() {
    const [stats, setStats] = useState<DashboardStats>({
        totalRecovered: 0,
        activeContracts: 0,
        pendingClaims: 0,
        recentBreaches: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Helper function to check if error is auth-related
                const isAuthError = (error: any) => {
                    return error && (
                        error.code === 'PGRST301' || // JWT expired
                        error.code === 'PGRST303' || // JWT expired
                        error.message?.includes('JWT') ||
                        error.message?.includes('401') ||
                        error.message?.includes('Unauthorized')
                    );
                };

                // 1. Get Active Contracts Count
                const { count: contractsCount, error: contractsError } = await supabase
                    .from('contracts')
                    .select('*', { count: 'exact', head: true });

                if (isAuthError(contractsError)) {
                    await supabase.auth.signOut();
                    window.location.href = '/login';
                    return;
                }

                // 2. Get Incidents for Money Stats
                const { data: incidents, error: incidentsError } = await supabase
                    .from('incidents')
                    .select('penalty_amount, status, created_at, contract_id');

                if (isAuthError(incidentsError)) {
                    await supabase.auth.signOut();
                    window.location.href = '/login';
                    return;
                }

                let recovered = 0;
                let pending = 0;
                const breaches: any[] = [];

                if (incidents) {
                    incidents.forEach((inc: any) => {
                        const amount = Number(inc.penalty_amount) || 0;
                        if (inc.status === 'recovered') {
                            recovered += amount;
                        } else if (inc.status === 'pending' || inc.status === 'detected') {
                            pending += amount;
                        }

                        // Simplified breach object for UI
                        breaches.push({
                            id: inc.id || Math.random(),
                            vendor: 'Unknown Vendor',
                            issue: 'SLA Breach',
                            penalty: `$${amount.toLocaleString()}`,
                            status: inc.status,
                            time: new Date(inc.created_at).toLocaleDateString(),
                        });
                    });
                }

                setStats({
                    totalRecovered: recovered,
                    activeContracts: contractsCount || 0,
                    pendingClaims: pending,
                    recentBreaches: breaches.slice(0, 5),
                });
            } catch (err) {
                // Silently handle errors - user will see empty/zero stats
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return { stats, loading };
}
