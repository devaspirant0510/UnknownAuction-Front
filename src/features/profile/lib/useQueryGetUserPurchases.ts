// features/profile/lib/useQueryGetUserPurchases.ts
import { useQuery } from '@tanstack/react-query';
import { ApiResult } from '@entities/common';
import { AuctionData } from '@entities/auction/model';
import { axiosClient } from '@shared/lib/axiosClient.ts';
import Cookies from 'js-cookie';

/**
 * [신규 훅] ID로 특정 유저의 구매 목록을 조회합니다.
 * API: GET /api/v1/profile/{id}/purchases
 */
export const useQueryGetUserPurchases = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['api', 'v1', 'profile', userId, 'purchases'],
        queryFn: async () => {
            if (!userId) return null;
            // GET /api/v1/profile/{id}/purchases 호출
            const response = await axiosClient.get<ApiResult<AuctionData[]>>(
                `/api/v1/profile/${userId}/purchases`,
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