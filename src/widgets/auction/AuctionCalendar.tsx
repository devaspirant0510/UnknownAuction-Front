import React, { useMemo, useEffect, useState } from 'react';
import { BidDailySummary } from '@entities/auction/model';
import { isSameDay, differenceInDays, format } from 'date-fns';

interface AuctionCalendarProps {
    startTime: string;
    endTime: string;
    transactions: BidDailySummary[];
}

function parseDate(dateStr: string): Date {
    return new Date(dateStr);
}

function formatDateSimple(date: Date, formatStr: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    if (formatStr === 'yyyy-MM-dd') return `${year}-${month}-${day}`;
    return day;
}

function getDayOfWeek(date: Date): number {
    return date.getDay();
}

function getDaysInRange(start: Date, end: Date): Date[] {
    const days: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return days;
}

function formatRemainingTime(diffMs: number): string {
    if (diffMs <= 0) return '경매 종료됨';

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days > 0 ? `${days}일 ` : ''}${hours}시간 ${minutes}분 ${seconds}초`;
}

export function AuctionCalendar({ startTime, endTime, transactions }: AuctionCalendarProps) {
    const start = useMemo(() => parseDate(startTime), [startTime]);
    const end = useMemo(() => parseDate(endTime), [endTime]);
    const today = new Date();

    const totalDays = differenceInDays(end, start) + 1;
    const formattedStart = format(start, 'yyyy.MM.dd');
    const formattedEnd = format(end, 'yyyy.MM.dd');

    const [remainingTime, setRemainingTime] = useState(
        formatRemainingTime(end.getTime() - Date.now()),
    );

    // 🕓 실시간으로 남은 시간 갱신
    useEffect(() => {
        const timer = setInterval(() => {
            const diff = end.getTime() - Date.now();
            setRemainingTime(formatRemainingTime(diff));
        }, 1000);
        return () => clearInterval(timer);
    }, [end]);

    const days = useMemo(() => getDaysInRange(start, end), [start, end]);

    const summaryMap = useMemo(() => {
        const map = new Map();
        transactions.forEach((t) => map.set(t.truncatedDate, t));
        return map;
    }, [transactions]);

    const weeks = useMemo(() => {
        const result: (Date | null)[][] = [];
        let week: (Date | null)[] = [];

        const firstDayOfWeek = getDayOfWeek(days[0]);
        for (let i = 0; i < firstDayOfWeek; i++) week.push(null);

        days.forEach((day) => {
            week.push(day);
            if (week.length === 7) {
                result.push(week);
                week = [];
            }
        });

        if (week.length > 0) {
            while (week.length < 7) week.push(null);
            result.push(week);
        }

        return result;
    }, [days]);

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div className='flex flex-col items-center p-4 space-y-4'>
            {/* 📅 경매 기간 정보 */}
            <div className='w-full max-w-4xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 flex flex-col items-center text-gray-800'>
                <div className='text-sm font-semibold text-gray-600'>📅 경매 기간</div>
                <div className='text-lg font-bold text-green-800 mb-1'>
                    {formattedStart} ~ {formattedEnd}{' '}
                    <span className='text-green-600 text-base font-semibold'>
                        (총 {totalDays}일)
                    </span>
                </div>
                <div className='text-sm text-gray-700'>
                    🕓 <span className='font-semibold text-blue-600'>{remainingTime}</span> 남음
                </div>
            </div>

            <div className='bg-white rounded-lg shadow-lg p-4 max-w-4xl w-full'>
                {/* 요일 헤더 */}
                <div className='grid grid-cols-7 gap-2 mb-2'>
                    {weekDays.map((day, idx) => (
                        <div
                            key={day}
                            className={`text-center font-semibold py-2 ${
                                idx === 0
                                    ? 'text-red-600'
                                    : idx === 6
                                      ? 'text-blue-600'
                                      : 'text-gray-700'
                            }`}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* 날짜 그리드 */}
                <div className='grid grid-cols-7 gap-2'>
                    {weeks.map((week, weekIdx) =>
                        week.map((day, dayIdx) => {
                            if (!day)
                                return (
                                    <div
                                        key={`empty-${weekIdx}-${dayIdx}`}
                                        className='aspect-square'
                                    />
                                );

                            const dateKey = formatDateSimple(day, 'yyyy-MM-dd');
                            const data = summaryMap.get(dateKey);
                            const dayOfWeek = getDayOfWeek(day);
                            const isStart = isSameDay(day, start);
                            const isEnd = isSameDay(day, end);
                            const isToday = isSameDay(day, today);

                            const prevDay =
                                weekIdx === 0 && dayIdx === 0
                                    ? null
                                    : week[dayIdx - 1] ||
                                      weeks[weekIdx - 1]?.findLast((d) => d !== null);

                            const showMonth = !prevDay || day.getMonth() !== prevDay.getMonth();

                            return (
                                <div
                                    key={dateKey}
                                    className={`relative aspect-square border rounded-lg p-2 flex flex-col justify-between transition-all ${
                                        isToday
                                            ? 'border-blue-400 ring-2 ring-blue-300 bg-blue-50'
                                            : data
                                              ? 'bg-green-50 border-green-300'
                                              : 'bg-gray-50 border-gray-200'
                                    }`}
                                >
                                    {isStart && (
                                        <div className='absolute top-1 right-1 bg-green-600 text-white text-[10px] px-2 py-[1px] rounded-full'>
                                            시작
                                        </div>
                                    )}
                                    {isEnd && (
                                        <div className='absolute top-1 right-1 bg-red-600 text-white text-[10px] px-2 py-[1px] rounded-full'>
                                            종료
                                        </div>
                                    )}
                                    {isToday && (
                                        <div className='absolute bottom-1 right-1 text-[10px] font-bold text-blue-600'>
                                            오늘
                                        </div>
                                    )}

                                    {/* 날짜 */}
                                    <div
                                        className={`text-sm font-semibold ${
                                            dayOfWeek === 0
                                                ? 'text-red-600'
                                                : dayOfWeek === 6
                                                  ? 'text-blue-600'
                                                  : 'text-gray-700'
                                        }`}
                                    >
                                        {showMonth
                                            ? `${day.getMonth() + 1}/${day.getDate()}`
                                            : day.getDate()}
                                    </div>

                                    {data && (
                                        <div className='text-xs space-y-1'>
                                            <div className='font-medium text-green-700'>
                                                {data.totalPrice.toLocaleString()}p
                                            </div>
                                            <div className='text-gray-600'>{data.count}건</div>
                                        </div>
                                    )}
                                </div>
                            );
                        }),
                    )}
                </div>
            </div>
        </div>
    );
}

export default AuctionCalendar;
