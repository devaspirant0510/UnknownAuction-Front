import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@/shared/lib';
import type { ApiResult, Page } from '@/entities/common';
import { AdminAuctionStatus, AdminLiveAuctionListItem } from '@/features/admin-auction';

export type AdminLiveAuctionListQueryParams = {
    page: number;
    size: number;
    status?: AdminAuctionStatus;
    category?: string;
};

export type AdminLiveAuctionListResponse = ApiResult<Page<AdminLiveAuctionListItem>>;

const buildQueryKey = ({ page, size, status, category }: AdminLiveAuctionListQueryParams) => {
    const base = ['api', 'v1', 'admin'] as const;
    const query = new URLSearchParams();
    query.set('page', String(page));
    query.set('size', String(size));

    // 선택되지 않으면 쿼리 파라미터 자체를 보내지 않음
    if (status) query.set('status', status);
    if (category) query.set('category', category);

    return [...base, `auction/live?${query.toString()}`] as unknown as string[];
};

export const useQueryAdminLiveAuctionList = (params: AdminLiveAuctionListQueryParams) => {
    return useQuery<AdminLiveAuctionListResponse>({
        queryKey: buildQueryKey(params),
        queryFn: httpFetcher,
        staleTime: 1000 * 10,
    });
};
