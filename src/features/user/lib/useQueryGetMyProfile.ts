import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@shared/lib';
import { MyInfo } from '@entities/user/model';
import { ApiResult } from '@entities/common';

export const useQueryGetMyProfile = () => {
    return useQuery({
        queryKey: ['api', 'v1', 'profile', 'my'],
        queryFn: httpFetcher<ApiResult<MyInfo>>,
    });
};
