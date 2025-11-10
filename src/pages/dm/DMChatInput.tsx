import React, { useState } from 'react';

type Props = {
    client: any;
    roomId: number;
    senderId: number;
    receiverId: number;
    onMessageSent?: () => void;
};

const DMChatInput: React.FC<Props> = ({ client, roomId, senderId, receiverId, onMessageSent }) => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (e?: React.MouseEvent | React.KeyboardEvent) => {
        // ✅ 폼 제출 방지 (페이지 새로고침 방지)
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!message.trim()) {
            return;
        }

        if (!client || !client.connected) {
            console.warn('⚠️ STOMP client is not connected');
            return;
        }

        const dto = {
            roomId,
            senderId,
            receiverId,
            contents: message,
            dmType: 'MESSAGE',
        };

        try {
            setIsLoading(true);
            console.log('📤 메시지 전송:', dto);

            // STOMP으로 메시지 전송
            client.publish({
                destination: `/app/dm.send/${roomId}`,
                body: JSON.stringify(dto),
            });

            setMessage('');
            console.log('✅ 메시지 전송 완료');

            // 200ms 후 채팅방 목록 갱신 (서버 처리 시간 고려)
            setTimeout(() => {
                if (onMessageSent) {
                    console.log('🔄 채팅방 목록 갱신');
                    onMessageSent();
                }
            }, 200);
        } catch (error) {
            console.error('❌ 메시지 전송 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSend(e);
        }
    };

    return (
        <div className='flex items-center gap-2 p-4 border-t border-gray-200 bg-white'>
            <input
                className='flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-orange-400'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='메시지를 입력하세요...'
                disabled={isLoading}
                type='text'
            />
            <button
                type='button'
                className='bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50'
                onClick={(e) => handleSend(e)}
                disabled={isLoading || !message.trim()}
            >
                전송
            </button>
        </div>
    );
};

export default DMChatInput;
