// typescript
import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import { httpFetcher, pageSegmentBuilder } from '@shared/lib';
import { ApiResult, Page } from '@entities/common';
import { AuctionItem } from '@entities/auction/model';

export const useInfiniteQueryGetAuction = (type: 'live' | 'blind', category?: string | null) => {
    return useInfiniteQuery<ApiResult<Page<AuctionItem>>>({
        queryKey: ['api', 'v1', 'auction', type, category],
        queryFn: async ({ pageParam = 1 }: QueryFunctionContext) => {
            const pageNumber = Number(pageParam ?? 1);
            console.log('fetching page', pageNumber);
            return await httpFetcher<ApiResult<Page<AuctionItem>>>({
                queryKey: [
                    'api',
                    'v1',
                    'auction',
                    pageSegmentBuilder(type, pageNumber, 4) +
                        (category ? '&category=' + category : ''),
                ],
            });
        },
        getNextPageParam: (lastPage) => {
            return !lastPage.data?.last ? lastPage.data?.pageable.pageNumber + 2 : undefined;
        },
        initialPageParam: 1,
    });
};
