import React, { FC } from 'react';
import { CalendarDaysIcon, EllipsisIcon, TriangleAlertIcon } from 'lucide-react';
import BiddingDialog from '@widgets/auction/dialog/BiddingDialog.tsx';
import { Client } from 'stompjs';
import AuctionHistoryDialog from '@widgets/auction/dialog/AuctionHistoryDialog.tsx';
import DailySummaryDialog from '@widgets/auction/dialog/DailySummaryDialog.tsx';

type Props = {
    client: Client;
};
const AuctionChatSideMenu: FC<Props> = ({ client }) => {
    return (
        <div className={'flex flex-col rounded-2xl bg-[#FFD1BE] pt-8 h-full mt-8'}>
            <div
                className={
                    'bg-white border-[#FFD1BE] border-solid border-1 flex justify-center items-center flex-col py-3 px-2'
                }
            >
                <div
                    className={
                        'w-10 h-10 bg-[#FFD1BE] rounded-full flex justify-center items-center '
                    }
                >
                    <EllipsisIcon className={'text-[#FEFDFD] border-0.5 border-[#DADADA]'} />
                </div>
                <span className={'text-xs mt-1'}>더보기</span>
            </div>
            <AuctionHistoryDialog />
            <DailySummaryDialog>
                <div
                    className={
                        'bg-white border-[#FFD1BE] border-solid border-1 flex justify-center items-center flex-col py-3 px-2'
                    }
                >
                    <div
                        className={
                            'w-10 h-10 bg-[#FFD1BE] rounded-full flex justify-center items-center '
                        }
                    >
                        <CalendarDaysIcon
                            className={'text-[#FEFDFD] border-0.5 border-[#DADADA]'}
                        />
                    </div>
                    <span className={'text-xs mt-1'}>경매일정</span>
                </div>
            </DailySummaryDialog>
            <div
                className={
                    'bg-white border-[#FFD1BE] border-solid border-1 flex justify-center items-center flex-col py-3 px-2'
                }
            >
                <div
                    className={
                        'w-10 h-10 bg-[#FFD1BE] rounded-full flex justify-center items-center '
                    }
                >
                    <TriangleAlertIcon className={'text-[#FEFDFD] border-0.5 border-[#DADADA]'} />
                </div>
                <span className={'text-xs mt-1'}>신고하기</span>
            </div>
            <BiddingDialog client={client} />
        </div>
    );
};

export default AuctionChatSideMenu;
