// filepath: /Users/kotlinandnode/seungho/capstone/FlashBid-Front/src/widgets/user/UserPointFilterBar.tsx
import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Search } from 'lucide-react';

type Props = {
    searchTerm: string;
    onSearchTermChange: (value: string) => void;
    selectedFilter: string;
    onFilterChange: (value: string) => void;
};

const UserPointFilterBar: React.FC<Props> = ({
    searchTerm,
    onSearchTermChange,
    selectedFilter,
    onFilterChange,
}) => {
    return (
        <Card>
            <CardContent className='pt-6'>
                <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
                    <div className='relative flex-1 max-w-md'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                        <Input
                            placeholder='내역 검색...'
                            value={searchTerm}
                            onChange={(e) => onSearchTermChange(e.target.value)}
                            className='pl-10'
                        />
                    </div>

                    <Tabs value={selectedFilter} onValueChange={onFilterChange}>
                        <TabsList>
                            <TabsTrigger value='all'>전체</TabsTrigger>
                            <TabsTrigger value='CHARGE'>충전</TabsTrigger>
                            <TabsTrigger value='GIFT'>선물</TabsTrigger>
                            <TabsTrigger value='PURCHASE'>사용</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserPointFilterBar;
