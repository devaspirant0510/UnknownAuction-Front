import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { MainLayout } from '@shared/layout';
import { axiosClient, getServerURL } from '@shared/lib';
import DMStompClient from '@/pages/dm/DMStompClient.tsx';
import DMChatHeader from '@/pages/dm/DMChatHeader.tsx';
import DMChatBody from '@/pages/dm/DMChatBody.tsx';
import DMChatInput from '@/pages/dm/DMChatInput.tsx';
import DMRoomList from '@/pages/dm/DMRoomList.tsx';
import { useAuthUser } from '@shared/hooks/useAuthUser.tsx';
import DMNotificationSubscriber from '@/pages/dm/DMNotificationSubscriber.tsx'; // ✅ 1. 알림 구독기 임포트

type DMRoom = {
    roomId: number;
    roomName: string;
    participantId: number;
    participantNickname: string;
    lastMessage: string;
    lastMessageTime: string;
};

const DMPage = () => {
    const [rooms, setRooms] = useState<DMRoom[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [selectedParticipantId, setSelectedParticipantId] = useState<number | null>(null);
    const [isLoadingRooms, setIsLoadingRooms] = useState(true);
    const [nickname, userId] = useAuthUser();
    const navigate = useNavigate();

    useEffect(() => {
        const loadRooms = async () => {
            try {
                setIsLoadingRooms(true);
                const response = await axiosClient.get(`${getServerURL()}/api/dm/rooms`);
                if (response.data && response.data.length > 0) {
                    const sortedRooms = response.data.sort(
                        (a, b) =>
                            new Date(b.lastMessageTime).getTime() -
                            new Date(a.lastMessageTime).getTime(),
                    );
                    setRooms(sortedRooms);
                    // 최초 로딩 시에만 채팅방 선택
                    if (!selectedRoomId) {
                        setSelectedRoomId(sortedRooms[0].roomId);
                        setSelectedParticipantId(sortedRooms[0].participantId);
                    }
                }
            } catch (error) {
                console.error('채팅방 목록 로딩 실패:', error);
                if (error instanceof Error && error.message.includes('401')) {
                    navigate('/login');
                }
            } finally {
                setIsLoadingRooms(false);
            }
        };

        if (userId) {
            loadRooms();
        }
    }, [userId, navigate]);

    const refreshRooms = useCallback(async () => {
        try {
            const response = await axiosClient.get(`${getServerURL()}/api/dm/rooms`);
            if (response.data) {
                setRooms(response.data);
            }
        } catch (error) {
            console.error('채팅방 목록 갱신 실패:', error);
        }
    }, []);

    const handleMessageSent = useCallback(() => {
        refreshRooms();
    }, [refreshRooms]);

    const handleSelectRoom = (roomId: number, participantId: number) => {
        setSelectedRoomId(roomId);
        setSelectedParticipantId(participantId);
    };

    // ✅ 2. 알림 수신 시 호출될 콜백
    const handleNotification = useCallback(() => {
        console.log('🔔 새 메시지 알림 수신! 목록을 갱신합니다.');
        refreshRooms();
    }, [refreshRooms]);

    return (
        <MainLayout>
            {/* ✅ 3. 알림 구독기 렌더링 (UI는 없음) */}
            {userId && (
                <DMNotificationSubscriber
                    userId={userId as number}
                    onNotification={handleNotification}
                />
            )}

            <div className='flex gap-6 h-[90vh] bg-transparent p-4'>
                {/* 왼쪽: 채팅방 목록 */}
                <div className='rounded-2xl bg-white shadow-lg overflow-hidden'>
                    <DMRoomList
                        rooms={rooms}
                        selectedRoomId={selectedRoomId}
                        isLoading={isLoadingRooms}
                        onSelectRoom={handleSelectRoom}
                    />
                </div>

                {/* 오른쪽: 채팅 화면 */}
                {selectedRoomId && selectedParticipantId ? (
                    <div className='flex-1 flex flex-col rounded-2xl bg-white shadow-lg overflow-hidden'>
                        <DMChatHeader
                            roomId={selectedRoomId}
                            participantId={selectedParticipantId}
                        />

                        <DMStompClient roomId={selectedRoomId}>
                            {(client, roomId) => (
                                <>
                                    <DMChatBody
                                        client={client}
                                        roomId={roomId}
                                        userId={userId as number}
                                        onMessageReceived={handleMessageSent}
                                        onMessagesRead={refreshRooms}
                                    />
                                    <DMChatInput
                                        client={client}
                                        roomId={roomId}
                                        senderId={userId as number}
                                        receiverId={selectedParticipantId}
                                        onMessageSent={handleMessageSent}
                                    />
                                </>
                            )}
                        </DMStompClient>
                    </div>
                ) : (
                    <div className='flex-1 flex items-center justify-center rounded-2xl bg-white shadow-lg'>
                        <p className='text-gray-400'>채팅방을 선택하세요</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default DMPage;
