import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@shared/lib/axiosClient.ts';
import Cookies from 'js-cookie';
import { ApiResult } from '@entities/common';
import { FollowEntity } from '@entities/user/model';

const followUser = (userId: number) => {
    return axiosClient.patch<ApiResult<FollowEntity>>(`/api/v1/profile/follow/${userId}`, null, {
        headers: {
            Authorization: `Bearer ${Cookies.get('access_token') || ''}`,
        },
    });
};

export const useMutationFollowUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) => followUser(userId),

        onSuccess: (_data, userId) => {
            return queryClient.invalidateQueries({
                queryKey: ['api', 'v1', 'profile', Number(userId)],
            });
        },
        onError: (error) => {
            console.error('Follow failed:', error);
            alert('팔로우에 실패했습니다.');
        },
    });
};
