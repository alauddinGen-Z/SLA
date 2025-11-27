import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RecoveryChartProps {
    data?: any[];
}

export default function RecoveryChart({ data = [] }: RecoveryChartProps) {
    // Sample data if none provided
    const chartData = data.length > 0 ? data : [
        { month: 'Jan', recovered: 0 },
        { month: 'Feb', recovered: 0 },
        { month: 'Mar', recovered: 0 },
        { month: 'Apr', recovered: 0 },
        { month: 'May', recovered: 0 },
        { month: 'Jun', recovered: 0 },
    ];

    return (
        <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Recovery Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3F3F46" />
                    <XAxis
                        dataKey="month"
                        stroke="#9CA3AF"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#18181B',
                            border: '1px solid #3F3F46',
                            borderRadius: '8px',
                            color: '#FFF'
                        }}
                        formatter={(value: any) => [`$${value}`, 'Recovered']}
                    />
                    <Line
                        type="monotone"
                        dataKey="recovered"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: '#10B981', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
