import { AccessTokenPayload } from '@shared/lib/jwtUtils.ts';
import { useAuthStore } from '@shared/store/AuthStore.ts';

// 튜플 타입 정의
type UseAuthUserResult = [null, null, null] | [string, number, AccessTokenPayload];

export const useAuthUser = (): UseAuthUserResult => {
    const { userAuth } = useAuthStore();

    if (userAuth == null) {
        return [null, null, null];
    }
    return [userAuth.nickname, userAuth.id, userAuth];
};
