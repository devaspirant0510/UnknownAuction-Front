import AdminLayout from '@shared/layout/AdminLayout.tsx';
import CategoryChartWidget from '@widgets/admin/CategoryChartWidget.tsx';
import AdminDashboardOverviewSection from '@/features/admin-dashboard/ui/AdminDashboardOverviewSection';

const AdminHomePage = () => {
    return (
        <AdminLayout>
            <div className='p-6 space-y-6'>
                <div className='text-3xl font-bold'>📊 관리자 페이지</div>

                {/* 대시보드 요약(overview API) */}
                <AdminDashboardOverviewSection />

                {/* 카테고리 통계(위젯으로 이동) */}
                <div className={'flex'}>
                    <div className={'flex-1'}>
                        <CategoryChartWidget />
                    </div>
                    <div className={'flex-1'}></div>
                </div>

                {/* 최근 낙찰된 상품 그래프(미구현) */}
                <div className='bg-white rounded shadow p-6'>
                    <div className='text-xl font-semibold mb-4'>최근 낙찰된 상품</div>
                    <div>미구현</div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminHomePage;
