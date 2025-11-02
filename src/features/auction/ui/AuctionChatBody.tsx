import React, { FC, useEffect, useRef } from 'react';
import { useQueryGetAllAuctionChat } from '@/features/auction/lib';
import AuctionChatItem from '@widgets/auction/AuctionChatItem.tsx';
import { useAuthUser } from '@shared/hooks/useAuthUser.tsx';
import { queryClient } from '@shared/lib';
import ConfirmBidCard from '@widgets/auction/ConfirmBidCard.tsx';
import FetchConfirmBid from '@/features/auction/ui/FetchConfirmBid.tsx';

// 🗓️ 날짜 구분선 컴포넌트
const DateSeparator: FC<{ date: string }> = ({ date }) => {
    return (
        <div className='flex justify-center my-3 '>
            <div className='flex items-center gap-2  bg-black opacity-30 px-8 rounded-full text-white text-xs'>
                <div className='flex-1 h-[1px] bg-gray-300 opacity-40' />
                <span>{date}</span>
                <div className='flex-1 h-[1px] bg-gray-300 opacity-40' />
            </div>
        </div>
    );
};

type Props = {
    auctionId: number;
    type: 'live' | 'blind';
};

const AuctionChatBody: FC<Props> = ({ auctionId, type }) => {
    const { isLoading, data, isError } = useQueryGetAllAuctionChat(auctionId);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const queries = queryClient.getQueriesData({
        queryKey: ['api', 'v1', 'auction', Number(auctionId)],
    });
    const [firstQuery] = queries;
    const [, auction] = firstQuery ?? [];
    const [, id] = useAuthUser();

    const messages = data?.data ?? [];

    // 스크롤을 항상 아래로 이동
    useEffect(() => {
        if (scrollRef.current) {
            setTimeout(() => {
                const container = scrollRef.current;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            }, 0);
        }
    }, [messages.length, auction]);

    if (isLoading) return <>loading</>;
    if (isError) return <>error</>;

    const isEnded = Boolean(
        auction?.data?.auction?.endTime && new Date() >= new Date(auction.data.auction.endTime),
    );

    // 🕓 날짜 포맷팅 함수
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
        });
    };

    let lastDate = '';

    console.log(auction);
    return (
        <div className='px-8 pb-4 rounded-xl shadow-sm border-1'>
            <div ref={scrollRef} className='flex h-[48vh] flex-col overflow-y-scroll'>
                {messages.map((v, index) => {
                    const currentDate = formatDate(v.createdAt);
                    const showDateSeparator = currentDate !== lastDate;
                    if (showDateSeparator) lastDate = currentDate;

                    const isLast = index === messages.length - 1;
                    const isMe = v.userId === id;

                    return (
                        <React.Fragment key={index}>
                            {showDateSeparator && <DateSeparator date={currentDate} />}

                            <div
                                className={`my-1 flex ${isMe ? 'justify-end' : ''}`}
                                ref={isLast ? null : null}
                            >
                                <AuctionChatItem
                                    auctionTitle={auction?.data?.auction?.goods?.title ?? ''}
                                    data={v}
                                    ownerId={auction?.data?.auction.user.id}
                                    isMe={isMe}
                                    type={type}
                                />
                            </div>
                        </React.Fragment>
                    );
                })}

                {isEnded && (
                    <FetchConfirmBid auctionId={auctionId} ref={null}>
                        {(bidData) => {
                            if (!bidData) return <>정산중...</>;
                            return (
                                <ConfirmBidCard
                                    data={bidData}
                                    thumbnail={auction.data.images[0].url}
                                />
                            );
                        }}
                    </FetchConfirmBid>
                )}
            </div>
        </div>
    );
};

export default AuctionChatBody;
