import React from 'react';

type Props = {
    page: number; // 0-based
    totalPages: number;
    onChangePage: (nextPage: number) => void;
};

const PAGE_GROUP_SIZE = 10;

const AdminPagination: React.FC<Props> = ({ page, totalPages, onChangePage }) => {
    const canPrev = page > 0;
    const canNext = page + 1 < totalPages;

    // 현재 페이지가 속한 그룹 (0, 1, 2, ...)
    const currentGroup = Math.floor(page / PAGE_GROUP_SIZE);

    const startPage = currentGroup * PAGE_GROUP_SIZE;
    const endPage = Math.min(startPage + PAGE_GROUP_SIZE, totalPages);

    const pageNumbers = Array.from({ length: endPage - startPage }, (_, i) => startPage + i);

    return (
        <div className='flex items-center justify-center gap-2'>
            <button
                type='button'
                className='px-3 py-2 rounded border text-sm disabled:opacity-50'
                disabled={!canPrev}
                onClick={() => onChangePage(page - 1)}
            >
                이전
            </button>

            {pageNumbers.map((p) => {
                const active = p === page;
                return (
                    <button
                        key={p}
                        type='button'
                        className={`w-10 h-10 rounded border text-sm ${
                            active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white'
                        }`}
                        onClick={() => onChangePage(p)}
                    >
                        {p + 1}
                    </button>
                );
            })}

            <button
                type='button'
                className='px-3 py-2 rounded border text-sm disabled:opacity-50'
                disabled={!canNext}
                onClick={() => onChangePage(page + 1)}
            >
                다음
            </button>
        </div>
    );
};

export default AdminPagination;
