import React, { FC, useEffect, useRef, useCallback } from 'react';
import AuctionChatItem from '@widgets/auction/AuctionChatItem.tsx';
import { useAuthUser } from '@shared/hooks/useAuthUser.tsx';
import { queryClient } from '@shared/lib';
import ConfirmBidCard from '@widgets/auction/ConfirmBidCard.tsx';
import FetchConfirmBid from '@/features/auction/ui/FetchConfirmBid.tsx';
import { useInfiniteQueryGetAllAuctionChat } from '@/features/auction/lib/useInfiniteQueryGetAllAuctionChat.ts';

const DateSeparator: FC<{ date: string }> = ({ date }) => (
    <div className='flex justify-center my-3 '>
        <div className='flex items-center gap-2  bg-black opacity-30 px-8 rounded-full text-white text-xs'>
            <div className='flex-1 h-[1px] bg-gray-300 opacity-40' />
            <span>{date}</span>
            <div className='flex-1 h-[1px] bg-gray-300 opacity-40' />
        </div>
    </div>
);

type Props = {
    auctionId: number;
    type: 'live' | 'blind';
};

const AuctionChatBody: FC<Props> = ({ auctionId, type }) => {
    // infinite query: pages[] each has data.content (array of messages)
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
        useInfiniteQueryGetAllAuctionChat(auctionId);

    const [, auction] =
        queryClient.getQueriesData({
            queryKey: ['api', 'v1', 'auction', Number(auctionId)],
        })?.[0] ?? [];

    const [, id] = useAuthUser();

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const prevScrollHeightRef = useRef<number>(0);
    const initializedRef = useRef<boolean>(false);

    // flat messages: pages are assumed to be ordered oldest->newest per page,
    // and pages array is in order: [page1(oldest chunk), page2, ... , last(newest chunk)]
    const messages = data?.pages.flatMap((p) => p.data.content) ?? [];

    // isEnded 계산 (기존 방식 유지)
    const isEnded = Boolean(
        auction?.data?.auction?.endTime && new Date() >= new Date(auction.data.auction.endTime),
    );

    // 날짜 포맷
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
        });
    };

    // --- 초기 로드 시 맨 아래로 스크롤 ---
    useEffect(() => {
        if (!scrollRef.current) return;
        // 첫 데이터가 들어왔을 때만 자동으로 아래로 보낸다
        if (!initializedRef.current && messages.length > 0) {
            const el = scrollRef.current;
            el.scrollTop = el.scrollHeight;
            initializedRef.current = true;
        }
    }, [messages.length]);

    // --- 스크롤 핸들러: 맨 위에 닿으면 이전 페이지 로드 ---
    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el || isFetchingNextPage || !hasNextPage) return;

        // threshold: 0 이면 꼭 맨 위를 타야 함. 필요하면 10 ~ 30 px 여유 줄 수 있음.
        if (el.scrollTop <= 0) {
            // save previous scrollHeight to restore after prepend
            prevScrollHeightRef.current = el.scrollHeight;
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    // --- 이전 페이지(older messages) 불러온 직후 스크롤 보정 ---
    // react-query가 페이지를 추가한 직후 messages 배열이 증가한다.
    // 이 effect는 isFetchingNextPage 상태가 false로 바뀌는 시점에서 동작하게 함.
    useEffect(() => {
        // only run when we had a previous saved height (즉, fetchNextPage를 트리거 했던 경우)
        const el = scrollRef.current;
        if (!el) return;

        // if we just finished fetching next page (isFetchingNextPage -> false) AND prev height saved
        // we restore scrollTop so the user's viewport stays on the same message.
        if (!isFetchingNextPage && prevScrollHeightRef.current > 0) {
            // micro tick to ensure DOM updated
            setTimeout(() => {
                const newHeight = el.scrollHeight;
                const diff = newHeight - prevScrollHeightRef.current;
                // set scrollTop so that visible content doesn't jump
                el.scrollTop = diff;
                // reset saved height
                prevScrollHeightRef.current = 0;
            }, 0);
        }
    }, [isFetchingNextPage, messages.length]);

    if (isLoading) return <>loading</>;
    if (isError) return <>error</>;

    // Render: messages already in chronological order (old -> new)
    // We'll iterate and show date separators when date changes.
    let lastDate = '';

    return (
        <div className='px-8 pb-4 rounded-xl shadow-sm border-1'>
            <div
                ref={scrollRef}
                className='flex h-[48vh] flex-col overflow-y-auto'
                onScroll={handleScroll}
            >
                {/* 로딩 인디케이터 (과거 로딩 중이면 맨 위에 표시) */}
                {isFetchingNextPage && (
                    <div className='text-center py-2 text-gray-500 text-xs'>
                        이전 메시지 불러오는 중...
                    </div>
                )}

                {/* messages: 오래된 것부터 렌더링 */}
                {messages.reverse().map((v) => {
                    const currentDate = formatDate(v.createdAt);
                    const showDateSeparator = currentDate !== lastDate;
                    if (showDateSeparator) lastDate = currentDate;

                    const isMe = v.userId === id;

                    return (
                        <React.Fragment key={v.id}>
                            {showDateSeparator && <DateSeparator date={currentDate} />}

                            <div className={`my-1 flex ${isMe ? 'justify-end' : ''}`}>
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

                {/* 경매 종료 시 정산 카드 (맨 아래에 위치) */}
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
