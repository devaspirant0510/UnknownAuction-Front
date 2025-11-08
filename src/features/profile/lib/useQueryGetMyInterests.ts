import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@shared/lib';
import { ApiResult } from '@entities/common';
import { AuctionData } from '@entities/auction/model';

export const useQueryGetMyInterests = () => {
    return useQuery({
        queryKey: ['api', 'v1', 'profile', 'my', 'interests'],
        queryFn: httpFetcher<ApiResult<AuctionData[]>>,
    });
};