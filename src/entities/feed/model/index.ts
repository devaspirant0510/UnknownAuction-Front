export type FileProjection = {
    id: number;
    fileId: number;
    url: string;
    fileType: 'FEED' | 'PROFILE' | string;
};

export type FeedAuctionPromotion = {
    auctionId: number;
    categoryName: string | null;
    title: string;
    description: string;
    likeCount: number | null;
    viewCount: number;
    startPrice: number;
    status: 'BEFORE_START' | 'IN_PROGRESS' | 'ENDED' | string;
    startTime: string;
    endTime: string;
    imageUrl: string;
};

export type FeedListResponse = {
    id: number;
    contents: string;
    writerId: number | null;
    writerName: string;
    writerProfileImageUrl: string | null;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    liked: boolean;
    images: FileProjection[];
    feedAuction?: FeedAuctionPromotion | null;
    feedConfirmBid?: import('./confirmBid').FeedConfirmBid | null;
};

export type { ConfirmBidItem, FeedConfirmBid } from './confirmBid';
