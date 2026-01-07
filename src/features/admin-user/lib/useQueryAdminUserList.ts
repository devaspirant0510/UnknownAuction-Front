import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@/shared/lib';
import { AdminUserListResponse, AdminUserStatus } from '@widgets/admin-user';

export type AdminUserListQueryParams = {
    page: number;
    size: number;
    status?: AdminUserStatus;
};

const buildQueryKey = ({ page, size, status }: AdminUserListQueryParams) => {
    const base = ['api', 'v1', 'admin'] as const;
    const query = new URLSearchParams();
    query.set('page', String(page));
    query.set('size', String(size));
    if (status) query.set('status', status);

    console.log(base);
    console.log(query.toString());
    // httpFetcher가 queryKey를 '/'로 join 하므로 마지막 세그먼트에 쿼리를 붙입니다.
    return [...base, `user?${query.toString()}`] as unknown as string[];
};

export const useQueryAdminUserList = (params: AdminUserListQueryParams) => {
    return useQuery<AdminUserListResponse>({
        queryKey: buildQueryKey(params),
        queryFn: httpFetcher,
        staleTime: 1000 * 30,
    });
};
