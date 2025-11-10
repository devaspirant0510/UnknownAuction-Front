import React from 'react';
import { MainLayout } from '@shared/layout';
import { DateUtil } from '@/shared/lib/dateUtils.ts';
import { useParams } from 'react-router';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import FetchAuctionBidHistoryChart from '@/features/auction/ui/FetchAuctionBidHistoryChart.tsx';
import FetchAuctionBidHistory from '@/features/auction/ui/FetchAuctionBidHistory.tsx';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@shared/components/ui/pagination.tsx';
import { BidHistoryTable } from '@widgets/auction/bid-history';
import BackButton from '@shared/ui/BackButton.tsx';

type Params = {
    id: number;
};

const LiveAuctionBidHistoryPage = () => {
    const { id } = useParams<Params>();
    if (!id) {
        return <>error</>;
    }
    return (
        <MainLayout>
            <div className={'flex items-center mb-4'}>
                <BackButton />
                <div className={'text-2xl text-uprimary ml-2'}>거래 내역 상세보기</div>
            </div>
            <FetchAuctionBidHistoryChart auctionId={id}>
                {(data) => {
                    if (data.length === 0) {
                        return <>거래 내역이 없습니다</>;
                    }
                    return (
                        <ResponsiveContainer width={'100%'} height={400}>
                            <LineChart
                                width={500}
                                height={300}
                                data={data}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis
                                    dataKey='createdAt'
                                    tickFormatter={(value) =>
                                        DateUtil.convertDateFormat(value, 'yy.MM.dd hh:mm')
                                    }
                                />
                                <YAxis
                                    width={'auto'}
                                    tickFormatter={(value) => value.toLocaleString() + 'p'}
                                />
                                <Tooltip
                                    formatter={(value) => value.toLocaleString() + 'p'}
                                    labelFormatter={(value) =>
                                        DateUtil.convertDateFormat(value, 'yy-MM-dd hh:mm:ss')
                                    }
                                />
                                <Legend />
                                <Line
                                    type='monotone'
                                    dataKey='price'
                                    stroke='#8884d8'
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    );
                }}
            </FetchAuctionBidHistoryChart>
            <FetchAuctionBidHistory auctionId={id}>
                {(data, next, prev, page, setPage) => {
                    console.log(data);
                    return (
                        <>
                            <BidHistoryTable data={data.content} />
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious onClick={prev} />
                                    </PaginationItem>
                                    {Array(data.totalPages)
                                        .fill(0)
                                        .map((_, index) => (
                                            <PaginationItem key={index}>
                                                <button
                                                    onClick={() => setPage(index)}
                                                    className={`
                                                    px-2 py-1 rounded 
                                                    ${page === index ? 'bg-blue-500 text-white' : 'bg-gray-200'}
                                                `}
                                                >
                                                    {index + 1}
                                                </button>
                                            </PaginationItem>
                                        ))}

                                    <PaginationItem>
                                        <PaginationNext onClick={next} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </>
                    );
                }}
            </FetchAuctionBidHistory>
        </MainLayout>
    );
};

export default LiveAuctionBidHistoryPage;
