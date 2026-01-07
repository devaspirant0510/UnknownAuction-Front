import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@/shared/lib';
import type { ApiResult } from '@/entities/common';
import type { ConfirmBidItem } from '@/entities/feed/model';

export const useQueryConfirmBidHistory = (enabled: boolean) => {
    return useQuery({
        queryKey: ['api', 'v1', 'feed', 'my', 'confirm-bid'],
        queryFn: () =>
            httpFetcher<ApiResult<ConfirmBidItem[]>>({
                queryKey: ['api', 'v1', 'feed', 'my', 'confirm-bid'],
            }),
        enabled,
        staleTime: 0,
    });
};
