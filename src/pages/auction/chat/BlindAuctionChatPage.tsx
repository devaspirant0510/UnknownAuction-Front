import React, { useEffect } from 'react';
import { Params, useNavigate, useParams } from 'react-router';
import { useAuthUser } from '@shared/hooks/useAuthUser.tsx';
import { MainLayout } from '@shared/layout';
import AuctionChatHeader from '@/features/auction/ui/AuctionChatHeader.tsx';
import StompClient from '@/features/auction/ui/StompClient.tsx';
import AuctionChatSideMenu from '@/features/auction/ui/AuctionChatSideMenu.tsx';
import AuctionStatus from '@/features/auction/ui/AuctionStatus.tsx';
import AuctionChatBody from '@/features/auction/ui/AuctionChatBody.tsx';
import UserProfile from '@/features/user/ui/UserProfile.tsx';
import AuctionChatInput from '@/features/auction/ui/AuctionChatInput.tsx';
import { useAuthStore } from '@shared/store/AuthStore.ts';
import { toast } from 'react-toastify';

const BlindAuctionChatPage = () => {
    const { id } = useParams<Params>();
    const [nickname, userId] = useAuthUser();
    const navigate = useNavigate();
    const { userAuth } = useAuthStore();
    if (!id) {
        return <>404 잘못된 접근입니다.</>;
    }
    useEffect(() => {
        if (!userAuth) {
            toast('잘못된 접근입니다.', { type: 'error' });
            navigate(-1);
        }
    }, [userAuth]);

    return (
        <MainLayout>
            <div>
                <AuctionChatHeader auctionId={id} type={'blind'} />
                <StompClient auctionId={id}>
                    {(client, auctionId) => {
                        return (
                            <div className={'flex gap-4'}>
                                <AuctionChatSideMenu client={client} />
                                <div className={'flex-1'}>
                                    <div className={'flex flex-col '}>
                                        <AuctionStatus auctionId={auctionId} />
                                        <AuctionChatBody auctionId={auctionId} type={'blind'} />
                                        <UserProfile userId={userId as number}>
                                            {(user) => {
                                                return (
                                                    <AuctionChatInput
                                                        client={client}
                                                        auctionId={auctionId}
                                                        account={user.user}
                                                    />
                                                );
                                            }}
                                        </UserProfile>
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                </StompClient>
            </div>
        </MainLayout>
    );
};

export default BlindAuctionChatPage;
