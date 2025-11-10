import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@shared/lib';
import { ApiResult } from '@entities/common';
import { AuctionData } from '@entities/auction/model';

export const useQueryGetAuctionListLegacy = (type: 'live' | 'blind') => {
    return useQuery({
        queryKey: ['api', 'v1', 'auction', 'test', 'all', type],
        queryFn: httpFetcher<ApiResult<AuctionData[]>>,
    });
};
