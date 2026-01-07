import type React from 'react';
import { useMemo, useState } from 'react';
import AdminLayout from '@/shared/layout/AdminLayout';
import type { AdminUserStatus } from '@/entities/admin/user';
import AdminUserFilterBar from '@/widgets/admin-user/ui/AdminUserFilterBar';
import AdminUserListWidget from '@/widgets/admin-user/ui/AdminUserListWidget';
import { useQueryAdminUserList } from '@/features/admin-user/lib/useQueryAdminUserList';

const AdminUserListSection: React.FC = () => {
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [status, setStatus] = useState<AdminUserStatus | undefined>(undefined);

    // UI only
    const [searchKeyword, setSearchKeyword] = useState('');

    const queryParams = useMemo(() => ({ page, size, status }), [page, size, status]);

    const { data, isLoading, isError, error } = useQueryAdminUserList(queryParams);

    return (
        <AdminLayout>
            <div className='p-6 space-y-6'>
                <div className='text-3xl font-bold'>👤 유저 관리</div>

                <AdminUserFilterBar
                    status={status}
                    onChangeStatus={(next) => {
                        setStatus(next);
                        setPage(0);
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
                    <AdminUserListWidget pageData={data.data} page={page} onChangePage={setPage} />
                ) : (
                    <div className='bg-white rounded shadow p-6 text-gray-600'>
                        표시할 데이터가 없습니다.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminUserListSection;
