import type React from 'react';
import type { AdminAuctionStatus } from '@/entities/admin/auction';

const STATUSES: Array<{ label: string; value?: AdminAuctionStatus }> = [
    { label: '전체', value: undefined },
    { label: 'BEFORE_START', value: 'BEFORE_START' },
    { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
    { label: 'ENDED', value: 'ENDED' },
];

type Props = {
    status?: AdminAuctionStatus;
    onChangeStatus: (next?: AdminAuctionStatus) => void;

    category?: string;
    categories: string[];
    onChangeCategory: (next?: string) => void;

    searchKeyword: string;
    onChangeSearchKeyword: (value: string) => void;
};

const AdminLiveAuctionFilterBar: React.FC<Props> = ({
    status,
    onChangeStatus,
    category,
    categories,
    onChangeCategory,
    searchKeyword,
    onChangeSearchKeyword,
}) => {
    return (
        <div className='bg-white rounded shadow p-4 space-y-3'>
            <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex flex-wrap gap-2'>
                    {STATUSES.map((s) => {
                        const active = s.value === status || (!s.value && !status);
                        return (
                            <button
                                key={s.label}
                                type='button'
                                className={`px-3 py-1.5 rounded border text-sm ${
                                    active
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'bg-white text-gray-800 border-gray-200'
                                }`}
                                onClick={() => onChangeStatus(s.value)}
                            >
                                {s.label}
                            </button>
                        );
                    })}
                </div>

                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                    <select
                        className='w-56 max-w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white'
                        value={category ?? ''}
                        onChange={(e) => onChangeCategory(e.target.value || undefined)}
                    >
                        <option value=''>전체 카테고리</option>
                        {categories.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>

                    <input
                        className='w-72 max-w-full border border-gray-200 rounded px-3 py-2 text-sm'
                        placeholder='판매자/상품명 검색 (UI만)'
                        value={searchKeyword}
                        onChange={(e) => onChangeSearchKeyword(e.target.value)}
                    />

                    <button
                        type='button'
                        className='px-3 py-2 rounded bg-gray-100 text-sm border border-gray-200'
                        onClick={() => {
                            // 검색은 아직 API 스펙이 없으므로 UI만 제공
                        }}
                    >
                        검색
                    </button>
                </div>
            </div>

            <div className='text-xs text-gray-500'>
                * status/category 필터는 API 쿼리 파라미터로 조회됩니다. 검색은 현재 UI만 구성되어
                있습니다.
            </div>
        </div>
    );
};

export default AdminLiveAuctionFilterBar;
