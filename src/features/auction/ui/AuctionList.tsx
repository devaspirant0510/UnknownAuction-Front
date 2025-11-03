import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useInfiniteQueryGetAuction } from '@/features/auction/lib/useInfiniteQueryGetAuction';
import { Card, CardContent } from '@shared/components/ui/card.tsx';
import { Button } from '@shared/components/ui/button.tsx';
import {
    EyeIcon,
    MessageSquareIcon,
    HeartIcon,
    Clock1Icon,
    Clock3Icon,
    ExpandIcon,
} from 'lucide-react';
import { getServerURL, DateUtil } from '@shared/lib';
import { Spinner } from '@shared/components/ui/spinner.tsx';
import AuctionItemSkeleton from '@widgets/skeleton/AuctionItemSkeleton.tsx';

type Props = {
    type: 'live' | 'blind';
};

const AuctionList: FC<Props> = ({ type }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentCategory, setCategory] = useState();
    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQueryGetAuction(type, currentCategory);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const fetchingRef = useRef(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category'); // category 값 가져오기
        console.log(category);
        setCategory(category);
        // 여기서 category 바뀌었을 때 처리
    }, [location.search]); // sear
    useEffect(() => {
        const loader = loaderRef.current;
        if (!loader) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (
                    target.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage &&
                    !fetchingRef.current
                ) {
                    fetchingRef.current = true;
                    fetchNextPage().finally(() => {
                        fetchingRef.current = false;
                    });
                }
            },
            { rootMargin: '100px', threshold: 0 },
        );

        observer.observe(loader);

        return () => {
            observer.disconnect();
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const onClickAuctionItem = useCallback(
        (id: number) => {
            navigate(`/auction/${type}/${id}`);
        },
        [navigate, type],
    );

    if (isLoading)
        return (
            <div>
                <AuctionItemSkeleton />
                <AuctionItemSkeleton />
                <AuctionItemSkeleton />
            </div>
        );
    if (isError) return <>에러 발생</>;

    // Normalize and flatten pages -> array of auction items
    const allAuctions =
        data?.pages?.flatMap((page) => {
            const payload: any = (page as any).data ?? (page as any).content ?? page;
            if (payload?.content && Array.isArray(payload.content)) return payload.content;
            if (Array.isArray(payload)) return payload;
            return [];
        }) ?? [];

    if (allAuctions.length === 0) return <>데이터 없음</>;

    return (
        <>
            {allAuctions.map((v, index) => (
                <Card
                    key={index}
                    className='my-4 cursor-pointer'
                    onClick={() => onClickAuctionItem(v.id)}
                >
                    <CardContent className='flex'>
                        {/* 왼쪽 이미지 */}
                        <div className=''>
                            <img
                                className='rounded-xl w-48 h-48 object-fill border-1'
                                src={v.goodsImageUrl}
                                alt='auction thumbnail'
                            />
                        </div>

                        {/* 가운데 텍스트 */}
                        <div className='flex-4 ml-4 flex flex-col gap-2 justify-between'>
                            <div className='text-gray-400'>[{v.categoryName}]</div>
                            <div className='text-xl font-bold'>{v.goodsTitle}</div>
                            <div className='text-gray-500 flex gap-1 text-sm'>
                                <span className='text-[#F7A17E]'>판매자</span>
                                <span>{v.bidderName}</span>
                            </div>
                            <div className='text-xl font-bold flex gap-2'>
                                <span className='text-[#F7A17E]'>현재가</span>
                                {type === 'blind' ? (
                                    <>Unknown</>
                                ) : (
                                    <span>
                                        {v.currentPrice
                                            ? v.currentPrice.toLocaleString()
                                            : v.startPrice}
                                        p
                                    </span>
                                )}
                            </div>
                            <div>
                                참여자수 <strong>{v.participateCount} 명</strong> | 입찰{' '}
                                <strong>{v.biddingCount}</strong>
                            </div>
                            <div className='text-gray-400 text-sm flex gap-1 items-center'>
                                {DateUtil.timeUntil(v.endTime).includes('분') ? (
                                    <Clock1Icon size={20} className={'text-uprimary'} />
                                ) : (
                                    <Clock3Icon size={20} />
                                )}
                                {DateUtil.timeUntil(v.endTime)}
                            </div>
                        </div>

                        {/* 오른쪽 아이콘 + 버튼 */}
                        <div className='flex flex-col justify-between items-center h-48'>
                            <div className='flex flex-col gap-2 items-center'>
                                <div className='flex gap-1 justify-between w-16'>
                                    <EyeIcon className='text-uprimary' />
                                    {v.viewCount}
                                </div>
                                <div className='flex gap-1 justify-between w-16'>
                                    <MessageSquareIcon className='text-uprimary' />
                                    {v.chatMessagingCount}
                                </div>
                                <div className='flex gap-1 justify-between w-16'>
                                    <HeartIcon className='text-uprimary' />
                                    {v.likeCount}
                                </div>
                            </div>

                            <div className='w-full flex justify-center'>
                                <Button className='bg-white text-gray-500 border-gray-400 border rounded-full'>
                                    상세보기
                                    <ExpandIcon className='text-uprimary' />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* 무한 스크롤 트리거 */}
            <div ref={loaderRef} className='h-10 flex justify-center items-center'>
                {isFetchingNextPage && (
                    <div className={'w-full flex justify-center mt-2'}>
                        <Spinner className={'size-8'} />
                    </div>
                )}
                {!hasNextPage && <span>모든 경매를 불러왔어요 🎉</span>}
            </div>
        </>
    );
};

export default AuctionList;
