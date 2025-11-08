import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@shared/lib';
import { ApiResult } from '@entities/common';
import { BidDailySummary } from '@entities/auction/model';

export const useQueryGetDailySummary = (auctionId: number) => {
    return useQuery<ApiResult<BidDailySummary[]>>({
        queryKey: ['api', 'v1', 'auction', 'bid-history', auctionId, 'daily-summary'],
        queryFn: httpFetcher,
    });
};
