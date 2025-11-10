import { Account } from '@entities/user/model';

export enum DELIVERY_TYPE {
    DIRECT = 'DIRECT',
    PARCEL = 'PARCEL',
    NEGOTIATE = 'NEGOTIATE',
}

export type Goods = {
    title: string;
    description: string;
    deliveryType: DELIVERY_TYPE;
    images: string[];
    category: string;
};

export type AuctionData = {
    auction: Auction;
    images: FileEntity[];
    biddingCount: number;
    chatCount: number;
    likeCount: number;
    chatMessagingCount: number;
    participateCount: number;
    currentPrice: number;
    wishListCount: number;
};
export type Category = {
    createdAt: string;
    id: number;
    name: string;
    root: string;
    updatedAt: Date;
};
export type AuctionInfoData = {
    auction: Auction;
    images: FileEntity[];
    biddingCount: number;
    chatCount: number;
    likeCount: number;
    participateCount: number;
    lastBiddingLog: BiddingLogEntity;
    wishListCount: number;
    isWishListed: boolean;
};

export type FileEntity = {
    id?: number;
    userId?: object;
    fileName?: string;
    extension?: string;
    url?: string;
    fileType?: string;
    fileId?: number;
};

export type Auction = {
    id: number;
    goods: Goods;
    user: Account;
    category: Category;
    viewCount: number;
    // auctionType: 'live';
    auctionType: 'LIVE' | 'BLIND';
    startPrice: number;
    count: number;
    startTime: string;
    endTime: string;
    createdAt: string;
    tradingArea: TradingArea;
    deliveryInfo: DeliveryInfo;
};
export type TradingArea = {
    id: number;
    latitude: number;
    longitude: number;
    radius: number;
    address: number;
};

type DeliveryInfo = {
    id: number;
    deliveryFee: number;
};
export type ChatEntity = {
    id: number;
    chatType: 'MESSAGE' | 'BID_LOG';
    contents: string;
    createdAt: string;
    auction: Auction;
    user: Account;
    biddingLog: BiddingLogEntity;
};

export type ChatDto = {
    id: number;
    contents: string;
    createdAt: string; // ISO 날짜 문자열
    userId: number;
    nickname: string;
    profileUrl: string;
    chatType: 'MESSAGE' | 'BID_LOG'; // enum 형태로 쓸 수도 있음!
    prevPrice?: number;
    price?: number;
};

export type BidDailySummary = {
    truncatedDate: string;
    totalPrice: number;
    count: number;
};

export interface BiddingLogEntity {
    id: number;
    bidder: Account;
    auction: Auction;
    createdAt: string;
    price: number;
    prevPrice: number;
}

export type BidLog = {
    id: number;
    bidderId: number;
    bidderName: string;
    profileUrl: string;
    price: number;
    prevPrice: number;
    createdAt: string;
};

export type AuctionParticipateUser = {
    nickname: string;
    participantId: number;
    id: number;
    profileUrl: string;
};
export type ConfirmedBid = {
    id: number;
    auction: Auction;
    bidder: Account;
    seller: Account;
    biddingLog: BidLog;
};

export type ConfirmedBidsEntity = {
    id: number;
    auction: Auction;
    buyer: Account;
    seller: Account;
    finalPrice: number;
    createdAt: string;
};

export type AuctionItem = {
    id: number;
    goodsTitle: string;
    goodsImageUrl: string;
    categoryName: string;
    bidderName: string;
    status: 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED'; // 상태 enum 가능
    startPrice: number;
    currentPrice: number | null;
    viewCount: number;
    likeCount: number;
    participantCount: number;
    biddingCount: number | null;
    chattingCount: number | null;
    startTime: string; // ISO 문자열
    endTime: string; // ISO 문자열
};
