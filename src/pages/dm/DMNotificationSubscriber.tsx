import { FC, useEffect, useRef } from 'react';
import * as StompJs from '@stomp/stompjs';
import { IFrame } from '@stomp/stompjs';
import { useAuthStore } from '@shared/store/AuthStore.ts';

type Props = {
    userId: number;
    onNotification: (message: any) => void;
};

const DMNotificationSubscriber: FC<Props> = ({ userId, onNotification }) => {
    const clientRef = useRef<StompJs.Client | null>(null);
    const { accessToken } = useAuthStore(); // ✅ 1. DMStompClient와 동일한 인증 방식

    useEffect(() => {
        if (!userId || !accessToken) {
            console.log('DMNotification: userId 또는 accessToken이 없습니다.');
            return;
        }

        // ✅ 2. DMStompClient와 "완전히 동일한" 연결 로직
        const stompClient = new StompJs.Client({
            webSocketFactory: () =>
                new WebSocket(
                    `${import.meta.env.VITE_MODE === 'development' ? 'ws' : 'wss'}://${
                        import.meta.env.VITE_MODE === 'development'
                            ? '127.0.0.1:8080'
                            : import.meta.env.VITE_SERVER_URL
                    }/ws`,
                ),
            // ✅ 3. DMStompClient와 "완전히 동일한" 헤더
            connectHeaders: {
                Authorization: 'Bearer ' + accessToken,
            },
            debug: (msg) => {
                // 알림용 로그는 간소화 (필요시 주석 해제)
                // console.log('[STOMP NOTIFICATION DEBUG]', msg);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: (frame: IFrame) => {
                console.log('✅ DM Notification STOMP Connected:', frame);
                clientRef.current = stompClient;

                // ✅ 4. 연결 성공 시 "개인 알림" 토픽 구독
                console.log(`🔔 DM 알림 구독 시작: /topic/user/${userId}/dm`);
                stompClient.subscribe(`/topic/user/${userId}/dm`, (message) => {
                    try {
                        const parsedMessage = JSON.parse(message.body);
                        onNotification(parsedMessage);
                    } catch (e) {
                        console.error('알림 메시지 파싱 실패', e);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('❌ STOMP Notification Error:', frame);
            },
            onWebSocketError: (error) => {
                console.error('❌ WebSocket Notification Error:', error);
            },
            onDisconnect: (frame) => {
                console.log('🔌 STOMP Notification Disconnected:', frame);
                clientRef.current = null;
            },
        });

        stompClient.activate();

        // 컴포넌트 언마운트 시 연결 해제
        return () => {
            if (stompClient.active) {
                stompClient.deactivate().then(() => {
                    console.log('📍 DM Notification STOMP 연결 해제 완료');
                });
            }
            clientRef.current = null;
        };
    }, [userId, accessToken, onNotification]); // userId나 accessToken이 바뀌면 재연결

    return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

export default DMNotificationSubscriber;
