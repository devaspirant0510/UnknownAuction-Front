// features/profile/lib/useQueryGetUserSales.ts
import { useQuery } from '@tanstack/react-query';
import { ApiResult } from '@entities/common';
import { AuctionData } from '@entities/auction/model';
import { axiosClient } from '@shared/lib/axiosClient.ts';
import Cookies from 'js-cookie';

export const useQueryGetUserSales = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['api', 'v1', 'profile', userId, 'sales'],
        queryFn: async () => {
            if (!userId) return null;
            const response = await axiosClient.get<ApiResult<AuctionData[]>>(
                `/api/v1/profile/${userId}/sales`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('access_token') || ''}`,
                    },
                }
            );
            return response.data;
        },
        enabled: !!userId,
    });
};