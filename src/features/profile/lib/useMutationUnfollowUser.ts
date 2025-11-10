import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@shared/lib/axiosClient.ts';
import Cookies from 'js-cookie';
import { ApiResult } from '@entities/common';

const unfollowUser = (userId: number) => {
    return axiosClient.delete<ApiResult<boolean>>(`/api/v1/profile/unfollow/${userId}`, {
        headers: {
            Authorization: `Bearer ${Cookies.get('access_token') || ''}`,
        },
    });
};

export const useMutationUnfollowUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) => unfollowUser(userId),

        // [수정] setQueryData -> invalidateQueries로 원복
        onSuccess: (_data, userId) => {
            return queryClient.invalidateQueries({
                queryKey: ['api', 'v1', 'profile', Number(userId)],
            });
        },
        onError: (error) => {
            console.error('Unfollow failed:', error);
            alert('언팔로우에 실패했습니다.');
        },
    });
};
