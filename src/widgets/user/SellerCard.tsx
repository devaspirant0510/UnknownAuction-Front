import React, { FC } from 'react';
import { AccountDto } from '@entities/user/model';
import { Badge } from '@shared/components/ui/badge.tsx';

type Props = {
    userDto: AccountDto;
};
const SellerCard: FC<Props> = ({ userDto }) => {
    const user = userDto.user;
    return (
        <>
            <Badge className={'bg-[var(--usecondary)] mb-2'}>판매자</Badge>
            <div className={'flex  items-center gap-4'}>
                <div>
                    <img
                        className={'rounded-full w-24 h-24'}
                        src={
                            import.meta.env.VITE_SERVER_URL +
                            (userDto.user.profileUrl
                                ? userDto.user.profileUrl
                                : '/uploads/default.jpg')
                        }
                    />
                </div>
                <div>
                    <span className={'font-bold text-lg'}>{user.nickname}</span>
                    <div>
                        입찰 {Math.ceil(Math.random() * 10) + 3} | 판매{' '}
                        {Math.ceil(Math.random() * 10) + 3} | 리뷰{' '}
                        {Math.ceil(Math.random() * 10) + 3}
                    </div>
                    <div>
                        팔로우 {Math.ceil(Math.random() * 10) + 3} | 팔로잉{' '}
                        {Math.ceil(Math.random() * 10) + 3}
                    </div>
                </div>
                <div>
                    <Badge className={'bg-[var(--usecondary)]'}>DM</Badge>
                </div>
            </div>
        </>
    );
};

export default SellerCard;
