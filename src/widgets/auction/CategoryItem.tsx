import React, { FC } from 'react';

type Props = {
    value: string;
    active: boolean;
    type: 'blind' | 'live';
};
const CategoryItem: FC<Props> = ({ value, active, type }) => {
    return (
        <div
            className={`flex items-center justify-center text-center border rounded-full py-3 px-5 text-xl text-black ${active ? (type === 'live' ? 'bg-white text-black' : 'bg-[#828282] text-[#e6e6e6]') : type === 'live' ? 'border-none bg-[#F3F4F6]' : 'border-none bg-[#D5D5D6]'}`}
        >
            {value}
        </div>
    );
};
export default CategoryItem;
