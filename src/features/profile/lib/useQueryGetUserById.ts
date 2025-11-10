import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@shared/lib/axiosClient.ts';
import { ApiResult } from '@entities/common';
import { FileEntity } from '@/entities/auction/model';
import Cookies from 'js-cookie';

export interface Account {
    id: number;
    createdAt: string;
    updatedAt: string;
    loginType: 'KAKAO' | 'GOOGLE' | 'NAVER' | string;
    userStatus: 'ACTIVE' | 'INACTIVE' | 'UN_LINK' | string;
    userType: 'CUSTOMER' | 'ADMIN' | 'UN_REGISTER' | string;
    password: string | null;
    email: string;
    deletedAt: string | null;
    isVerified: boolean;
    uuid: string;
    nickname: string;
    description: string | null;
    profileUrl: string | null;
    point: number;
}

export interface UserDto {
    user: Account;
    followerCount: number;
    followingCount: number;
    feedCount: number;
    profileImage: FileEntity;
    following: boolean;
}

export const useQueryGetUserById = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['api', 'v1', 'profile', Number(userId)],

        queryFn: async () => {
            if (!userId) {
                return null;
            }
            const response = await axiosClient.get<ApiResult<UserDto>>(
                `/api/v1/profile/${Number(userId)}`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('access_token') || ''}`,
                    },
                },
            );
            return response.data; // httpFetcher와 동일하게 data를 반환
        },
        enabled: !!userId,
    });
};
