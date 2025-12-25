import { useInfiniteQuery } from '@tanstack/react-query';
import { httpFetcher } from '@shared/lib';
import { ApiResult, Page } from '@entities/common';
import { FeedListResponse } from '@entities/feed/model';

export const useInfiniteQueryGetAllAuctionChat = (id: number) => {
    return useInfiniteQuery({
        queryKey: ['api', 'v2', 'auction', 'chat', Number(id)],
        queryFn: async ({ pageParam = 1 }) =>
            httpFetcher<ApiResult<Page<FeedListResponse>>>({
                queryKey: [
                    'api',
                    'v2',
                    'auction',
                    'chat',
                    String(id) + (pageParam ? `?cursor=${pageParam}` : ''),
                ],
            }),
        getNextPageParam: (lastPage) => {
            return lastPage.data?.content.at(-1)?.id;
        },
        initialPageParam: null,
    });
};
