import React, { FC } from 'react';
import { useQueryGetDailySummary } from '@/features/auction/lib/useQueryGetDailySummary.ts';
import { ErrorBox } from '@shared/ui';
import { BidDailySummary } from '@entities/auction/model';

type Props = {
    auctionId: number;
    children: (data: BidDailySummary[]) => React.ReactNode;
};
const FetchAuctionDailySummary: FC<Props> = ({ auctionId, children }) => {
    const { isLoading, isError, error, data } = useQueryGetDailySummary(auctionId);
    if (isLoading) {
        return <>loading</>;
    }
    if (isError) {
        return <ErrorBox error={error} />;
    }
    if (!data || !data.data) {
        return <>nodata</>;
    }
    return <>{children(data.data)}</>;
};

export default FetchAuctionDailySummary;
