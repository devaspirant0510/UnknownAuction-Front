import type React from 'react';
import type { AdminDashboardOverview } from '@entities/admin/dashboard';

type Props = {
    overview: AdminDashboardOverview;
};

const formatNumber = (value: number) => new Intl.NumberFormat('ko-KR').format(value);
const formatCurrencyKRW = (value: number) =>
    new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        maximumFractionDigits: 0,
    }).format(value);

const KpiCard: React.FC<{ title: string; value: string; sub?: string; tone?: string }> = ({
    title,
    value,
    sub,
    tone = 'text-gray-900',
}) => {
    return (
        <div className='bg-white shadow rounded p-4'>
            <div className='text-sm font-medium text-gray-600'>{title}</div>
            <div className={`mt-1 text-2xl font-bold ${tone}`}>{value}</div>
            {sub ? <div className='mt-2 text-xs text-gray-500'>{sub}</div> : null}
        </div>
    );
};

const StatBlock: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className='flex items-center justify-between py-2 border-b last:border-b-0'>
        <div className='text-sm text-gray-600'>{label}</div>
        <div className='text-sm font-semibold text-gray-900'>{value}</div>
    </div>
);

const AdminDashboardOverviewWidget: React.FC<Props> = ({ overview }) => {
    const liveAuction = overview.liveAuctionStats;
    const blindAuction = overview.blindAuctionStats;
    const liveBid = overview.liveBiddingDashboardStats;
    const blindBid = overview.blindBiddingDashboardStats;
    const account = overview.accountDashboardStats;

    const activeAuctionTotal = liveAuction.activeAuctionCount + blindAuction.activeAuctionCount;
    const todayAuctionTotal = liveAuction.todayAuctionCount + blindAuction.todayAuctionCount;
    const yesterdayAuctionTotal =
        liveAuction.yesterdayAuctionCount + blindAuction.yesterdayAuctionCount;

    const totalSales = liveBid.totalSales + blindBid.totalSales;
    const todaySales = liveBid.todaySales + blindBid.todaySales;
    const yesterdaySales = liveBid.yesterdaySales + blindBid.yesterdaySales;

    const totalConfirmed = liveBid.totalConfirmedCount + blindBid.totalConfirmedCount;
    const todayConfirmed = liveBid.todayConfirmedCount + blindBid.todayConfirmedCount;
    const yesterdayConfirmed = liveBid.yesterdayConfirmedCount + blindBid.yesterdayConfirmedCount;

    return (
        <div className='space-y-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                <KpiCard
                    title='총 회원 수'
                    value={formatNumber(account.totalUserCount)}
                    sub={`오늘 +${formatNumber(account.todayUserCount)} · 어제 +${formatNumber(account.yesterdayUserCount)}`}
                    tone='text-blue-600'
                />
                <KpiCard
                    title='진행 중 경매(전체)'
                    value={formatNumber(activeAuctionTotal)}
                    sub={`라이브 ${formatNumber(liveAuction.activeAuctionCount)} · 블라인드 ${formatNumber(blindAuction.activeAuctionCount)}`}
                    tone='text-orange-600'
                />
                <KpiCard
                    title='총 낙찰(전체)'
                    value={formatNumber(totalConfirmed)}
                    sub={`오늘 ${formatNumber(todayConfirmed)} · 어제 ${formatNumber(yesterdayConfirmed)}`}
                    tone='text-emerald-600'
                />
                <KpiCard
                    title='총 매출(전체)'
                    value={formatCurrencyKRW(totalSales)}
                    sub={`오늘 ${formatCurrencyKRW(todaySales)} · 어제 ${formatCurrencyKRW(yesterdaySales)}`}
                    tone='text-purple-600'
                />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <div className='bg-white rounded shadow p-6'>
                    <div className='text-lg font-semibold'>경매 현황</div>
                    <div className='mt-4'>
                        <StatBlock
                            label='오늘 등록된 경매(전체)'
                            value={formatNumber(todayAuctionTotal)}
                        />
                        <StatBlock
                            label='어제 등록된 경매(전체)'
                            value={formatNumber(yesterdayAuctionTotal)}
                        />
                        <StatBlock
                            label='진행 중 라이브 경매'
                            value={formatNumber(liveAuction.activeAuctionCount)}
                        />
                        <StatBlock
                            label='진행 중 블라인드 경매'
                            value={formatNumber(blindAuction.activeAuctionCount)}
                        />
                    </div>
                </div>

                <div className='bg-white rounded shadow p-6'>
                    <div className='text-lg font-semibold'>낙찰/매출 현황</div>
                    <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='rounded border p-4'>
                            <div className='text-sm text-gray-600 font-medium'>라이브</div>
                            <div className='mt-3 space-y-2'>
                                <StatBlock
                                    label='총 낙찰'
                                    value={formatNumber(liveBid.totalConfirmedCount)}
                                />
                                <StatBlock
                                    label='총 매출'
                                    value={formatCurrencyKRW(liveBid.totalSales)}
                                />
                                <StatBlock
                                    label='오늘 낙찰'
                                    value={formatNumber(liveBid.todayConfirmedCount)}
                                />
                                <StatBlock
                                    label='오늘 매출'
                                    value={formatCurrencyKRW(liveBid.todaySales)}
                                />
                            </div>
                        </div>

                        <div className='rounded border p-4'>
                            <div className='text-sm text-gray-600 font-medium'>블라인드</div>
                            <div className='mt-3 space-y-2'>
                                <StatBlock
                                    label='총 낙찰'
                                    value={formatNumber(blindBid.totalConfirmedCount)}
                                />
                                <StatBlock
                                    label='총 매출'
                                    value={formatCurrencyKRW(blindBid.totalSales)}
                                />
                                <StatBlock
                                    label='오늘 낙찰'
                                    value={formatNumber(blindBid.todayConfirmedCount)}
                                />
                                <StatBlock
                                    label='오늘 매출'
                                    value={formatCurrencyKRW(blindBid.todaySales)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardOverviewWidget;
