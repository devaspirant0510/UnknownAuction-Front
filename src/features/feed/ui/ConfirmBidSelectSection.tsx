import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
import { ArrowUpDownIcon } from 'lucide-react';
import type { ConfirmBidItem } from '@/entities/feed/model';
import { useQueryConfirmBidHistory } from '@/features/feed/lib/useQueryConfirmBidHistory';
import { ConfirmBidSelectList } from '@/widgets/feed/ConfirmBidSelectList';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selected: ConfirmBidItem | null;
    onSelect: (item: ConfirmBidItem | null) => void;
};

export const ConfirmBidSelectSection = ({ open, onOpenChange, selected, onSelect }: Props) => {
    const query = useQueryConfirmBidHistory(open);

    const handleSelect = (item: ConfirmBidItem) => {
        if (selected?.confirmBidId === item.confirmBidId) {
            onSelect(null);
        } else {
            onSelect(item);
        }
        onOpenChange(false);
    };

    return (
        <Collapsible open={open} onOpenChange={onOpenChange} className='w-full'>
            <CollapsibleTrigger asChild>
                <button
                    type='button'
                    className='inline-flex items-center gap-2 px-3 py-1 rounded-md text-uprimary hover:bg-uprimary/10 transition'
                >
                    <ArrowUpDownIcon className='w-5 h-5' />
                    <span className='font-medium text-sm'>거래내역</span>
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className='pt-2 animate-in slide-in-from-top-4'>
                <div className='border rounded-md p-3 shadow-sm bg-white'>
                    <h3 className='text-sm font-semibold mb-3'>자랑할 거래내역 선택</h3>

                    {query.isError ? (
                        <div className='py-6 text-center text-sm text-red-500'>
                            거래내역을 불러오지 못했어요.
                        </div>
                    ) : (
                        <ConfirmBidSelectList
                            items={query.data?.data ?? []}
                            selectedConfirmBidId={selected?.confirmBidId}
                            onSelect={handleSelect}
                            isLoading={query.isLoading}
                        />
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};
