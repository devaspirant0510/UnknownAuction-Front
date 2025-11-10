import { useQuery } from '@tanstack/react-query';
import { ApiResult } from '@entities/common';
import { FollowUser } from '@entities/user/model';
import { axiosClient } from '@shared/lib/axiosClient.ts'; // [추가]
import Cookies from 'js-cookie'; // [추가]

export const useQueryGetFollowings = (userId: number | undefined) => {
    // [수정] number | undefined
    return useQuery({
        queryKey: ['api', 'v1', 'profile', userId, 'followings'],
        queryFn: async () => {
            if (!userId) return null;
            const response = await axiosClient.get<ApiResult<FollowUser[]>>(
                `/api/v1/profile/${userId}/followings`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('access_token') || ''}`,
                    },
                },
            );
            return response.data;
        },
        enabled: !!userId,
    });
};
