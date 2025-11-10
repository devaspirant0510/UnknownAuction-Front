import React, { FC } from 'react';
import { AuctionParticipateUser } from '@entities/auction/model';
import { Divider, ProfileImage } from '@shared/ui';
import { Button } from '@shared/components/ui/button.tsx';

type Props = {
    data: AuctionParticipateUser;
};

const ParticipantsUserItem: FC<Props> = ({ data }) => {
    return (
        <div>
            <div className={'flex items-center justify-between'}>
                <div className={'flex items-center '}>
                    <ProfileImage size={50} src={data.profileUrl} />
                    <div className={'ml-2'}>{data.nickname}</div>
                </div>
                <Button>팔로우</Button>
            </div>
            <Divider />
        </div>
    );
};

export default ParticipantsUserItem;
