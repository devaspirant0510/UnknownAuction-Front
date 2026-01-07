import type React from 'react';

type Props = {
    page: number; // backend page param 그대로 사용
    totalPages: number;
    onChangePage: (nextPage: number) => void;
};

const AdminPagination: React.FC<Props> = ({ page, totalPages, onChangePage }) => {
    const canPrev = page > 0;
    const canNext = page + 1 < totalPages;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i).slice(
        Math.max(0, page - 2),
        Math.min(totalPages, page + 3),
    );

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
