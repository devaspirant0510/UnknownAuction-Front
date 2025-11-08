import React from 'react';

const WebFooter = () => {
    return (
        <footer className='mt-20 bg-[#444] text-white py-10 px-5'>
            {/* 웹에서는 콘텐츠가 너무 넓어지는 것을 방지하기 위해
              max-w-screen-xl mx-auto (최대 너비 및 중앙 정렬)를 추가하는 것이 일반적입니다.
            */}
            <div className='flex justify-between items-center flex-wrap max-w-screen-xl mx-auto'>
                <div className='leading-relaxed text-sm'>
                    <strong className='font-bold'>Unknown Auction</strong>
                    <br />
                    <a href='/company' className='text-white mr-2.5 no-underline hover:underline'>
                        회사소개
                    </a>
                    <a href='/terms' className='text-white mr-2.5 no-underline hover:underline'>
                        이용약관
                    </a>
                    <a href='/privacy' className='text-white no-underline hover:underline'>
                        개인정보처리방침
                    </a>
                    <br />
                    <br />
                    상품명 : (주)Unknown Auction
                    <br />
                    대표이사 : 이승호
                    <br />
                    Tel: 010-4111-5077 | Fax: 02-886-7064
                    <br />
                    사업자 등록번호 : 000-00-000000
                </div>
            </div>
        </footer>
    );
};

export default WebFooter;
