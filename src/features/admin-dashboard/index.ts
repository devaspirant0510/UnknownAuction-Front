export { default as AdminDashboardOverviewSection } from './ui/AdminDashboardOverviewSection';
import type { ApiResult } from '@entities/common';

export type AuctionStats = {
    activeAuctionCount: number;
    yesterdayAuctionCount: number;
    todayAuctionCount: number;
};

export type BiddingDashboardStats = {
    totalConfirmedCount: number;
    yesterdayConfirmedCount: number;
    yesterdaySales: number;
    todayConfirmedCount: number;
    totalSales: number;
    todaySales: number;
};

export type AccountDashboardStats = {
    todayUserCount: number;
    totalUserCount: number;
    yesterdayUserCount: number;
};

export type AdminDashboardOverview = {
    liveAuctionStats: AuctionStats;
    blindAuctionStats: AuctionStats;
    liveBiddingDashboardStats: BiddingDashboardStats;
    blindBiddingDashboardStats: BiddingDashboardStats;
    accountDashboardStats: AccountDashboardStats;
};

// 서버 응답이 래핑되어 오는 형태
export type AdminDashboardOverviewResponse = ApiResult<AdminDashboardOverview>;
