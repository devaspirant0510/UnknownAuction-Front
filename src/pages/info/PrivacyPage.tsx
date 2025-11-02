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

const PrivacyPage = () => {
    return (
        <div className='bg-ubackground1 min-h-screen'>
            <div className='bg-gradient-to-r from-usecondary to-uprimary text-white text-center text-sm font-semibold py-3 rounded-md shadow-md mb-4 animate-fade-in'>
                <span className='font-bold text-white'>⚠️ [주의]</span> 이 문서는 법적 효력이 없는
                임시 템플릿입니다. 실제 서비스 시 법률 전문가의 검토가 필요합니다.
            </div>

            <div className='py-4 px-4'>
                <div className='container mx-auto max-w-4xl bg-white p-8 md:p-12 shadow-xl rounded-lg'>
                    <h1 className='text-4xl font-extrabold text-uprimary mb-8 text-center'>
                        Unknown Auction 개인정보처리방침
                    </h1>

                    <p className='text-sm text-gray-600 mb-6'>
                        Unknown Auction(이하 '회사')은 '개인정보 보호법' 등 관련 법령상의
                        개인정보보호 규정을 준수하며, 귀하의 개인정보가 보호받을 수 있도록 최선을
                        다하고 있습니다.
                    </p>

                    <Article title='제1조 (수집하는 개인정보의 항목)'>
                        <p>회사는 서비스 제공을 위해 다음과 같은 최소한의 개인정보를 수집합니다.</p>
                        <p>1. 회원가입 시: 아이디(이메일 주소), 비밀번호, 닉네임</p>
                        <p>
                            2. 경매 및 거래 이용 시: 경매 등록 정보, 입찰 내역, 실시간 채팅 내용,
                            낙찰 후 1:1 DM 내용, 거래 및 정산 내역
                        </p>
                        <p>
                            3. 서비스 이용 과정에서 자동 생성 정보: IP 주소, 쿠키, 서비스 이용 기록,
                            기기 정보
                        </p>
                    </Article>

                    <Article title='제2조 (개인정보의 수집 및 이용 목적)'>
                        <p>회사는 수집한 개인정보를 다음의 목적으로 활용합니다.</p>
                        <p>
                            1. 회원 관리: 회원제 서비스 이용에 따른 본인 식별, 불량회원의 부정 이용
                            방지, 가입 의사 확인 등
                        </p>
                        <p>
                            2. 서비스 제공: 실시간 경매, 블라인드 경매, 채팅, 거래 중개, 시세 분석
                            등 서비스 제공
                        </p>
                        <p>
                            3. 분쟁 해결 및 민원 처리: 회원 간 분쟁 조정 지원, 민원 사항 확인 및
                            처리
                        </p>
                    </Article>

                    <Article title='제3조 (개인정보의 보유 및 이용기간)'>
                        <p>
                            1. 회사는 원칙적으로 회원이 회원 탈퇴를 요청하거나 개인정보 수집 및
                            이용에 대한 동의를 철회하는 경우, 또는 수집 및 이용 목적이 달성된
                            경우에는 해당 개인정보를 지체 없이 파기합니다.
                        </p>
                        <p>
                            2. 단, 관련 법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 일정
                            기간 동안 회원정보를 보관합니다. (예: 계약 또는 청약철회 등에 관한 기록:
                            5년, 대금결제 및 재화 등의 공급에 관한 기록: 5년, 소비자의 불만 또는
                            분쟁처리에 관한 기록: 3년)
                        </p>
                    </Article>

                    <Article title='제4조 (개인정보의 파기)'>
                        <p>
                            회사는 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체 없이 해당
                            개인정보를 파기합니다. 파기 절차 및 방법은 다음과 같습니다.
                        </p>
                        <p>
                            1. 파기절차: (예시) 회원이 입력한 정보는 목적 달성 후 별도의 DB로 옮겨져
                            내부 방침 및 관련 법령에 따라 일정 기간 저장된 후 파기됩니다.
                        </p>
                        <p>
                            2. 파기방법: 전자적 파일 형태의 정보는 복구 불가능한 기술적 방법을
                            사용하여 삭제하며, 종이 문서는 분쇄기로 분쇄하거나 소각하여 파기합니다.
                        </p>
                    </Article>

                    <Article title='제5조 (정보주체의 권리·의무)'>
                        <p>
                            1. 회원은 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수
                            있으며, 회원탈퇴를 요청할 수 있습니다.
                        </p>
                        <p>
                            2. 회원이 개인정보의 오류에 대한 정정을 요청한 경우에는 정정을 완료하기
                            전까지 당해 개인정보를 이용 또는 제공하지 않습니다.
                        </p>
                    </Article>

                    <Article title='제6조 (개인정보의 안전성 확보 조치)'>
                        <p>
                            회사는 회원의 개인정보를 처리함에 있어 개인정보가 분실, 도난, 유출, 변조
                            또는 훼손되지 않도록 안전성 확보를 위해 기술적·관리적 대책을 강구하고
                            있습니다.
                        </p>
                        <p>1. 관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</p>
                        <p>
                            2. 기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템
                            설치, 고유식별정보 암호화, 보안프로그램 설치
                        </p>
                    </Article>

                    <Article title='제7조 (개인정보 보호책임자)'>
                        <p>
                            회사는 회원의 개인정보를 보호하고 불만을 처리하기 위해 개인정보
                            보호책임자를 지정하고 있습니다.
                        </p>
                        <p>- 개인정보 보호책임자: (담당자 이름)</p>
                        <p>- 이메일: (예: privacy@unknown-auction.com)</p>
                        <p>- 전화번호: (예: 02-1234-5678)</p>
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

export default PrivacyPage;
