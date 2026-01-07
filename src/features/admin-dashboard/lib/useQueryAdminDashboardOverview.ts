import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@shared/lib';
import type { AdminDashboardOverviewResponse } from '@entities/admin/dashboard';

export const adminDashboardOverviewQueryKey = [
    'api',
    'v1',
    'admin',
    'dashboard',
    'overview',
] as const;

export const useQueryAdminDashboardOverview = () => {
    return useQuery<AdminDashboardOverviewResponse>({
        queryKey: adminDashboardOverviewQueryKey as unknown as string[],
        queryFn: httpFetcher,
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 60,
    });
};
