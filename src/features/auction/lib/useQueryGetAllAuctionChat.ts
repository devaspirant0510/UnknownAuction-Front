import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@shared/lib';
import { ApiResult } from '@entities/common';
import { ChatDto } from '@entities/auction/model';

export const useQueryGetAllAuctionChat = (id: number) => {
    return useQuery({
        queryKey: ['api', 'v2', 'auction', 'chat', Number(id)],
        queryFn: httpFetcher<ApiResult<ChatDto[]>>,
    });
};
