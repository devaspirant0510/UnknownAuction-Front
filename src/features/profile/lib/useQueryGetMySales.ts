import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@shared/lib';
import { ApiResult } from '@entities/common';
import { AuctionData } from '@entities/auction/model'; // [변경] 타입을 AuctionData로 수정

export const useQueryGetMySales = () => {
    return useQuery({
        queryKey: ['api', 'v1', 'profile', 'sales'],
        queryFn: httpFetcher<ApiResult<AuctionData[]>>,
    });
};
