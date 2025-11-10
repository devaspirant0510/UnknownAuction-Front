import React, { FC, useCallback, useState } from 'react';
import { Page } from '@entities/common';
import { BidLog } from '@entities/auction/model';
import { useQueryGetAuctionHistoryPage } from '@/features/auction/lib/useQueryGetAuctionHistoryPaging.ts';

type Props = {
    auctionId: number;
    children: (
        data: Page<BidLog>,
        next: () => void,
        prev: () => void,
        page: number,
        setPage: (page: number) => void,
    ) => React.ReactNode;
};
const FetchAuctionBidHistory: FC<Props> = ({ children, auctionId }) => {
    const [page, setPage] = useState(0);
    const { isLoading, isError, error, data } = useQueryGetAuctionHistoryPage(auctionId, page);
    const nextPage = useCallback(() => {
        setPage((prev) => prev + 1);
    }, []);
    const prevPage = useCallback(() => {
        setPage((prev) => prev - 1);
    }, []);

    if (isLoading) {
        return <>loading</>;
    }
    if (isError) {
        return <>error</>;
    }
    if (!data || !data.data) {
        return <>no data</>;
    }
    return <>{children(data.data, nextPage, prevPage, page, setPage)}</>;
};

export default FetchAuctionBidHistory;
