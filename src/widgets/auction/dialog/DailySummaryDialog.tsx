import React, { FC } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@shared/components/ui';
import { useParams } from 'react-router';
import FetchAuctionDailySummary from '@/features/auction/ui/FetchAuctionDailySummary.tsx';
import FetchAuctionInfo from '@/features/auction/ui/FetchAuctionInfo.tsx';
import AuctionCalendar from '@widgets/auction/AuctionCalendar.tsx';

type Props = {
    children: React.ReactNode;
};
type Params = {
    id: number;
};
const DailySummaryDialog: FC<Props> = ({ children }) => {
    const { id } = useParams<Params>();
    if (!id) {
        return <></>;
    }
    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>경매 일정</DialogTitle>
                </DialogHeader>
                <DialogDescription>경매 기간동안 거래 내역을 표시합니다.</DialogDescription>
                <FetchAuctionInfo auctionId={id}>
                    {(data) => {
                        return (
                            <FetchAuctionDailySummary auctionId={data.auction.id}>
                                {(transaction) => {
                                    return (
                                        <AuctionCalendar
                                            startTime={data.auction.startTime}
                                            endTime={data.auction.endTime}
                                            transactions={transaction}
                                        />
                                    );
                                }}
                            </FetchAuctionDailySummary>
                        );
                    }}
                </FetchAuctionInfo>
            </DialogContent>
        </Dialog>
    );
};

export default DailySummaryDialog;
