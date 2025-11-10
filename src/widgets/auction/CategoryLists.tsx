import AuctionCategory from '@/features/auction/ui/AuctionCategory.tsx';
import React, { FC } from 'react';

type Props = {
    type: 'blind' | 'live';
};
const CategoryLists: FC<Props> = ({ type }) => {
    if (type === 'live') {
        return (
            <div className={'bg-[#F0F1F5] w-full pb-4'}>
                <div
                    className={
                        'flex flex-col w-full items-center rounded-b-[70px] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.1)] '
                    }
                >
                    <div className={'text-[#ED6C37] text-2xl font-bold  mt-8'}>실시간 경매</div>
                    <div className={'text-[#FFBB9F] text-sm'}>
                        생동감 넘치는 실시간 채팅을 통해 경매 참가자들 속에서 상품을 낙찰받을 수
                        있어요!
                    </div>
                    <div className='flex items-center gap-2 my-4 w-full'>
                        <div className='flex-grow h-px bg-[#CC7451]' />
                        <span className='text-sm text-[#CC7451] whitespace-nowrap'>카테고리</span>
                        <div className='flex-grow h-px bg-[#CC7451]' />
                    </div>
                    <AuctionCategory type={type} />
                </div>
            </div>
        );
    } else {
        return (
            <div className={'w-full bg-[#F0F1F5] pb-4'}>
                <div
                    className={
                        'flex flex-col w-full items-center rounded-b-[70px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] bg-udark'
                    }
                >
                    <div className={'text-[#ED6C37] text-2xl font-bold  mt-8'}>블라인드 경매</div>
                    <div className={'text-[#FFBB9F] text-sm'}>
                        긴장감이 넘치는 채팅 속에서 경매 참가들의 심리를 파악해 상품을 낙찰받아
                        가세요!
                    </div>
                    <div className='flex items-center gap-2 my-4 w-full'>
                        <div className='flex-grow h-px bg-[#CC7451]' />
                        <span className='text-sm text-[#CC7451] whitespace-nowrap'>카테고리</span>
                        <div className='flex-grow h-px bg-[#CC7451]' />
                    </div>
                    <AuctionCategory type={type} />
                </div>
            </div>
        );
    }
};
export default CategoryLists;
