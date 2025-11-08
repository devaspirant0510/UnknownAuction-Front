import { User } from '@entities/user/model';

export type ChargeType = 'CHARGE' | 'GIFT' | 'PURCHASE';
export type PointHistory = {
    createdAt: string | null;
    id: number;
    earnedPoint: number;
    chargeType: ChargeType;
    contents: string;
    earnType: 'EARN' | 'USE';
    userId: User;
};
