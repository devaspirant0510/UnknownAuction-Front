import React, { FC } from 'react';
import { useQueryGetAuctionById } from '@/features/auction/lib';
import { ErrorBox } from '@shared/ui';
import { AuctionInfoData } from '@entities/auction/model';

type Props = {
    auctionId: number;
    children: (data: AuctionInfoData) => React.ReactNode;
};
const FetchAuctionInfo: FC<Props> = ({ auctionId, children }) => {
    const { isLoading, isError, error, data } = useQueryGetAuctionById(auctionId);
    if (isLoading) {
        return <>loading</>;
    }
    if (isError) {
        return <ErrorBox error={error} />;
    }
    if (!data || !data.data) {
        return <></>;
    }
    return <>{children(data.data)}</>;
};

export default FetchAuctionInfo;
