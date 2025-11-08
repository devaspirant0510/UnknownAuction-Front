import React, { FC, useState } from 'react';
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
import { queryClient, toastError } from '@shared/lib';
import { useQueryGetAuctionById } from '@/features/auction/lib';

type Props = {
    children: React.ReactNode;
};
type Params = {
    id: number;
};
// 📁 hooks/useGetAuctionById.ts
import { axiosClient } from '@shared/lib';
import { ApiResult } from '@entities/common';
import { AuctionInfoData } from '@entities/auction/model';

export const getAuctionById = async (id: number) => {
    const queryKey = ['api', 'v1', 'auction', Number(id)];

    // 1️⃣ 캐시에 이미 있는지 확인
    const cached = queryClient.getQueryData<ApiResult<AuctionInfoData>>(queryKey);
    if (cached) {
        // console.log('💾 캐시 데이터 사용');
        return cached;
    }

    // 2️⃣ 없으면 fetch로 가져오기
    const { data } = await axiosClient.get<ApiResult<AuctionInfoData>>(`/api/v1/auction/${id}`);

    // 3️⃣ 캐시에 직접 세팅
    queryClient.setQueryData(queryKey, data);

    // console.log('🌐 서버에서 새로 가져옴');
    return data;
};

const DailySummaryDialog: FC<Props> = ({ children }) => {
    const { id } = useParams<Params>();
    const type = location.pathname.split('/')[2];
    const [open, setOpen] = useState(false);
    const { isLoading, isError, data } = useQueryGetAuctionById(id!);
    if (!id) {
        return <></>;
    }
    return (
        <Dialog
            open={open}
            onOpenChange={async (nextOpen) => {
                if (nextOpen) {
                    if (type === 'blind') {
                        const auction = await getAuctionById(id!);
                        if (new Date() < new Date(auction.data.auction.endTime)) {
                            toastError('블라인드 경매는 종료 후에만 열람할 수 있어요!');
                            return; // 다이얼로그 열리지 않게 막기
                        }
                    }
                }
                setOpen(nextOpen);
            }}
        >
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
