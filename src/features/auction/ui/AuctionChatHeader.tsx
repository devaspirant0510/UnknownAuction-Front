import React, { FC } from 'react';
import { Auction } from '@entities/auction/model';
import BackButton from '@shared/ui/BackButton.tsx';
import { useQueryGetAuctionById } from '@/features/auction/lib';
import { DateUtil } from '@shared/lib';
import { BaseLayout } from '@shared/layout';

type Props = {
    auctionId: number;
    type: 'blind' | 'live';
};
const AuctionChatHeader: FC<Props> = ({ auctionId, type }) => {
    const { isLoading, data, isError, error } = useQueryGetAuctionById(auctionId);
    if (isLoading) {
        return <>loading</>;
    }
    if (isError) {
        return <>{error}</>;
    }
    if (!data || !data.data) {
        return <>no data</>;
    }
    return (
        <>
            <div className={'flex gap-3 mb-6 '}>
                <BackButton className={'absolute left-8'} />

                <div className={'flex flex-col w-full  '}>
                    <div>
                        <div className={'text-[#5A5A5A] text-sm'}>
                            [{data.data.auction.category.name}]
                        </div>
                        <div className={'text-xl'}>{data.data.auction.goods.title}</div>
                    </div>
                    <div className={'flex justify-between '}>
                        <div className={'flex items-end'}>
                            <span className={'text-[#E9AB91] mr-2'}>현재가</span>
                            {type === 'live' ? (
                                <span className={'text-[#E47547] text-2xl font-bold'}>
                                    {data.data.lastBiddingLog
                                        ? data.data.lastBiddingLog.price.toLocaleString()
                                        : data.data.auction.startPrice.toLocaleString()}
                                    p
                                </span>
                            ) : (
                                <span className={'text-[#E47547] text-2xl font-bold'}>Unknown</span>
                            )}
                        </div>
                        <div className={'text-[#C9A9A9] text-sm'}>
                            최근 입찰 :{' '}
                            {data.data.lastBiddingLog
                                ? DateUtil.timeAgo(data.data.lastBiddingLog.createdAt)
                                : '거래 내역 없음'}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuctionChatHeader;
