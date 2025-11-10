import React, { FC, useEffect, useRef, useState } from 'react';
import { Client } from 'stompjs';
import * as StompJs from '@stomp/stompjs';
import { IFrame } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { ChatEntity } from '@entities/auction/model';
import { useAuthStore } from '@shared/store/AuthStore.ts';

type Props = {
    children: (client: Client, auctionId: number) => React.ReactNode;
    auctionId: number;
};
const StompClient: FC<Props> = ({ auctionId, children }) => {
    const queryClient = useQueryClient();
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState('');
    const stompClient = useRef(null);
    const clientRef = useRef<any>(null);
    const [client, setClient] = useState<any>(null);
    const { accessToken } = useAuthStore();
    // TODO : 종료된 경매 접속 막기

    useEffect(() => {
        const clientdata = new StompJs.Client({
            webSocketFactory: () =>
                new WebSocket(
                    `${import.meta.env.VITE_MODE == 'development' ? 'ws' : 'wss'}://${import.meta.env.VITE_MODE == 'development' ? '127.0.0.1:8080' : import.meta.env.VITE_SERVER_URL}/ws`,
                ),
            onStompError: (i) => {
                console.log(i);
            },
            onWebSocketError: (e) => {
                console.log(e);
            },
            connectHeaders: {
                Authorization: 'Bearer ' + accessToken,
            },
            debug: function (str) {
                // console.log(str);
            },
            reconnectDelay: 5000, // 자동 재 연결
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: function (frame: IFrame) {
                console.log(frame);
                clientdata.subscribe('/topic/public/' + auctionId, async (data) => {
                    const chatEntity = JSON.parse(data.body) as ChatEntity;
                    console.log('chatenti');
                    console.log(chatEntity);
                    await queryClient.refetchQueries({
                        queryKey: ['api', 'v1', 'auction', Number(auctionId)],
                    });
                    if (!chatEntity.biddingLog) {
                        // queryClient.setQueryData(
                        //     ['api', 'v1', 'auction', Number(auctionId)],
                        //     (prev) => {
                        //         console.log('preev');
                        //         console.log(prev);
                        //         return {
                        //             ...prev,
                        //             data: {
                        //                 ...prev?.data,
                        //                 lastBiddingLog: chatEntity.biddingLog,
                        //             },
                        //         };
                        //     },
                        // );
                    }
                    queryClient.setQueryData(
                        ['api', 'v2', 'auction', 'chat', Number(auctionId)],
                        (prev) => {
                            return {
                                ...prev,
                                data: [...prev.data, JSON.parse(data.body)],
                            };
                        },
                    );
                });

                clientRef.current = clientdata;
                setClient(clientdata); // 연결 완료 시 상태에 저장
            },
        });
        clientdata.activate();
        clientRef.current = clientdata;
        return () => {
            clientdata.deactivate().then((r) => {
                console.log('소켓 연결 해제');
            });
        };
    }, [auctionId, accessToken]);

    if (!client) {
        return null;
    }
    return <>{children(client, auctionId)}</>;
};

export default StompClient;
