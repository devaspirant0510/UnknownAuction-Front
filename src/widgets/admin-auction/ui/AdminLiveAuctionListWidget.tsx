import type React from 'react';
import type { Page } from '@/entities/common';
import AdminLiveAuctionListTable from '@/widgets/admin-auction/ui/AdminLiveAuctionListTable';
import AdminPagination from '@/widgets/admin-auction/ui/AdminPagination';
import { AdminLiveAuctionListItem } from '@/features/admin-auction';

type Props = {
    pageData: Page<AdminLiveAuctionListItem>;
    page: number;
    onChangePage: (nextPage: number) => void;
};

const AdminLiveAuctionListWidget: React.FC<Props> = ({ pageData, page, onChangePage }) => {
    return (
        <div className='space-y-4'>
            <AdminLiveAuctionListTable items={pageData.content} />
            <div className='bg-white rounded shadow p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <div className='text-sm text-gray-600'>
                    총 {pageData.totalElements.toLocaleString('ko-KR')}개 · {page + 1}/
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

export default AdminLiveAuctionListWidget;
