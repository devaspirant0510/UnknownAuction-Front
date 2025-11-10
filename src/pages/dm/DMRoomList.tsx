import React from 'react';

type DMRoom = {
    roomId: number;
    roomName: string;
    participantId: number;
    participantNickname: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number; // ✅ 추가
};

type Props = {
    rooms: DMRoom[];
    selectedRoomId: number | null;
    isLoading: boolean;
    onSelectRoom: (roomId: number, participantId: number) => void;
};

const DMRoomList: React.FC<Props> = ({ rooms, selectedRoomId, isLoading, onSelectRoom }) => {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
        } else if (diffDays === 1) {
            return '어제';
        } else if (diffDays < 7) {
            return `${diffDays}일 전`;
        } else {
            return date.toLocaleDateString('ko-KR');
        }
    };

    return (
        <div className='w-96 border-r border-gray-200 flex flex-col'>
            <div className='p-4 border-b border-gray-200'>
                <h2 className='text-xl font-bold text-gray-800'>메시지</h2>
            </div>

            <div className='flex-1 overflow-y-auto'>
                {isLoading ? (
                    <div className='flex items-center justify-center h-full'>
                        <p className='text-gray-500'>로딩 중...</p>
                    </div>
                ) : rooms.length === 0 ? (
                    <div className='flex items-center justify-center h-full'>
                        <p className='text-gray-400 text-center'>
                            아직 채팅방이 없습니다.
                            <br />
                            누군가와 대화를 시작하세요!
                        </p>
                    </div>
                ) : (
                    [...rooms]
                        .sort(
                            (a, b) =>
                                new Date(b.lastMessageTime).getTime() -
                                new Date(a.lastMessageTime).getTime(),
                        )
                        .map((room) => (
                            <div
                                key={room.roomId}
                                onClick={() => onSelectRoom(room.roomId, room.participantId)}
                                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                                    selectedRoomId === room.roomId
                                        ? 'bg-orange-50'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className='flex items-center justify-between'>
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='font-semibold text-gray-800 truncate'>
                                            {room.participantNickname}
                                        </h3>
                                        <p className='text-sm text-gray-500 truncate'>
                                            {room.lastMessage || '메시지 없음'}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-2 ml-2'>
                                        {/* ✅ 미읽음 뱃지 */}
                                        {room.unreadCount > 0 && (
                                            <span className='bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                                                {room.unreadCount > 99 ? '99+' : room.unreadCount}
                                            </span>
                                        )}
                                        <span className='text-xs text-gray-400 whitespace-nowrap'>
                                            {formatTime(room.lastMessageTime)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
};

export default DMRoomList;
