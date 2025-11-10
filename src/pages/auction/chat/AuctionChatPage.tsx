import { useEffect } from 'react';
import { BaseLayout, MainLayout } from '@shared/layout';
import AuctionChatHeader from '@/features/auction/ui/AuctionChatHeader.tsx';
import { useNavigate, useParams } from 'react-router';
import AuctionChatSideMenu from '@/features/auction/ui/AuctionChatSideMenu.tsx';
import AuctionChatBody from '@/features/auction/ui/AuctionChatBody.tsx';
import AuctionChatInput from '@/features/auction/ui/AuctionChatInput.tsx';
import StompClient from '@/features/auction/ui/StompClient.tsx';
import UserProfile from '@/features/user/ui/UserProfile.tsx';
import { useAuthUser } from '@shared/hooks/useAuthUser.tsx';
import AuctionStatus from '@/features/auction/ui/AuctionStatus.tsx';
import { useAuthStore } from '@shared/store/AuthStore.ts';
import { toast } from 'react-toastify';

type Params = {
    id: string;
};
const AuctionChatPage = () => {
    const { id } = useParams<Params>();
    const [nickname, userId] = useAuthUser();
    const navigate = useNavigate();
    const { userAuth } = useAuthStore();
    useEffect(() => {
        if (!userAuth) {
            toast('잘못된 접근입니다.', { type: 'error' });
            navigate(-1);
        }
    }, [userAuth]);
    if (!id) {
        return <>404 잘못된 접근입니다.</>;
    }
    return (
        <div>
            <MainLayout>{}</MainLayout>
            <BaseLayout>
                <AuctionChatHeader auctionId={id} type={'live'} />
            </BaseLayout>
            <BaseLayout className={'bg-[#FAFAFA] pt-8'}>
                <StompClient auctionId={id}>
                    {(client, auctionId) => {
                        return (
                            <div className={'flex gap-4'}>
                                <AuctionChatSideMenu client={client} />
                                <div className={'flex-1'}>
                                    <div className={'flex flex-col '}>
                                        <AuctionStatus auctionId={auctionId} />
                                        <AuctionChatBody auctionId={auctionId} type={'live'} />
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
            </BaseLayout>
        </div>
    );
};

export default AuctionChatPage;
