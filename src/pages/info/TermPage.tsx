import React from 'react';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className='text-2xl font-bold text-udark mt-8 mb-4 border-b pb-2'>{children}</h2>
);

const Article: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className='mb-6'>
        <h3 className='text-xl font-semibold text-gray-800 mb-2'>{title}</h3>
        <div className='space-y-2 text-gray-700 leading-relaxed'>{children}</div>
    </div>
);

const TermPage = () => {
    return (
        <div className='bg-ubackground1 min-h-screen py-4 px-4'>
            <div className='bg-gradient-to-r from-usecondary to-uprimary text-white text-center text-sm font-semibold py-3 rounded-md shadow-md mb-4 animate-fade-in'>
                <span className='font-bold text-white'>⚠️ 경고</span> — 이 문서는 법적 효력이 없는
                임시 템플릿입니다.
            </div>

            <div className='container mx-auto max-w-4xl bg-white mt-4 p-8 md:p-12 shadow-xl rounded-lg'>
                <h1 className='text-4xl font-extrabold text-uprimary mb-8 text-center'>
                    Unknown Auction 이용약관
                </h1>

                <p className='text-sm text-gray-600 mb-6'>
                    'Unknown Auction' 서비스에 오신 것을 환영합니다! 본 약관은 여러분이 서비스를
                    이용하는 데 필요한 권리, 의무 및 기타 제반 사항을 규정하고 있습니다.
                </p>

                <SectionTitle>제1장 총칙</SectionTitle>

                <Article title='제1조 (목적)'>
                    <p>
                        이 약관은 Unknown Auction (이하 '회사')이 제공하는 실시간/블라인드 경매 기반
                        중고거래 플랫폼 및 관련 제반 서비스(이하 '서비스')의 이용과 관련하여 회사와
                        회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                    </p>
                </Article>

                <Article title='제2조 (용어의 정의)'>
                    <p>
                        1. '서비스'라 함은 '회사'가 'Unknown Auction' 웹사이트 및 모바일
                        애플리케이션을 통해 제공하는 경매 기반 중고거래 중개 서비스 일체를
                        의미합니다.
                    </p>
                    <p>
                        2. '회원'이라 함은 본 약관에 동의하고 '회사'와 서비스 이용계약을 체결하여
                        '회사'가 제공하는 '서비스'를 이용하는 고객을 의미합니다.
                    </p>
                    <p>3. '판매자': 경매에 물품을 등록하는 회원.</p>
                    <p>4. '입찰자': 경매 물품에 입찰하는 회원.</p>
                    <p>5. '낙찰자': 경매에서 최종적으로 물품을 구매하게 된 회원.</p>
                </Article>

                <Article title='제3조 (약관의 명시와 개정)'>
                    <p>
                        1. '회사'는 이 약관의 내용을 '회원'이 쉽게 알 수 있도록 '서비스' 초기 화면
                        또는 연결 화면에 게시합니다.
                    </p>
                    <p>
                        2. '회사'는 '약관의 규제에 관한 법률', '정보통신망 이용촉진 및 정보보호 등에
                        관한 법률' 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
                    </p>
                    <p>
                        3. '회사'가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여
                        현행약관과 함께 제1항의 방식에 따라 그 적용일자 7일 이전부터 적용일자
                        전일까지 공지합니다. 다만, '회원'에게 불리하게 약관내용을 변경하는 경우에는
                        최소한 30일 이상의 사전 유예기간을 두고 공지합니다.
                    </p>
                    <p>
                        4. '회원'이 개정약관에 동의하지 않는 경우 '회원'은 이용계약을 해지할 수
                        있습니다. '회사'가 제3항에 따라 공지하였음에도 '회원'이 명시적으로
                        거부의사를 표명하지 않고 '서비스'를 계속 이용하는 경우에는 개정약관에 동의한
                        것으로 봅니다.
                    </p>
                </Article>

                <SectionTitle>제2장 서비스 이용</SectionTitle>

                <Article title='제4조 (서비스의 제공)'>
                    <p>회사는 회원에게 다음과 같은 서비스를 제공합니다:</p>
                    <ul className='list-disc list-inside ml-4 mt-2 space-y-1'>
                        <li>실시간 경매 서비스</li>
                        <li>블라인드 경매 서비스</li>
                        <li>경매 참여자 간 실시간 채팅 서비스</li>
                        <li>낙찰 후 1:1 DM을 통한 거래 중개 서비스</li>
                        <li>거래 내역 및 시세 분석 정보 제공 서비스</li>
                    </ul>
                </Article>

                <Article title='제5조 (회원의 의무)'>
                    <p>1. 회원은 허위 정보를 등록해서는 안 됩니다.</p>
                    <p>2. 회원은 불법적이거나 사기성 물품을 경매에 등록할 수 없습니다.</p>
                    <p>3. 회원은 경매 입찰을 조작하거나 방해하는 행위를 해서는 안 됩니다.</p>
                    <p>
                        4. 회원은 실시간 채팅 및 DM 사용 시 타인에게 불쾌감, 모욕감을 주거나
                        성희롱적인 발언을 해서는 안 됩니다.
                    </p>
                </Article>

                <Article title='제6조 (거래 및 낙찰)'>
                    <p>1. 실시간 경매는 가장 높은 금액을 제시한 입찰자에게 낙찰됩니다.</p>
                    <p>
                        2. 블라인드 경매는 입찰가가 비공개로 진행되며, 경매 종료 시점에 정해진
                        규칙에 따라 낙찰자가 선정됩니다.
                    </p>
                    <p>
                        3. 낙찰자는 정해진 기간 내에 판매자와 연락하여 거래를 완료할 의무가
                        있습니다.
                    </p>
                </Article>

                <SectionTitle>제3장 기타</SectionTitle>

                <Article title='제7조 (회사의 면책)'>
                    <p>
                        1. 회사는 회원 간의 중고거래를 중개하는 플랫폼을 제공할 뿐이며, 등록된
                        물품의 품질, 진위 여부, 안전성 등에 대해 보증하지 않습니다.
                    </p>
                    <p>
                        2. 회원 간의 거래에서 발생한 모든 분쟁과 손해에 대한 책임은 거래 당사자인
                        회원에게 있습니다.
                    </p>
                    <p>
                        3. 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는
                        경우에는 서비스 제공에 관한 책임이 면제됩니다.
                    </p>
                </Article>

                <Article title='제8조 (준거법 및 재판관할)'>
                    <p>1. 회사와 회원 간 제기된 소송은 대한민국 법을 준거법으로 합니다.</p>
                    <p>
                        2. '회사'와 '회원' 간 발생한 분쟁에 관한 소송은 민사소송법상의 관할법원에
                        제기함을 원칙으로 합니다.
                    </p>
                </Article>

                <div className='mt-12 pt-6 border-t'>
                    <p className='text-sm text-gray-600'>
                        <strong>공고일자:</strong> 2025년 11월 02일
                    </p>
                    <p className='text-sm text-gray-600'>
                        <strong>시행일자:</strong> 2025년 11월 02일
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
};

export default TermPage;
