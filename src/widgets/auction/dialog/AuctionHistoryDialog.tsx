import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@shared/components/ui/dialog.tsx';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@shared/components/ui/table';
import { Button } from '@shared/components/ui/button';
import { useQueryGetAuctionHistory } from '@/features/auction/lib';
import { useParams } from 'react-router-dom';
import { ListCheckIcon } from 'lucide-react';
import { ProfileImage } from '@shared/ui';
import { axiosClient, queryClient, toastError } from '@shared/lib';
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
const AuctionHistoryDialog = () => {
    const { id } = useParams<{ id: string }>();
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);

    const { data, isLoading, isError } = useQueryGetAuctionHistory(Number(id), page);
    const type = location.pathname.split('/')[2]; // live or blind

    const handleNextPage = () => {
        if (data && data.data?.length === 8) {
            setPage(page + 1);
        }
    };

    const handlePrevPage = () => {
        setPage(Math.max(0, page - 1));
    };

    return (
        <Dialog
            open={open}
            onOpenChange={async (nextOpen) => {
                if (nextOpen) {
                    if (type === 'blind' && id) {
                        const auction = await getAuctionById(Number(id));
                        const endTime = new Date(auction.data.auction.endTime);
                        if (new Date() < endTime) {
                            toastError('블라인드 경매는 종료 후에만 열람할 수 있어요!');
                            return; // 다이얼로그 안 열리게 막기
                        }
                    }
                }
                setOpen(nextOpen);
            }}
        >
            <DialogTrigger asChild>
                <div className='bg-white border-[#FFD1BE] border-solid border-1 flex justify-center items-center flex-col py-3 px-2 cursor-pointer'>
                    <div className='w-10 h-10 bg-[#FFD1BE] rounded-full flex justify-center items-center'>
                        <ListCheckIcon className={'text-[#FEFDFD] border-0.5 border-[#DADADA]'} />
                    </div>
                    <span className='text-xs mt-1'>경매 내역</span>
                </div>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>경매 내역</DialogTitle>
                </DialogHeader>

                <div>
                    {isLoading && <p>로딩 중...</p>}
                    {isError && <p>에러가 발생했습니다.</p>}
                    {data && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>입찰자</TableHead>
                                    <TableHead>입찰 가격</TableHead>
                                    <TableHead>입찰 시간</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.data?.map((history) => (
                                    <TableRow key={history.id}>
                                        <TableCell>
                                            <div className='flex items-center'>
                                                <ProfileImage size={30} src={history.profileUrl} />
                                                <span className='ml-2'>{history.bidderName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{history.price.toLocaleString()}원</TableCell>
                                        <TableCell>
                                            {new Date(history.createdAt).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                <DialogFooter className='justify-between'>
                    <div>
                        <Button onClick={handlePrevPage} disabled={page === 0}>
                            이전
                        </Button>
                        <Button
                            onClick={handleNextPage}
                            disabled={!data || data.data.length < 8}
                            className='ml-2'
                        >
                            다음
                        </Button>
                    </div>

                    <DialogClose asChild>
                        <Button type='button' variant='secondary'>
                            닫기
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AuctionHistoryDialog;
