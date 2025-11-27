export default function TableSkeleton({ rows = 3 }: { rows?: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                    <td className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/10" />
                            <div className="h-4 bg-white/10 rounded w-32" />
                        </div>
                    </td>
                    <td className="p-4">
                        <div className="h-4 bg-white/10 rounded w-24" />
                    </td>
                    <td className="p-4">
                        <div className="h-6 bg-white/10 rounded-full w-16" />
                    </td>
                    <td className="p-4">
                        <div className="h-8 bg-white/10 rounded w-20" />
                    </td>
                </tr>
            ))}
        </>
    );
}
