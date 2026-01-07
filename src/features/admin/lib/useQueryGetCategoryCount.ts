import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@shared/lib';
import { ApiResult } from '@entities/common';

export type CategoryCount = {
    name: string;
    categoryId: number;
    count: number;
};

export const useQueryGetCategoryCount = () => {
    return useQuery<ApiResult<CategoryCount[]>>({
        queryKey: ['api', 'v1', 'admin', 'auction', 'chart', 'category', 'count'],
        queryFn: httpFetcher,
        // short cache time for admin data
        staleTime: 1000 * 60,
    });
};
