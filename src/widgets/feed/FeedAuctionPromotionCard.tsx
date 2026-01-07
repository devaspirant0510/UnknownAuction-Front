import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import type { FeedAuctionPromotion } from '@/entities/feed/model';

type Props = {
    auction: FeedAuctionPromotion;
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

const mapStatus = (status: string) => {
    switch (status) {
        case 'BEFORE_START':
            return { label: '시작 전', className: 'bg-slate-100 text-slate-700' };
        case 'IN_PROGRESS':
            return { label: '진행 중', className: 'bg-green-100 text-green-700' };
        case 'ENDED':
            return { label: '종료', className: 'bg-gray-100 text-gray-700' };
        default:
            return { label: status, className: 'bg-slate-100 text-slate-700' };
    }
};

export const FeedAuctionPromotionCard = ({ auction }: Props) => {
    const navigate = useNavigate();

    const statusMeta = useMemo(() => mapStatus(auction.status), [auction.status]);

    return (
        <button
            type='button'
            onClick={(e) => {
                e.stopPropagation();
                navigate(`/auction/${auction.auctionId}`);
            }}
            className='w-full mt-4 text-left rounded-xl border border-orange-200 bg-orange-50/50 hover:bg-orange-50 transition px-4 py-3'
        >
            <div className='flex items-center justify-between gap-2'>
                <div className='text-sm font-semibold text-orange-700'>경매</div>
                <Badge className={statusMeta.className}>{statusMeta.label}</Badge>
            </div>

            <div className='mt-2 flex gap-3'>
                <div className='w-20 h-20 rounded-lg overflow-hidden bg-white border border-orange-100 flex-shrink-0'>
                    <img
                        src={auction.imageUrl}
                        alt={auction.title}
                        className='w-full h-full object-cover'
                        loading='lazy'
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>

                <div className='flex-1 min-w-0'>
                    {auction.categoryName && (
                        <div className='text-xs text-gray-500 mb-1'>[{auction.categoryName}]</div>
                    )}
                    <div className='font-semibold text-gray-900 line-clamp-1'>{auction.title}</div>
                    <div className='text-sm text-gray-600 line-clamp-2 mt-1'>
                        {auction.description}
                    </div>
                </div>
            </div>

            <Separator className='my-3 bg-orange-100' />

            <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600'>
                <div>
                    시작가{' '}
                    <span className='font-semibold text-gray-900'>
                        {formatNumber(auction.startPrice)}원
                    </span>
                </div>
                <div>
                    조회{' '}
                    <span className='font-semibold text-gray-900'>
                        {formatNumber(auction.viewCount)}
                    </span>
                </div>
                <div className='text-gray-500'>
                    {formatDateTime(auction.startTime)} ~ {formatDateTime(auction.endTime)}
                </div>
            </div>
        </button>
    );
};
