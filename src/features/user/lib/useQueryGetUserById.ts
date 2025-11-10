import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@shared/lib';
import { AccountDto } from '@entities/user/model';
import { ApiResult } from '@entities/common';

export const useQueryGetUserById = (id: number) => {
    return useQuery({
        queryKey: ['api', 'v1', 'profile', id],
        queryFn: httpFetcher<ApiResult<AccountDto>>,
    });
};
