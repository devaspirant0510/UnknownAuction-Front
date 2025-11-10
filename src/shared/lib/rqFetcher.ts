import { QueryFunctionContext } from '@tanstack/react-query';
import { axiosClient } from '@shared/lib/axiosClient.ts';
import { ApiException } from '@shared/lib/ApiException.ts';

export const httpFetcher = async <T>(queryContext: QueryFunctionContext): Promise<T> => {
    try {
        const keys = queryContext.queryKey.join('/');
        const result = await axiosClient.get<T>(`${keys}`);
        return result.data as T;
    } catch (e: AxiosError) {
        throw new ApiException(e?.response?.data?.error);
    }
};

export function pageSegmentBuilder(segment: string, page: number, size: number = 10) {
    return `${segment}?size=${size}&page=${page}`;
}
