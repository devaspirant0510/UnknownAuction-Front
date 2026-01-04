import type React from 'react';
import type { AdminUserStatus } from '@/entities/admin/user';

const STATUSES: Array<{ label: string; value?: AdminUserStatus }> = [
    { label: '전체', value: undefined },
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'DELETED', value: 'DELETED' },
    { label: 'BANNED', value: 'BANNED' },
    { label: 'PERM_BAN', value: 'PERM_BAN' },
    { label: 'UN_LINK', value: 'UN_LINK' },
];

type Props = {
    status?: AdminUserStatus;
    onChangeStatus: (next?: AdminUserStatus) => void;
    searchKeyword: string;
    onChangeSearchKeyword: (value: string) => void;
};

const AdminUserFilterBar: React.FC<Props> = ({
    status,
    onChangeStatus,
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

                <div className='flex items-center gap-2'>
                    <input
                        className='w-72 max-w-full border border-gray-200 rounded px-3 py-2 text-sm'
                        placeholder='유저 이름(닉네임) 검색 (UI만)'
                        value={searchKeyword}
                        onChange={(e) => onChangeSearchKeyword(e.target.value)}
                    />
                    <button
                        type='button'
                        className='px-3 py-2 rounded bg-gray-100 text-sm border border-gray-200'
                        onClick={() => {
                            // search는 아직 API 스펙이 없으므로 UI만 제공
                            // 추후 검색 파라미터가 생기면 feature 컨테이너에서 queryKey에 반영하면 됩니다.
                        }}
                    >
                        검색
                    </button>
                </div>
            </div>
            <div className='text-xs text-gray-500'>
                * 상태 필터는 API(status 파라미터)로 조회됩니다. 닉네임 검색은 현재 UI만 구성되어
                있습니다.
            </div>
        </div>
    );
};

export default AdminUserFilterBar;
