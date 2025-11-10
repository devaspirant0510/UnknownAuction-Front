import React, { FC, useEffect, useRef, useState } from 'react';
import * as StompJs from '@stomp/stompjs';
import { IFrame } from '@stomp/stompjs';
import { useAuthStore } from '@shared/store/AuthStore.ts';

type Props = {
    children: (client: StompJs.Client, roomId: number) => React.ReactNode;
    roomId: number;
};

const DMStompClient: FC<Props> = ({ roomId, children }) => {
    const clientRef = useRef<StompJs.Client | null>(null);
    const subscriptionRef = useRef<StompJs.StompSubscription | null>(null);
    const [client, setClient] = useState<StompJs.Client | null>(null);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        // 이미 연결된 클라이언트가 있으면 재사용
        if (clientRef.current?.connected) {
            setClient(clientRef.current);
            return;
        }

        const stompClient = new StompJs.Client({
            webSocketFactory: () =>
                new WebSocket(
                    `${import.meta.env.VITE_MODE === 'development' ? 'ws' : 'wss'}://${
                        import.meta.env.VITE_MODE === 'development'
                            ? '127.0.0.1:8080'
                            : import.meta.env.VITE_SERVER_URL
                    }/ws`,
                ),
            connectHeaders: {
                Authorization: 'Bearer ' + accessToken,
            },
            debug: (msg) => {
                console.log('[STOMP DEBUG]', msg);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: (frame: IFrame) => {
                console.log('✅ DM STOMP Connected:', frame);
                clientRef.current = stompClient;
                setClient(stompClient);
            },
            onStompError: (frame) => {
                console.error('❌ STOMP Error:', frame);
            },
            onWebSocketError: (error) => {
                console.error('❌ WebSocket Error:', error);
            },
            onDisconnect: (frame) => {
                console.log('🔌 STOMP Disconnected:', frame);
                clientRef.current = null;
            },
        });

        stompClient.activate();

        return () => {
            console.log('정리 중... roomId:', roomId);

            // 구독 해제
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
                console.log('구독 해제 완료');
            }

            // 연결 해제
            if (stompClient.connected) {
                stompClient.deactivate().then(() => {
                    console.log('📍 DM STOMP 연결 해제 완료');
                });
            }
        };
    }, [accessToken]);

    // roomId 변경 시 구독 업데이트
    useEffect(() => {
        if (!client || !client.connected) {
            console.log('클라이언트가 준비되지 않음');
            return;
        }

        console.log(`구독 시작: /topic/dm/${roomId}`);

        // 기존 구독 해제
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }

        // 새 구독 시작
        subscriptionRef.current = client.subscribe(`/topic/dm/${roomId}`, (msg) => {
            console.log('📨 STOMP 메시지 수신:', msg.body);
        });

        return () => {
            console.log(`구독 해제: /topic/dm/${roomId}`);
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
        };
    }, [client, roomId]);

    if (!client) {
        return <div>WebSocket 연결 중...</div>;
    }

    return <>{children(client, roomId)}</>;
};

export default DMStompClient;
