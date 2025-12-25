// typescript
import { httpFetcher, pageSegmentBuilder } from '@shared/lib';
import { ApiResult, Page } from '@entities/common';
import { AuctionItem } from '@entities/auction/model';
import { useQuery } from '@tanstack/react-query';

export const usePagingQueryGetAuction = (
    type: 'live' | 'blind',
    category?: string | null,
    page: number,
    size: number,
) => {
    return useQuery<ApiResult<Page<AuctionItem>>>({
        queryKey: [
            'api',
            'v2',
            'auction',
            pageSegmentBuilder(type, page, size) + (category ? '&category=' + category : ''),
        ],
        queryFn: httpFetcher,
    });
};
