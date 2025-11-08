import React, { FC } from 'react';

type Props = {
    data: string;
    className?: string;
};
const USperator: FC<Props> = ({ data, className }) => {
    return (
        <div className={'flex items-center py-4 ' + className}>
            <div className='flex-grow border-t border-uprimary border-2'></div>
            <span className='px-4 text-uprimary text-xl'>{data}</span>
            <div className='flex-grow border-t border-uprimary border-2'></div>
        </div>
    );
};

export default USperator;
