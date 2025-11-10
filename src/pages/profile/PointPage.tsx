import React, { useState } from 'react';
import FetchMyPointHistory from '@/features/profile/ui/FetchMyPointHistory.tsx';
import {
    UserPointHeader,
    UserPointSummaryCards,
    UserPointTable,
    UserPointCountFooter,
} from '@/widgets/user';
import { AppLayout } from '@/shared/layout';

const PointPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

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

        // selectedFilter is 'all' or 'EARN' | 'USE'
        if (selectedFilter !== 'all') {
            filtered = filtered.filter((item) => item.earnType === selectedFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter((item) =>
                item.contents.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        return filtered;
    };

    const calculateSummary = (data: any[]) => {
        // totalEarned: sum of EARN entries
        const totalEarned = data
            .filter((item) => item.earnType === 'EARN')
            .reduce((sum, item) => sum + item.earnedPoint, 0);

        // totalSpent: sum of USE entries (present as positive numbers in API)
        const totalSpent = data
            .filter((item) => item.earnType === 'USE')
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

                            {/*<UserPointFilterBar*/}
                            {/*    searchTerm={searchTerm}*/}
                            {/*    onSearchTermChange={setSearchTerm}*/}
                            {/*    selectedFilter={selectedFilter}*/}
                            {/*    onFilterChange={setSelectedFilter}*/}
                            {/*/>*/}

                            <UserPointTable
                                rows={filteredData}
                                totalCount={data.length}
                                formatDate={formatDate}
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
