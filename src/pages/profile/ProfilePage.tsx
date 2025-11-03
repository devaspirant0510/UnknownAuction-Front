import React, {useEffect, useState} from 'react';
import MyProfile from '@/features/profile/ui/MyProfile.tsx';
import MyWallet from '@/features/profile/ui/MyWallet.tsx';
import MyActive from '@/features/profile/ui/MyActive.tsx';
import MyFeedList from '@/features/profile/ui/MyFeedList.tsx';
import MySales from '@/features/profile/ui/MySales.tsx';
import MyBuys from '@/features/profile/ui/MyBuys.tsx';
import { Header } from '@widgets/ui';
import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@shared/lib';
import { ApiResult } from '@entities/common';
import { useAuthUser } from '@shared/hooks/useAuthUser.tsx';
import { useQueryGetAccountStatus } from '@/features/profile/lib/useQueryGetAccountStatus.ts';
import { EditProfileModal } from '@/features/profile/ui/EditProfileModal.tsx';
import { AppLayout } from '@shared/layout';
import {toast} from "react-toastify";
import { useAuthStore } from '@shared/store/AuthStore.ts';
import { Navigate, useNavigate } from 'react-router';
import NotFoundPage from "@/pages/common/NotFoundPage";
import {LoadingPage} from "@/pages/common";

export const ProfilePage = () => {
    const [_, id] = useAuthUser();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();
    const { userAuth } = useAuthStore();

    const { isLoading, data, isError, error } = useQuery({
        queryKey: ['api', 'v1', 'profile', id],
        queryFn: httpFetcher<ApiResult<any>>,
        enabled: !!id,
    });

    const { data: statusData, isLoading: isStatusLoading } = useQueryGetAccountStatus(Number(id));

    useEffect(() => {
        if (!userAuth) {
            toast('로그인후 이용해주세요', { type: 'error' });
            navigate('/login', { replace: true });
        }
    }, [userAuth, navigate]);

    if (!userAuth) {
        return null;
    }

    if (isLoading || isStatusLoading) {
        return <LoadingPage />;
    }

    if (isError) {
        console.error("프로필 로딩 오류:", error);
        return <NotFoundPage />;
    }

    if (!data || !data.data) {
        return (
            <AppLayout>
                <div>프로필 데이터가 없습니다.</div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className='max-w-screen-xl mx-auto px-4'>
                <section className='grid grid-cols-1 md:grid-cols-12! gap-6'>
                    <div className='col-span-1 md:col-span-3!'>
                        <MyProfile
                            nickname={data.data.user.nickname}
                            email={data.data.user.email}
                            url={data.data.user.profileUrl}
                            cash={data?.data?.user.point}
                            interestedCount={statusData?.data?.interestedCount}
                            biddingCount={statusData?.data?.biddingCount}
                            onEditClick={() => setIsEditModalOpen(true)}
                        />
                    </div>

                    <section className='col-span-1 md:col-span-9! space-y-6 mt-30'>
                        <MyWallet cash={data?.data?.user.point} />

                        <MyActive
                            followercount={data.data.followerCount}
                            followingcount={data.data.followingCount}
                            feedcount={data.data.feedCount}
                        />

                        <MyFeedList />

                        <MySales />

                        <MyBuys />
                    </section>
                </section>
            </div>

            {isEditModalOpen && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    currentNickname={data.data.user.nickname}
                    currentProfileUrl={data.data.user.profileUrl}
                />
            )}
        </AppLayout>
    );
};

export default ProfilePage;
