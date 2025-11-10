import React, { FC } from 'react';
import { AuctionInfoData } from '@entities/auction/model';
import AuctionParticipantsDialog from '@widgets/auction/dialog/AuctionParticipantsDialog.tsx';
import StatusDeliveryType from '@widgets/auction/info/StatusDeliveryType.tsx';
import { DateUtil } from '@shared/lib';
import DeliveryTypeInfoDialog from '@widgets/auction/dialog/DeliveryTypeInfoDialog.tsx';

interface Props {
    data?: AuctionInfoData;
}

const AuctionInfoStatus: FC<Props> = ({ data }) => {
    if (!data) return <></>;
    return (
        <>
            <div>
                <div className={'flex  rounded-full justify-between items-center mt-4'}>
                    <AuctionParticipantsDialog auctionId={data.auction.id}>
                        <div className={'bg-ubackground2 rounded-full flex items-center'}>
                            <div className={'bg-usecondary rounded-full text-white py-1 px-3'}>
                                참여자
                            </div>
                            <div className={'text-uprimary px-3'}>{data.participateCount}명</div>
                        </div>
                    </AuctionParticipantsDialog>
                    <div className={'rounded-full text-usecondary bg-ubackground2 py-1 px-3'}>
                        {data.lastBiddingLog
                            ? DateUtil.timeAgo(data.lastBiddingLog.createdAt)
                            : '거래 내역 없음'}
                    </div>
                </div>
                <div className={'flex  rounded-full justify-between items-center mt-4'}>
                    <div className={'bg-ubackground2 rounded-full flex items-center'}>
                        <div className={'bg-usecondary rounded-full text-white py-1 px-3'}>
                            입찰
                        </div>
                        <div className={'text-uprimary px-3'}>{data.biddingCount}건</div>
                    </div>
                    <div className={'rounded-full text-usecondary bg-ubackground2 py-1 px-3'}>
                        입찰내역
                    </div>
                </div>
                <div className={'flex  rounded-full justify-between items-center mt-4'}>
                    <StatusDeliveryType deliveryType={data.auction.goods.deliveryType} />
                    <DeliveryTypeInfoDialog data={data.auction}>
                        <div className={'rounded-full text-usecondary bg-ubackground2 py-1 px-3'}>
                            상세보기
                        </div>
                    </DeliveryTypeInfoDialog>
                </div>
            </div>
        </>
    );
};

export default AuctionInfoStatus;
