import React, { FC, useCallback } from 'react';
import { Input } from '@shared/components/ui/input.tsx';
import { Client } from 'stompjs';
import useInput from '@shared/hooks/useInput.ts';
import { Button } from '@shared/components/ui/button.tsx';
import { Account } from '@entities/user/model';
import { ImageIcon, MessageSquareTextIcon, SendIcon, SmileIcon } from 'lucide-react';

type Props = {
    client: Client;
    auctionId: number;
    account: Account;
};
const AuctionChatInput: FC<Props> = ({ client, auctionId, account }) => {
    const [message, onChangeMessage, setMessage] = useInput({ initialValue: '' });
    const onClickSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (!message?.trim()) {
                return;
            }
            const data = {
                contents: message,
                nickname: account.nickname,
                profileUrl: account.profileUrl,
                userId: account.id,
            };
            console.log(client);
            if (client) {
                console.log(client);
                setMessage('');
                client.publish({
                    destination: '/app/chat/send/' + auctionId,
                    body: JSON.stringify(data),
                });
            }
        },
        [message, client],
    );
    return (
        <form>
            <div className={'p-3 border-1 rounded-xl mt-8 shadow-sm'}>
                <div className={'text-[#F7A17E] flex text-sm items-center gap-1 mb-1'}>
                    <MessageSquareTextIcon size={15} className={'text-[#F7A17E]'} />
                    채팅
                </div>
                <div className={'flex'}>
                    <Input
                        className={'border-none'}
                        value={message}
                        onChange={onChangeMessage}
                        placeholder={'채팅을 입력해주세요'}
                    />
                </div>
                <div className={'flex justify-between mt-2'}>
                    <div className={'flex mt-2 gap-1'}>
                        <ImageIcon size={18} className={'text-[#F7A17E]'} />
                        <SmileIcon size={18} className={'text-[#F7A17E]'} />
                    </div>
                    <Button type={'submit'} className={'bg-[#FFF2ED]'} onClick={onClickSubmit}>
                        <SendIcon className={'text-[#ED6C37]'} />
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default AuctionChatInput;
