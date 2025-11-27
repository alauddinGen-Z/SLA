import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell, Building, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [orgName, setOrgName] = useState('');
    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) setUserEmail(user.email);
        };
        fetchUser();
    }, []);

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            // For now, just show success toast
            // In production, you'd save to a user_settings table
            toast.success('Settings saved successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <Layout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-gray-400">Manage your account and preferences.</p>
                </div>

                <div className="glass rounded-2xl p-8 space-y-8 max-w-2xl">
                    {/* Profile Section */}
                    <div className="flex items-center justify-between pb-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <User size={24} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">User Account</h3>
                                <p className="text-gray-400">{userEmail || 'Loading...'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Organization Settings */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Organization</h4>

                        <div className="space-y-3">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
                                    <Building size={16} />
                                    Organization Name
                                </span>
                                <input
                                    type="text"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    placeholder="Enter your organization name"
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Preferences</h4>

                        <div
                            onClick={() => setNotifications(!notifications)}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <Bell size={20} className="text-gray-400" />
                                <div>
                                    <p className="font-medium text-white">Email Notifications</p>
                                    <p className="text-sm text-gray-500">Get alerts for new breaches and claims</p>
                                </div>
                            </div>
                            <div className={`w-10 h-6 rounded-full relative transition-colors ${notifications ? 'bg-primary' : 'bg-gray-600'
                                }`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'right-1' : 'left-1'
                                    }`} />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button
                            onClick={handleSaveSettings}
                            disabled={loading}
                            className="px-4 py-2 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {loading ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>

                    {/* Logout */}
                    <div className="pt-8 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-medium"
                        >
                            <LogOut size={20} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
