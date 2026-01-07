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
