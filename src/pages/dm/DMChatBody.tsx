import React, { useEffect, useState, useRef, useCallback } from 'react';
import { axiosClient, getServerURL } from '@shared/lib';
import AuctionInfoCard from '@/pages/dm/AuctionInfoCard';

type Props = {
    client: any;
    roomId: number;
    userId: number;
    onMessageReceived?: () => void;
    onMessagesRead?: () => void;
};

type Message = {
    id?: number | string;
    roomId: number;
    senderId: number;
    receiverId: number;
    contents: string;
    dmType: string;
    createdAt: string;
    readCount?: number;
};

const DMChatBody: React.FC<Props> = ({
    client,
    roomId,
    userId,
    onMessageReceived,
    onMessagesRead,
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [auctionInfo, setAuctionInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isAuctionSold, setIsAuctionSold] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const subscriptionRef = useRef<any>(null);

    const formatTime = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const formatDateSeparator = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        });
    };

    const isSameDay = (dateA: Date, dateB: Date) => {
        return (
            dateA.getFullYear() === dateB.getFullYear() &&
            dateA.getMonth() === dateB.getMonth() &&
            dateA.getDate() === dateB.getDate()
        );
    };

    const markMessagesAsRead = useCallback(async () => {
        try {
            await axiosClient.post(`${getServerURL()}/api/dm/chat/read/${roomId}`);
            if (onMessagesRead) {
                onMessagesRead();
            }
        } catch (error) {
            console.error('메시지 읽음 표시 실패:', error);
        }
    }, [roomId, onMessagesRead]);

    /**
     * ✅ 판매 완료 상태 확인
     * PointHistory에서 PURCHASE 타입이고 contents에 해당 auctionId가 있으면 판매 완료
     */
    const checkAuctionSoldStatus = useCallback(async (auctionId: number) => {
        try {
            const response = await axiosClient.get(
                `${getServerURL()}/api/v1/payment/point-history/check-purchase/${auctionId}`,
            );

            // ApiResult 응답 구조: { data: true/false, message: "...", success: true }
            if (response.data && response.data.data === true) {
                setIsAuctionSold(true);
            } else {
                setIsAuctionSold(false);
            }
        } catch (error) {
            console.error('판매 상태 확인 실패:', error);
            setIsAuctionSold(false);
        }
    }, []);

    const handlePurchaseConfirmation = useCallback(async () => {
        if (!auctionInfo || isPurchasing) return;

        const sellerId = auctionInfo?.data?.auction?.user?.id;
        const auctionId = auctionInfo?.data?.auction?.id;
        const finalPrice =
            auctionInfo?.data?.lastBiddingLog?.price || auctionInfo?.data?.auction?.startPrice;

        const isBuyer = sellerId !== userId;
        if (!isBuyer) {
            alert('판매자는 구매 확정을 할 수 없습니다.');
            return;
        }

        if (!confirm('구매를 확정하시겠습니까?')) {
            return;
        }

        try {
            setIsPurchasing(true);

            const response = await axiosClient.post(
                `${getServerURL()}/api/auction/purchase/confirm`,
                {
                    auctionId: auctionId,
                    buyerId: userId,
                    sellerId: sellerId,
                    amount: finalPrice,
                    roomId: roomId,
                },
            );

            if (response.data) {
                alert('구매가 확정되었습니다.');
                // 포인트 이력에서 상태 확인
                await checkAuctionSoldStatus(auctionId);
            }
        } catch (error: any) {
            console.error('구매 확정 실패:', error);
            alert(error.response?.data?.message || '구매 확정 중 오류가 발생했습니다.');
        } finally {
            setIsPurchasing(false);
        }
    }, [auctionInfo, userId, roomId, isPurchasing, checkAuctionSoldStatus]);

    // 1. 채팅방 내역 로드
    useEffect(() => {
        const loadChatHistory = async () => {
            try {
                setIsLoading(true);
                setMessages([]);
                setAuctionInfo(null);
                setIsAuctionSold(false);

                const response = await axiosClient.get(`${getServerURL()}/api/dm/chat/${roomId}`);

                if (response.data && response.data.length > 0) {
                    const chats = response.data;

                    if (chats[0].contents && chats[0].contents.startsWith('AUCTION_INFO:')) {
                        const auctionId = parseInt(chats[0].contents.split(':')[1]);
                        try {
                            const auctionResponse = await axiosClient.get(
                                `${getServerURL()}/api/v1/auction/${auctionId}`,
                            );
                            setAuctionInfo(auctionResponse.data);
                        } catch (error) {
                            console.error('경매 정보 로딩 실패:', error);
                        }
                        setMessages(chats.slice(1));

                        // ✅ 경매 ID를 state에 임시 저장하여 별도 effect에서 처리
                        return auctionId;
                    } else {
                        setMessages(chats);
                    }
                }
            } catch (error) {
                console.error('채팅 내역 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadChatHistory();
    }, [roomId]);

    // ✅ 새로운 useEffect: 경매 정보 로드 후 판매 상태 확인
    useEffect(() => {
        if (auctionInfo && auctionInfo.data?.auction?.id) {
            const auctionId = auctionInfo.data.auction.id;
            checkAuctionSoldStatus(auctionId);
        }
    }, [auctionInfo, checkAuctionSoldStatus]);

    // 2. STOMP 구독
    useEffect(() => {
        if (!client || !client.connected) {
            return;
        }

        subscriptionRef.current = client.subscribe(`/topic/dm/${roomId}`, (msg: any) => {
            try {
                const parsed = JSON.parse(msg.body) as Message;

                if (!parsed.contents || !parsed.contents.startsWith('AUCTION_INFO:')) {
                    setMessages((prev) => {
                        const updated = [...prev, parsed];
                        return updated;
                    });

                    if (parsed.senderId === userId) {
                        if (onMessageReceived) {
                            onMessageReceived();
                        }
                    } else {
                        markMessagesAsRead();
                    }
                }
            } catch (error) {
                console.error('메시지 파싱 실패:', error, msg.body);
            }
        });

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
        };
    }, [client, roomId, onMessageReceived, markMessagesAsRead, userId]);

    // 3. 채팅방 로드 완료 시 '읽음' 처리
    useEffect(() => {
        if (!isLoading) {
            markMessagesAsRead();
        }
    }, [isLoading, markMessagesAsRead]);

    // 4. 새 메시지 수신 시 '스크롤' 처리
    useEffect(() => {
        if (scrollRef.current) {
            setTimeout(() => {
                scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
            }, 0);
        }
    }, [messages, auctionInfo]);

    if (isLoading) {
        return (
            <div className='flex-1 flex items-center justify-center'>
                <p className='text-gray-500'>메시지를 불러오는 중...</p>
            </div>
        );
    }

    // ✅ 현재 사용자가 구매자인지 확인
    const sellerId = auctionInfo?.data?.auction?.user?.id;
    const isBuyer = auctionInfo && sellerId !== userId;

    return (
        <div ref={scrollRef} className='flex-1 overflow-y-auto p-4 bg-gray-50'>
            {auctionInfo && (
                <AuctionInfoCard
                    auctionData={auctionInfo}
                    serverUrl={getServerURL()}
                    isBuyer={isBuyer}
                    isAuctionSold={isAuctionSold}
                    isPurchasing={isPurchasing}
                    onPurchaseConfirm={handlePurchaseConfirmation}
                />
            )}

            {messages.length === 0 ? (
                <div className='flex items-center justify-center h-32'>
                    <p className='text-gray-400'>메시지가 없습니다. 첫 메시지를 보내보세요!</p>
                </div>
            ) : (
                messages.map((m, index) => {
                    const currentMessage = m;
                    const prevMessage = messages[index - 1];
                    const nextMessage = messages[index + 1];

                    let dateSeparatorElement = null;

                    if (currentMessage.createdAt) {
                        const currentDate = new Date(currentMessage.createdAt);

                        if (index === 0) {
                            dateSeparatorElement = (
                                <div className='my-4 text-center text-xs text-gray-500 bg-gray-200 rounded-full px-3 py-1 mx-auto w-fit'>
                                    {formatDateSeparator(currentMessage.createdAt)}
                                </div>
                            );
                        } else if (prevMessage && prevMessage.createdAt) {
                            const prevDate = new Date(prevMessage.createdAt);
                            if (!isSameDay(currentDate, prevDate)) {
                                dateSeparatorElement = (
                                    <div className='my-4 text-center text-xs text-gray-500 bg-gray-200 rounded-full px-3 py-1 mx-auto w-fit'>
                                        {formatDateSeparator(currentMessage.createdAt)}
                                    </div>
                                );
                            }
                        }
                    }

                    let showTime = true;

                    if (nextMessage && nextMessage.createdAt && currentMessage.createdAt) {
                        const isSameSender = currentMessage.senderId === nextMessage.senderId;
                        const isSameMinute =
                            formatTime(currentMessage.createdAt) ===
                            formatTime(nextMessage.createdAt);

                        if (isSameSender && isSameMinute) {
                            showTime = false;
                        }
                    }

                    return (
                        <React.Fragment key={m.id || m.createdAt}>
                            {dateSeparatorElement}
                            <div
                                className={`my-2 flex ${m.senderId === userId ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`flex items-end gap-2 max-w-[80%] ${
                                        m.senderId === userId ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                                >
                                    <div
                                        className={`px-4 py-2 rounded-xl break-words text-sm ${
                                            m.senderId === userId
                                                ? 'bg-orange-400 text-white'
                                                : 'bg-white text-gray-800 border border-gray-200'
                                        }`}
                                    >
                                        {m.contents}
                                    </div>

                                    <div className='flex flex-col items-center gap-1'>
                                        {m.senderId === userId && m.readCount !== undefined && (
                                            <span className='text-xs text-gray-400'>
                                                {m.readCount === 0 ? '1' : ''}
                                            </span>
                                        )}
                                        {showTime && (
                                            <span className='text-xs text-gray-400 whitespace-nowrap'>
                                                {m.createdAt ? formatTime(m.createdAt) : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })
            )}
        </div>
    );
};

export default DMChatBody;
