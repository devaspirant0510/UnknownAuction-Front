export type ConfirmBidItem = {
    confirmBidId: number;
    auctionId: number;
    auctionTitle: string;
    auctionDescription: string;
    auctionCategoryName: string;
    auctionStartPrice: number;
    bidConfirmedPrice: number;
    auctionStartTime: string;
    auctionEndTime: string;
    auctionType: 'LIVE' | 'BLIND' | string;
    bidderName: string;
    bidderProfileImage: string | null;
    chatCount: number | null;
    biddingCount: number | null;
};

// 최신 피드 응답(feedConfirmBid)에 포함되는 거래내역 모델
export type FeedConfirmBid = {
    confirmBidId: number;
    auctionId: number;
    auctionType: 'LIVE' | 'BLIND' | string;
    categoryName: string | null;
    title: string;
    description: string;
    startPrice: number;
    startTime: string;
    endTime: string;
    confirmedBidPrice: number;
    bidderName: string;
    bidderProfileImage: string | null;
    biddingCount: number | null;
    chatCount: number | null;
};
