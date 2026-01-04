import type React from 'react';
import { useMemo, useState } from 'react';
import AdminLayout from '@/shared/layout/AdminLayout';
import { useQueryAdminLiveAuctionList } from '@/features/admin-auction/lib/useQueryAdminLiveAuctionList';
import { useQueryGetCategories } from '@/features/auction/lib/useQueryGetCategories';
import AdminLiveAuctionFilterBar from '@/widgets/admin-auction/ui/AdminLiveAuctionFilterBar';
import AdminLiveAuctionListWidget from '@/widgets/admin-auction/ui/AdminLiveAuctionListWidget';
import { AdminAuctionStatus } from '@/features/admin-auction';

const AdminLiveAuctionListSection: React.FC = () => {
    const [page, setPage] = useState(1); // 백엔드 예시가 page=1 이라 그대로 시작. 필요하면 0 으로 바꿔도 됨.
    const [size] = useState(10);

    const [status, setStatus] = useState<AdminAuctionStatus | undefined>(undefined);
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [searchKeyword, setSearchKeyword] = useState(''); // UI only

    const { data: categoryData } = useQueryGetCategories();
    const categoryOptions = categoryData?.data ?? [];

    const queryParams = useMemo(
        () => ({ page, size, status, category }),
        [page, size, status, category],
    );

    const { data, isLoading, isError, error } = useQueryAdminLiveAuctionList(queryParams);

    return (
        <AdminLayout>
            <div className='p-6 space-y-6'>
                <div className='text-3xl font-bold'>🛎️ 실시간 경매 관리</div>

                <AdminLiveAuctionFilterBar
                    status={status}
                    onChangeStatus={(next) => {
                        setStatus(next);
                        setPage(1);
                    }}
                    category={category}
                    categories={categoryOptions.map((c) => c.name)}
                    onChangeCategory={(next) => {
                        setCategory(next);
                        setPage(1);
                    }}
                    searchKeyword={searchKeyword}
                    onChangeSearchKeyword={setSearchKeyword}
                />

                {isLoading ? (
                    <div className='bg-white rounded shadow p-6'>로딩중...</div>
                ) : isError ? (
                    <div className='bg-white rounded shadow p-6 text-red-600'>
                        {(error as unknown as Error)?.message || '알 수 없는 에러'}
                    </div>
                ) : data?.data ? (
                    <AdminLiveAuctionListWidget
                        pageData={data.data}
                        page={page}
                        onChangePage={setPage}
                    />
                ) : (
                    <div className='bg-white rounded shadow p-6 text-gray-600'>
                        표시할 데이터가 없습니다.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminLiveAuctionListSection;
