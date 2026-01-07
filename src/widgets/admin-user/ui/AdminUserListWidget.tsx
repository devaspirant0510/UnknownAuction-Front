import type React from 'react';
import type { Page } from '@/entities/common';
import type { AdminUserListItem } from '@/entities/admin/user';
import AdminUserListTable from '@/widgets/admin-user/ui/AdminUserListTable';
import AdminPagination from '@/widgets/admin-user/ui/AdminPagination';

type Props = {
    pageData: Page<AdminUserListItem>;
    page: number;
    onChangePage: (nextPage: number) => void;
};

const AdminUserListWidget: React.FC<Props> = ({ pageData, page, onChangePage }) => {
    return (
        <div className='space-y-4'>
            <AdminUserListTable items={pageData.content} />
            <div className='bg-white rounded shadow p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <div className='text-sm text-gray-600'>
                    총 {pageData.totalElements.toLocaleString('ko-KR')}명 · {page + 1}/
                    {pageData.totalPages} 페이지
                </div>
                <AdminPagination
                    page={page}
                    totalPages={pageData.totalPages}
                    onChangePage={onChangePage}
                />
            </div>
        </div>
    );
};

export default AdminUserListWidget;
