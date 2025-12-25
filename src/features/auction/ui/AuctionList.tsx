import React, { FC, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { usePagingQueryGetAuction } from '@/features/auction/lib/usePagingQueryGetAuction.ts';
import { Card, CardContent } from '@shared/components/ui/card.tsx';
import { Button } from '@shared/components/ui/button.tsx';
import {
    EyeIcon,
    MessageSquareIcon,
    HeartIcon,
    Clock1Icon,
    Clock3Icon,
    ExpandIcon,
    PackageXIcon,
    PlusCircleIcon,
} from 'lucide-react';
import { DateUtil } from '@shared/lib';
import AuctionItemSkeleton from '@widgets/skeleton/AuctionItemSkeleton.tsx';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@shared/components/ui';

type Props = {
    type: 'live' | 'blind';
};

const AuctionList: FC<Props> = ({ type }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [size, setSize] = useState(10);
    const [page, setPage] = useState(1);

    const [currentCategory, setCategory] = useState<string>();
    const { data, isLoading, isError } = usePagingQueryGetAuction(
        type,
        currentCategory,
        page,
        size,
    );

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category'); // category 값 가져오기
        console.log(category);
        setCategory(category!);
    }, [location.search]); // sear
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

    if (data?.data?.content.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center h-80 text-gray-500'>
                <PackageXIcon size={64} className='mb-4 text-gray-400' />
                <p className='text-lg font-semibold mb-3'>현재 등록된 경매가 없어요 🫥</p>
                <Button
                    className='flex items-center gap-2 rounded-full bg-uprimary text-white px-6 py-2 hover:opacity-90 transition-all'
                    onClick={() => navigate('/auction/productUpload')}
                >
                    <PlusCircleIcon size={20} />내 상품 올리기
                </Button>
            </div>
        );
    }

    return (
        <>
            {data.data.content.map((v, index) => (
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
            <div className='mt-6 flex justify-center'>
                <Pagination>
                    <PaginationContent>
                        {/* 이전 페이지 */}
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => {
                                    const params = new URLSearchParams(location.search);
                                    params.set('page', String(page - 1));
                                    if (page < data.data.totalPages) {
                                        setPage(page + 1);
                                        navigate(`${location.pathname}?${params.toString()}`, {
                                            replace: false,
                                        });
                                    }
                                }}
                                className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>

                        {(() => {
                            const total = data.data.totalPages;
                            let start = Math.max(1, page - 5);
                            const end = Math.min(total, start + 9);

                            // end 때문에 start 재보정
                            start = Math.max(1, end - 9);

                            const arr = [];
                            for (let i = start; i <= end; i++) {
                                arr.push(
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            onClick={() => {
                                                const params = new URLSearchParams(location.search);
                                                params.set('page', String(i));
                                                setPage(i);
                                                navigate(
                                                    `${location.pathname}?${params.toString()}`,
                                                    {
                                                        replace: false,
                                                    },
                                                );
                                            }}
                                            className={i === page ? 'bg-uprimary text-white' : ''}
                                        >
                                            {i}
                                        </PaginationLink>
                                    </PaginationItem>,
                                );
                            }
                            return arr;
                        })()}

                        {/* 다음 페이지 */}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => {
                                    const params = new URLSearchParams(location.search);
                                    params.set('page', String(page + 1));
                                    if (page < data.data.totalPages) {
                                        setPage(page + 1);
                                        navigate(`${location.pathname}?${params.toString()}`, {
                                            replace: false,
                                        });
                                    }
                                }}
                                className={
                                    page >= data.data.totalPages
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
};

export default AuctionList;
