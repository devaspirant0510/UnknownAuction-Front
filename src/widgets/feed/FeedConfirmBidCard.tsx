import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { ProfileImage } from '@/shared/ui';
import { CalendarClock, Gavel, MessageCircle, TrendingUp, Trophy } from 'lucide-react';
import type { FeedConfirmBid } from '@/entities/feed/model';
import React from 'react';
import { Separator } from '@shared/components/ui';

type Props = {
    item: FeedConfirmBid;
};

const formatNumber = (n: number) => n.toLocaleString('ko-KR');

const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};

export const FeedConfirmBidCard = ({ item }: Props) => {
    const priceDiff = item.confirmedBidPrice - item.startPrice;
    const isProfit = priceDiff > 0;
    return (
        <Card className='relative overflow-hidden border-2 border-indigo-100 bg-white shadow-sm transition-all hover:shadow-md'>
            {' '}
            <div className='absolute -right-6 -top-6 h-24 w-24 rounded-full bg-yellow-50 opacity-50 blur-xl' />
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 pt-4'>
                <div className='flex items-center gap-2'>
                    <Badge
                        variant='outline'
                        className='border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    >
                        {' '}
                        {item.categoryName}{' '}
                    </Badge>
                    <span className='text-xs font-medium text-slate-500'> {item.auctionType} </span>
                </div>
            </CardHeader>{' '}
            <CardContent className='pb-4 pt-0'>
                {' '}
                {/* 1. 낙찰자 & 상품명 (히어로 섹션) */}
                <div className='mt-2 flex items-start gap-3'>
                    <div className='relative'>
                        <ProfileImage
                            src={item.bidderProfileImage}
                            size={48}
                            className='border-2 border-white shadow-sm'
                        />
                        <div className='absolute -bottom-1 -right-1 rounded-full bg-yellow-400 p-1 text-white shadow-sm'>
                            <Trophy className='h-3 w-3' fill='currentColor' />
                        </div>
                    </div>
                    <div className='flex-1 min-w-0'>
                        <div className='text-sm text-slate-600'>
                            <span className='font-bold text-slate-900'>{item.bidderName}</span> 님의
                            낙찰 성공! 🎉
                        </div>
                        <h3 className='mt-0.5 truncate text-lg font-bold text-slate-900'>
                            {' '}
                            {item.title}{' '}
                        </h3>
                    </div>
                </div>
                <Separator className='my-4 bg-slate-100' /> {/* 2. 가격 정보 강조 (핵심 포인트!) */}
                <div className='rounded-lg bg-slate-50 p-3 ring-1 ring-slate-100'>
                    <div className='flex items-center justify-between text-xs text-slate-500 mb-1'>
                        <span>시작 가격</span> <span>최종 낙찰가</span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='text-sm font-medium text-slate-400 line-through decoration-slate-400/50'>
                            {' '}
                            {formatNumber(item.startPrice)}원
                        </div>
                        <TrendingUp className='h-4 w-4 text-slate-300 mx-2' />
                        <div className='text-xl font-extrabold text-indigo-600'>
                            {' '}
                            {formatNumber(item.confirmedBidPrice)}원
                        </div>
                    </div>
                    {isProfit && (
                        <div className='mt-1 text-right text-xs font-medium text-indigo-500'>
                            {' '}
                            (+{formatNumber(priceDiff)}원 상승 🔥){' '}
                        </div>
                    )}{' '}
                </div>
                {/* 3. 통계 및 기간 정보 (아이콘 활용) */}
                <div className='mt-4 grid grid-cols-2 gap-3 text-xs'>
                    {' '}
                    {/* 거래 현황 */}
                    <div className='flex flex-col gap-1.5'>
                        <span className='font-semibold text-slate-700'>참여 열기</span>
                        <div className='flex items-center gap-3 text-slate-600'>
                            <div className='flex items-center gap-1'>
                                <Gavel className='h-3.5 w-3.5 text-slate-400' />
                                <span>입찰 {item.biddingCount ?? 0}회</span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <MessageCircle className='h-3.5 w-3.5 text-slate-400' />
                                <span>채팅 {item.chatCount ?? 0}개</span>
                            </div>
                        </div>
                    </div>
                    {/* 기간 */}
                    <div className='flex flex-col gap-1.5 text-right items-end'>
                        <span className='font-semibold text-slate-700 flex items-center gap-1'>
                            {' '}
                            <CalendarClock className='h-3.5 w-3.5' /> 진행 기간{' '}
                        </span>
                        <div className='text-slate-500 leading-tight'>
                            <div>{formatDateTime(item.startTime)}</div>
                            <div className='text-[10px] text-slate-400'>
                                ~ {formatDateTime(item.endTime)}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>{' '}
        </Card>
    );
};
