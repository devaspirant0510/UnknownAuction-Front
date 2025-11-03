import React, { useState } from 'react';
import FetchMyPointHistory from '@/features/profile/ui/FetchMyPointHistory.tsx';
import { MainLayout } from '@shared/layout';
import {
    UserPointHeader,
    UserPointSummaryCards,
    UserPointFilterBar,
    UserPointTable,
    UserPointCountFooter,
} from '@/widgets/user';
import { Gift, CreditCard, ShoppingCart, Coins } from 'lucide-react';
import {AppLayout} from "@/shared/layout";

const PointPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    const getChargeTypeInfo = (chargeType: string) => {
        switch (chargeType) {
            case 'CHARGE':
                return {
                    label: '충전',
                    icon: <CreditCard className='w-3 h-3' />,
                    className: 'bg-blue-500 hover:bg-blue-600',
                    textColor: 'text-blue-600',
                };
            case 'GIFT':
                return {
                    label: '판매',
                    icon: <Gift className='w-3 h-3' />,
                    className: 'bg-purple-500 hover:bg-purple-600',
                    textColor: 'text-purple-600',
                };
            case 'PURCHASE':
                return {
                    label: '사용',
                    icon: <ShoppingCart className='w-3 h-3' />,
                    className: 'bg-gray-500 hover:bg-gray-600',
                    textColor: 'text-gray-600',
                };
            default:
                return {
                    label: '환불',
                    icon: <Coins className='w-3 h-3' />,
                    className: 'bg-gray-400 hover:bg-gray-500',
                    textColor: 'text-gray-500',
                };
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return '오늘';
        if (diffDays === 1) return '어제';
        if (diffDays < 7) return `${diffDays}일 전`;

        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const filterData = (data: any[]) => {
        let filtered = data;

        if (selectedFilter !== 'all') {
            filtered = filtered.filter((item) => item.chargeType === selectedFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter((item) =>
                item.contents.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        return filtered;
    };

    const calculateSummary = (data: any[]) => {
        const totalEarned = data
            .filter((item) => item.chargeType === 'CHARGE' || item.chargeType === 'GIFT')
            .reduce((sum, item) => sum + item.earnedPoint, 0);

        const totalSpent = data
            .filter((item) => item.chargeType === 'PURCHASE' || item.chargeType === 'REFUND')
            .reduce((sum, item) => sum + item.earnedPoint, 0);

        return { totalEarned, totalSpent };
    };

    return (
        <AppLayout>
            <FetchMyPointHistory>
                {(data) => {
                    const { totalEarned, totalSpent } = calculateSummary(data);
                    const filteredData = filterData(data);

                    return (
                        <div className='w-full p-6 space-y-6'>
                            <UserPointHeader />

                            <UserPointSummaryCards
                                totalEarned={totalEarned}
                                totalSpent={totalSpent}
                            />

                            <UserPointFilterBar
                                searchTerm={searchTerm}
                                onSearchTermChange={setSearchTerm}
                                selectedFilter={selectedFilter}
                                onFilterChange={setSelectedFilter}
                            />

                            <UserPointTable
                                rows={filteredData}
                                totalCount={data.length}
                                formatDate={formatDate}
                                getChargeTypeInfo={getChargeTypeInfo}
                            />

                            <UserPointCountFooter
                                total={data.length}
                                visible={filteredData.length}
                            />
                        </div>
                    );
                }}
            </FetchMyPointHistory>
        </AppLayout>
    );
};

export default PointPage;
