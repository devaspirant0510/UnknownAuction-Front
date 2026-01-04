export type AdminAuctionStatus = 'BEFORE_START' | 'IN_PROGRESS' | 'ENDED';

export type AdminLiveAuctionListItem = {
    goodsTitle: string;
    lastBidAmount: number;
    categoryName: string;
    viewCount: number;
    chatCount: number;
    endTime: string;
    createdAt: string;
    auctionId: number;
    startPrice: number;
    biddingCount: number;
    participantsCount: number;
    auctionType: string; // backend: "0" | "1" ... 아직 명세 미정
    startTime: string;
    auctionStatus: AdminAuctionStatus; // backend: "0" ... 아직 명세 미정
    sellerNickname: string;
};
