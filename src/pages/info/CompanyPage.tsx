import React, { useEffect, useRef, useState } from 'react';
import { Gavel, ShieldQuestion, MessagesSquare, BarChartHorizontal, Crown } from 'lucide-react';

const CompanyPage = () => {
    const [visibleSections, setVisibleSections] = useState(new Set());
    const sectionRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const observers = sectionRefs.current.map((ref, index) => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setVisibleSections((prev) => new Set(prev).add(index));
                        }
                    });
                },
                { threshold: 0.2 },
            );
            if (ref) observer.observe(ref);
            return observer;
        });
        return () => observers.forEach((observer) => observer.disconnect());
    }, []);

    const addToRefs = (el: HTMLDivElement | null) => {
        if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
    };

    const [selectedMember, setSelectedMember] = useState<string | null>(null);

    const leaderData = {
        name: '이승호',
        github: 'https://github.com/devaspirant0510',
        role: '팀장 / 풀스택',
    };
    const teamData = [
        { name: '김태현', github: 'https://github.com/mangosaet', role: '풀스택' },
        { name: '이동헌', github: 'https://github.com/adkslkagl', role: '백엔드' },
        { name: '이승엽', github: 'https://github.com/sylee0915', role: '백엔드' },
        { name: '오지원', github: 'https://github.com/oh-jiwon', role: 'UI/UX 디자인' },
        { name: '조주연', github: 'https://github.com/juyeon55', role: '풀스택' },
    ];

    const handleMemberClick = (name: string) => {
        setSelectedMember((prev) => (prev === name ? null : name));
    };

    const features = [
        {
            icon: <Gavel className='h-10 w-10 mb-4 text-uprimary' strokeWidth={1.5} />,
            title: '실시간 경매',
            desc: '입찰가가 모두에게 공개되어, 가장 높은 금액을 제시한 사람이 낙찰됩니다. 짜릿한 경쟁의 재미!',
        },
        {
            icon: <ShieldQuestion className='h-10 w-10 mb-4 text-uprimary' strokeWidth={1.5} />,
            title: '블라인드 경매',
            desc: '입찰가가 비공개! 심리전 중심의 전략적인 거래가 가능해요. 두근두근!',
        },
        {
            icon: <MessagesSquare className='h-10 w-10 mb-4 text-uprimary' strokeWidth={1.5} />,
            title: '실시간 채팅',
            desc: '경매 참여자들과 실시간으로 대화하며 현장감을 높이고 상황을 공유할 수 있습니다.',
        },
        {
            icon: <BarChartHorizontal className='h-10 w-10 mb-4 text-uprimary' strokeWidth={1.5} />,
            title: '거래 내역 및 시세 분석',
            desc: '입찰 히스토리와 평균 낙찰가를 시각화하여 합리적인 거래를 지원합니다.',
        },
    ];

    const techStacks = [
        {
            title: 'Frontend & Platform',
            items: ['TypeScript (React + Vite)', 'React (EB SPA)', 'Netlify, S3 + CloudFront(CDN)'],
        },
        {
            title: 'Backend',
            items: [
                'Java (Spring Boot)',
                'JPA, STOMP (for real-time chat)',
                'EC2 (Nginx Reverse Proxy)',
            ],
        },
        {
            title: 'Database & Infra',
            items: [
                'PostgreSQL (RDS)',
                'Redis',
                'Redpanda (Kafka 호환)',
                'Docker, GitHub Actions (CI/CD)',
            ],
        },
    ];

    return (
        <div className='bg-ubackground1 text-udark font-sans'>
            <header className='bg-uprimary text-white shadow-lg overflow-hidden relative'>
                <div className='absolute inset-0 bg-black opacity-10'></div>
                <div className='container mx-auto px-6 py-24 text-center relative z-10 animate-fade-in'>
                    <h1 className='text-5xl font-extrabold mb-4 drop-shadow-md transform transition-all duration-700 hover:scale-105'>
                        Unknown Auction
                    </h1>
                    <p className='text-2xl font-light animate-slide-up'>
                        투명하고 합리적인 중고거래, 경매로 새로운 가치를 찾다.
                    </p>
                </div>
            </header>

            <section
                ref={addToRefs}
                className={`container mx-auto px-6 py-20 transition-all duration-1000 ${visibleSections.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className='text-center max-w-3xl mx-auto'>
                    <h2 className='text-3xl font-bold mb-6 text-uprimary'>
                        왜 'Unknown Auction'인가요?
                    </h2>
                    <p className='text-lg text-udark leading-relaxed'>
                        기존 중고거래 플랫폼은 판매자가 정한 고정가로 거래되죠. 이 방식은 물건의
                        '객관적인 가치'를 반영하기 어렵고, 구매자와 판매자 간의 불필요한 감정 소모를
                        유발합니다.
                    </p>
                </div>
            </section>

            <section
                ref={addToRefs}
                className={`bg-ubackground2 py-20 transition-all duration-1000 ${visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className='container mx-auto px-6 text-center'>
                    <h2 className='text-3xl font-bold mb-4 text-uprimary'>
                        우리의 대답: 투명한 실시간 경매
                    </h2>
                    <p className='text-xl text-udark max-w-4xl mx-auto leading-relaxed'>
                        저희 'Unknown Auction'은 실시간 경매 시스템을 도입했습니다. 경쟁을 통해
                        공정한 가격이 형성되고, 채팅으로 현장감을 더해 거래의 공정성과 재미를 동시에
                        잡았습니다!
                    </p>
                </div>
            </section>

            <section
                ref={addToRefs}
                className={`container mx-auto px-6 py-20 transition-all duration-1000 ${visibleSections.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <h2 className='text-4xl font-extrabold text-center mb-16 text-uprimary'>
                    주요 기능
                </h2>
                <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-b-4 border-uprimary`}
                            style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                            {feature.icon}
                            <h3 className='text-2xl font-bold mb-3 text-uprimary'>
                                {feature.title}
                            </h3>
                            <p className='text-udark'>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section
                ref={addToRefs}
                className={`bg-udark text-white py-20 transition-all duration-1000 ${visibleSections.has(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className='container mx-auto px-6 text-center'>
                    <h2 className='text-4xl font-extrabold mb-16 text-uprimary'>
                        우리가 사용한 기술
                    </h2>
                    <div className='max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-left'>
                        {techStacks.map((section, idx) => (
                            <div
                                key={idx}
                                className='bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20 hover:border-uprimary/50 transition-all duration-300'
                            >
                                <h4 className='text-2xl font-bold mb-4 text-uprimary'>
                                    {section.title}
                                </h4>
                                <ul className='space-y-2 list-disc list-inside text-ubackground1'>
                                    {section.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section
                ref={addToRefs}
                className={`container mx-auto px-6 py-20 transition-all duration-1000 ${visibleSections.has(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <h2 className='text-4xl font-extrabold text-center mb-12 text-uprimary'>
                    Team Unknown
                </h2>
                <div className='flex flex-wrap justify-center items-start gap-x-6 gap-y-4 max-w-4xl mx-auto'>
                    <div className='flex flex-col items-center'>
                        <button
                            onClick={() => handleMemberClick(leaderData.name)}
                            className={`bg-uprimary text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg transform hover:scale-110 transition-all duration-300 ${selectedMember === leaderData.name ? 'scale-110 shadow-xl' : ''}`}
                        >
                            <Crown className='inline-block -mt-1 w-5 h-5 text-yellow-300' />{' '}
                            {leaderData.name}
                        </button>
                        <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden text-center ${selectedMember === leaderData.name ? 'max-h-24 opacity-100 pt-3' : 'max-h-0 opacity-0'}`}
                        >
                            <a
                                href={leaderData.github}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-udark hover:text-uprimary transition-colors inline-block'
                                aria-label={`${leaderData.name} 깃허브`}
                            >
                                <img src={'/img/github.png'} className='w-8 h-8' />
                            </a>
                            <p className='mt-2 text-sm font-semibold text-uprimary'>
                                {leaderData.role}
                            </p>
                        </div>
                    </div>

                    {teamData.map((member, idx) => (
                        <div key={member.name} className='flex flex-col items-center'>
                            <button
                                onClick={() => handleMemberClick(member.name)}
                                className={`bg-usecondary text-udark px-5 py-2.5 rounded-full text-lg font-semibold shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${selectedMember === member.name ? 'scale-105 shadow-xl -translate-y-1' : ''}`}
                                style={{ transitionDelay: `${(idx + 1) * 100}ms` }}
                            >
                                {member.name}
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden text-center ${selectedMember === member.name ? 'max-h-24 opacity-100 pt-3' : 'max-h-0 opacity-0'}`}
                            >
                                <a
                                    href={member.github}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-udark hover:text-uprimary transition-colors inline-block'
                                    aria-label={`${member.name} 깃허브`}
                                >
                                    <img src={'/img/github.png'} className='w-8 h-8' />
                                </a>
                                <p className='mt-2 text-sm font-semibold text-uprimary'>
                                    {member.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer
                ref={addToRefs}
                className={`bg-uprimary text-white py-20 transition-all duration-1000 ${visibleSections.has(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className='container mx-auto px-6 text-center'>
                    <h2 className='text-3xl font-bold mb-6 text-usecondary'>
                        새로운 중고거래 문화를 만듭니다
                    </h2>
                    <p className='text-lg mb-10 max-w-3xl mx-auto font-light text-white/90'>
                        'Unknown Auction'은 공정한 거래 문화를 선도하고, 실시간 경쟁으로 새로운
                        중고거래 경험을 제공합니다. 희소성 있는 굿즈나 티켓 거래까지, 가능성은
                        무한합니다!
                    </p>
                    <button
                        onClick={() => (window.location = '/')}
                        className='bg-white text-uprimary font-bold py-3 px-10 rounded-full shadow-lg hover:bg-ubackground1 hover:scale-105 transition-all duration-300 text-lg'
                    >
                        지금 바로 경매 참여하기!
                    </button>
                </div>
            </footer>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
                .animate-slide-up {
                    animation: slide-up 1s ease-out 0.3s both;
                }
            `}</style>
        </div>
    );
};

export default CompanyPage;
