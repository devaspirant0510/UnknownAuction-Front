import { Skeleton } from '@/shared/components/ui/skeleton';
import type { ConfirmBidItem } from '@/entities/feed/model';

type Props = {
    items: ConfirmBidItem[];
    selectedConfirmBidId?: number | null;
    onSelect: (item: ConfirmBidItem) => void;
    isLoading?: boolean;
};

export const ConfirmBidSelectList = ({
    items,
    onSelect,
    selectedConfirmBidId,
    isLoading,
}: Props) => {
    if (isLoading) {
        return (
            <div className='space-y-2'>
                <Skeleton className='h-16 w-full' />
                <Skeleton className='h-16 w-full' />
            </div>
        );
    }

    if (items.length === 0) {
        return <div className='py-6 text-center text-sm text-gray-500'>거래내역이 없습니다.</div>;
    }

    return (
        <div className='flex flex-col gap-2 max-h-44 overflow-auto'>
            {items.map((it) => (
                <div
                    key={it.confirmBidId}
                    onClick={() => onSelect(it)}
                    className={`flex items-center gap-3 p-2 border rounded-md cursor-pointer transition-colors ${
                        selectedConfirmBidId === it.confirmBidId
                            ? 'bg-blue-100 border-blue-300'
                            : 'hover:bg-gray-50'
                    }`}
                >
                    <div className='flex-1 min-w-0'>
                        <div
                            className={`text-sm ${
                                selectedConfirmBidId === it.confirmBidId
                                    ? 'font-semibold text-blue-900'
                                    : 'font-medium'
                            }`}
                        >
                            {it.auctionTitle}
                        </div>
                        <div className='text-xs text-gray-500'>[{it.auctionCategoryName}]</div>
                        <div className='text-xs text-gray-500'>
                            낙찰가 {it.bidConfirmedPrice.toLocaleString('ko-KR')}원
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
