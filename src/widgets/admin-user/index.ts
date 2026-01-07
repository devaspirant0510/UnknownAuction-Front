export { default as AdminUserFilterBar } from './ui/AdminUserFilterBar';
export { default as AdminUserListWidget } from './ui/AdminUserListWidget';
import type { ApiResult, Page } from '@/entities/common';

export type AdminUserStatus = 'ACTIVE' | 'DELETED' | 'BANNED' | 'PERM_BAN' | 'UN_LINK';

export type AdminUserListItem = {
    id: number;
    email: string;
    nickname: string;
    userStatus: AdminUserStatus;
    userType: string;
    loginType: string;
    deletedAt: string | null;
    verified: boolean;
    uuid: string;
    description: string | null;
    profileUrl: string | null;
    point: number;
};

export type AdminUserListResponse = ApiResult<Page<AdminUserListItem>>;
