import React from 'react';
import { LayoutDashboard, FileText, AlertTriangle, Settings, LogOut, Upload } from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface LayoutProps {
    children: React.ReactNode;
}

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, path?: string, active?: boolean, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group",
            active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
        )}>
        <Icon size={20} className={clsx("transition-colors", active ? "text-primary" : "group-hover:text-primary")} />
        <span className="font-medium">{label}</span>
    </div>
);

export default function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
        { icon: Upload, label: "Upload Contract", path: "/dashboard/upload" },
        { icon: FileText, label: "Contracts", path: "/dashboard/contracts" },
        { icon: AlertTriangle, label: "Incidents", path: "/dashboard/incidents" },
        { icon: Settings, label: "Settings", path: "/dashboard/settings" },
    ];

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden liquid-gradient">
            {/* Sidebar */}
            <div className="w-64 h-full p-6 flex flex-col glass border-r border-white/5">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">SLA-Sentinel</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            active={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                        />
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-white">Admin User</p>
                            <p className="text-xs text-gray-500">admin@company.com</p>
                        </div>
                        <LogOut size={16} onClick={handleLogout} className="text-gray-500 hover:text-white cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 h-full overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
