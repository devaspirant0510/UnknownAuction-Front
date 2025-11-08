import axios from 'axios';
import { useAuthStore } from '@shared/store/AuthStore.ts';
import { getServerURL } from '@shared/lib/config.ts';

export const axiosClient = axios.create({
    baseURL: `${getServerURL()}/`,
    withCredentials: true, // 리프레시 토큰은 쿠키로 전송
});

axiosClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 + 아직 재시도 안 했을 때만
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 루프 방지!

            try {
                console.log(originalRequest.url);
                if (originalRequest?.url?.includes('auth/token')) {
                    return Promise.reject(error);
                }

                // refresh token으로 새 access token 발급
                const { data } = await axios.post(`${getServerURL()}/auth/token`, {}, {
                    withCredentials: true,
                } as any);

                const newAccessToken = data.data;

                useAuthStore.getState().setAccessToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                console.error('리프레시 토큰도 만료됨 👉 로그인 페이지로 이동!');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);
