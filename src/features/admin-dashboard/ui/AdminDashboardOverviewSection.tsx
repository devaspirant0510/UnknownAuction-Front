import type React from 'react';
import AdminDashboardOverviewWidget from '@widgets/admin-dashboard/ui/AdminDashboardOverviewWidget';
import { useQueryAdminDashboardOverview } from '@/features/admin-dashboard/lib/useQueryAdminDashboardOverview.ts';

const AdminDashboardOverviewSection: React.FC = () => {
    const { data, isLoading, isError, error } = useQueryAdminDashboardOverview();

    if (isLoading) {
        return (
            <div className='bg-white rounded shadow p-6'>
                <div className='text-lg font-semibold'>대시보드 요약</div>
                <div className='mt-2 text-gray-600'>로딩중...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className='bg-white rounded shadow p-6'>
                <div className='text-lg font-semibold'>대시보드 요약</div>
                <div className='mt-2 text-red-600'>
                    {(error as unknown as Error)?.message || '알 수 없는 에러'}
                </div>
            </div>
        );
    }

    const overview = data?.data;

    if (!overview) {
        return (
            <div className='bg-white rounded shadow p-6'>
                <div className='text-lg font-semibold'>대시보드 요약</div>
                <div className='mt-2 text-gray-600'>표시할 데이터가 없습니다.</div>
            </div>
        );
    }

    return <AdminDashboardOverviewWidget overview={overview} />;
};

export default AdminDashboardOverviewSection;
