import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { ProfileImage } from '@/shared/ui';
import { Trophy, TrendingUp, MessageCircle, Gavel, X } from 'lucide-react';
import type { ConfirmBidItem } from '@/entities/feed/model';

// 타입 확장은 동일하게 유지 (실제 모델에 맞춰 수정 필요)
type ExtendedConfirmBidItem = ConfirmBidItem & {
    bidCount?: number;
    chatCount?: number;
};

type Props = {
    item: ExtendedConfirmBidItem;
    onClear?: () => void;
};

const formatNumber = (n: number) => n.toLocaleString('ko-KR');

const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    // 날짜 포맷도 공간 절약을 위해 더 짧게 (MM.DD HH:mm)
    return d.toLocaleString('ko-KR', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};

export const ConfirmBidPreviewCard = ({ item, onClear }: Props) => {
    const priceDiff = item.bidConfirmedPrice - item.auctionStartPrice;
    const isProfit = priceDiff > 0;

    return (
        <Card className='relative border border-indigo-100 bg-white shadow-sm p-4'>
            {/* 닫기 버튼: 우측 상단 절대 위치로 띄워서 공간 확보 */}
            {onClear && (
                <button
                    type='button'
                    onClick={onClear}
                    className='absolute top-3 right-3 text-slate-300 hover:text-slate-500 transition-colors'
                >
                    <X className='h-4 w-4' />
                </button>
            )}

            {/* 1. 상단 정보 (카테고리 + 유저 + 상품명) - 파티션 없이 바로 시작 */}
            <div className='flex gap-3'>
                {/* 프로필 이미지 (트로피 뱃지 포함) */}
                <div className='relative shrink-0 mt-1'>
                    <ProfileImage
                        src={item.bidderProfileImage}
                        size={42}
                        className='border border-slate-100'
                    />
                    <div className='absolute -bottom-1 -right-1 rounded-full bg-yellow-400 p-0.5 text-white ring-2 ring-white'>
                        <Trophy className='h-2.5 w-2.5' fill='currentColor' />
                    </div>
                </div>

                {/* 텍스트 영역 */}
                <div className='min-w-0 flex-1 flex flex-col justify-center'>
                    {/* 카테고리 & 타입 (살짝 상단 마진으로 끼워넣기) */}
                    <div className='flex items-center gap-1.5 mb-0.5'>
                        <Badge
                            variant='secondary'
                            className='h-5 px-1.5 text-[10px] font-normal bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-0'
                        >
                            {item.auctionCategoryName}
                        </Badge>
                        <span className='text-[10px] text-slate-400'>| {item.auctionType}</span>
                    </div>

                    {/* 낙찰자 멘트 */}
                    <div className='text-xs text-slate-500 truncate'>
                        <span className='font-bold text-slate-800'>{item.bidderName}</span>님이
                        낙찰!
                    </div>

                    {/* 상품명 */}
                    <h3 className='text-sm font-bold text-slate-900 truncate leading-tight mt-0.5'>
                        {item.auctionTitle}
                    </h3>
                </div>
            </div>

            {/* 2. 가격 정보 박스 (컴팩트 버전) */}
            <div className='mt-3 rounded bg-slate-50 p-2.5 ring-1 ring-slate-100/80'>
                <div className='flex items-end justify-between'>
                    <div className='flex flex-col'>
                        <span className='text-[10px] text-slate-400 mb-0.5'>
                            시작 {formatNumber(item.auctionStartPrice)}
                        </span>
                        <div className='flex items-center gap-1 text-xs font-medium text-slate-400 line-through decoration-slate-300'>
                            {/* 시작가는 작게 처리 */}
                        </div>
                    </div>

                    {/* 화살표 아이콘 */}
                    <TrendingUp className='h-4 w-4 text-indigo-200 mb-1' />

                    <div className='flex flex-col items-end'>
                        <span className='text-[10px] font-medium text-indigo-500 mb-0.5'>
                            {isProfit ? `+${formatNumber(priceDiff)}원` : '변동없음'}
                        </span>
                        <div className='text-lg font-bold text-indigo-600 leading-none'>
                            {formatNumber(item.bidConfirmedPrice)}원
                        </div>
                    </div>
                </div>
            </div>

            {/* 구분선 (아주 얇게) */}
            <Separator className='my-2.5 bg-slate-100' />

            {/* 3. 하단 통계 정보 (한 줄로 통합) */}
            <div className='flex items-center justify-between text-[11px] text-slate-500'>
                <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded text-slate-600'>
                        <Gavel className='h-3 w-3' />
                        <span>{item.bidCount ?? 0}</span>
                    </div>
                    <div className='flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded text-slate-600'>
                        <MessageCircle className='h-3 w-3' />
                        <span>{item.chatCount ?? 0}</span>
                    </div>
                </div>
                <div className='tracking-tight text-slate-400'>
                    {formatDateTime(item.auctionStartTime)} ~{' '}
                    {formatDateTime(item.auctionEndTime).split(' ')[1]}
                </div>
            </div>
        </Card>
    );
};
