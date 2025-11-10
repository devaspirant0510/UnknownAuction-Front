import { useQuery } from '@tanstack/react-query';
import { httpFetcher } from '@shared/lib'; // [주의] rqFetcher.ts가 아닌 httpFetcher 가정
import { ApiResult } from '@entities/common';
import { FeedWrapper } from '@pages/feed/component/FeedList.tsx';

/**
 * [신규 훅] ID로 특정 유저의 피드 목록을 조회합니다.
 * API: GET /api/v1/profile/{id}/feed
 */
export const useQueryGetUserFeeds = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['api', 'v1', 'profile', userId, 'feed'],
        queryFn: httpFetcher<ApiResult<FeedWrapper[]>>,
        enabled: !!userId,
    });
};
