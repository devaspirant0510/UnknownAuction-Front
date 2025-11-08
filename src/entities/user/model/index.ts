import { FileEntity } from '@entities/auction/model';

export type FollowUser = {
    id: number;
    nickname: string;
    profileUrl: string;
    following: boolean;
};

export type User = {
    id: number;
    userName: string;
    userProfileUrl: string;
    email: string;
};
export type Account = {
    id: number;
    nickname: string;
    profileUrl: string;
    email: string;
    followers: number;
    followings: number;
    description: string;
    bidCount: number;
    sellCount: number;
    reviewCount: number;
    userType: string;
    point: number;
};

export type MyInfo = {
    id: number;
    email: string;
    nickname: string;
    profileUrl: string;
    point: number;
};

export type AccountDto = {
    user: Account;
    followingCount: number;
    followerCount: number;
    feedCount: number;
    profileImage: FileEntity;
};
export type UserStats = {
    nickname: string;
    sellCount: number;
    wishListCount: number;
    biddingCount: number;
    followerCount: number;
    reviewCount: number | null;
    profileUrl: string;
    followingCount: number;
};

export type FollowEntity = {
    id: number;
    follower: Account;
    following: Account;
    createdAt: string;
};
