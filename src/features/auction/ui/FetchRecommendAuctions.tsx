import React, { FC } from 'react';
import { useQueryRecommendAuctions } from '@/features/auction/lib/useQueryRecommendAuctions.ts';
import { AuctionData } from '@entities/auction/model';

type Props = {
    id: number;
    children: (data: AuctionData[]) => React.ReactNode;
};
const FetchRecommendAuctions: FC<Props> = ({ id, children }) => {
    const { isLoading, isError, error, data } = useQueryRecommendAuctions(id);
    if (isLoading) {
        return <></>;
    }
    if (isError) {
        return <>error</>;
    }
    if (!data || !data.data || !data?.data || data.data.length === 0) {
        return <>nodata</>;
    }
    return <>{children(data.data)}</>;
};

export default FetchRecommendAuctions;
