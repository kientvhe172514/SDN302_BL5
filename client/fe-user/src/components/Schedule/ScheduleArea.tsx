'use client';
import * as React from 'react';
import { getMySchedule } from '../../lib/services/weeklytime/schedule.service';
import { TimeSchedule } from '@/models/timeschedule'; // Giả định

// --- Hàm Helper để xử lý ngày tháng ---
const getWeekDates = (currentDate: Date): Date[] => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
    });
};

const formatDate = (date: Date, format: 'short' | 'long'): string => {
    if (format === 'short') {
        return date.toLocaleDateString('en-GB', { day: '2-digit' });
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Thêm hàm helper để convert short day thành full day name
const getFullDayName = (shortDay: string): string => {
    const dayMap: { [key: string]: string } = {
        'MON': 'Monday',
        'TUE': 'Tuesday', 
        'WED': 'Wednesday',
        'THU': 'Thursday',
        'FRI': 'Friday',
        'SAT': 'Saturday',
        'SUN': 'Sunday'
    };
    return dayMap[shortDay] || shortDay;
};

export const ScheduleArea: React.FC = () => {
    const [schedules, setSchedules] = React.useState<TimeSchedule[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentDate, setCurrentDate] = React.useState(new Date());

    React.useEffect(() => {
        const fetchSchedule = async () => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (currentUser && currentUser._id) {
                setIsLoading(true);
                const result = await getMySchedule(currentUser._id);
                
                console.log("API response for schedule:", result);

                // SỬA LẠI LOGIC KIỂM TRA Ở ĐÂY
                // Kiểm tra xem result.data có tồn tại và là một mảng không
                if (result && Array.isArray(result.data)) {
                    setSchedules(result.data);
                    console.log("Schedules set:", result.data); // Debug log
                } else {
                    console.error("API did not return a valid schedule array in the 'data' property.", result);
                }
                
                setIsLoading(false);
            } else {
                setIsLoading(false);
                console.error("Current user not found.");
            }
        };
        fetchSchedule();
    }, []);

    const weekDates = getWeekDates(currentDate);
    const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    const scheduleMap = React.useMemo(() => {
        const map = new Map<string, TimeSchedule>();
        schedules.forEach(schedule => {
            const key = `${schedule.dayOfWeek}-${schedule.slotNumber}`;
            map.set(key, schedule);
            console.log("Setting key:", key, schedule); // Debug log
        });
        console.log("Schedule map:", map); // Debug log
        return map;
    }, [schedules]);

    const goToPreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    if (isLoading) {
        return <div className="p-4">Đang tải lịch học...</div>;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded-t-lg">
                <button onClick={goToPreviousWeek} className="p-2 rounded-full hover:bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div className="font-semibold text-lg">
                    Week: {formatDate(weekDates[0], 'long')} - {formatDate(weekDates[6], 'long')}
                </div>
                <button onClick={goToNextWeek} className="p-2 rounded-full hover:bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-center">
                    <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="p-2 border border-gray-300"></th>
                            {weekDays.map((day, index) => (
                                <th key={day} className="p-2 border border-gray-300 font-semibold">
                                    <div>{day}</div>
                                    <div className="text-sm font-normal">{formatDate(weekDates[index], 'short')}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(slot => (
                            <tr key={slot} className="hover:bg-gray-50">
                                <td className="p-2 border border-gray-300 font-semibold">Slot {slot}</td>
                                {weekDays.map(day => {
                                    // SỬA LẠI: Convert short day thành full day name để match với API
                                    const fullDayName = getFullDayName(day);
                                    const key = `${fullDayName}-${slot}`;
                                    const schedule = scheduleMap.get(key);
                                    
                                    console.log("Looking for key:", key, "Found:", !!schedule); // Debug log
                                    
                                    return (
                                        <td key={`${day}-${slot}`} className="p-2 border border-gray-300 align-top text-sm h-24">
                                            {schedule ? (
                                                <div className="text-left">
                                                    <p className="font-bold text-blue-700">{schedule.class.subject.subjectCode}</p>
                                                    <p>at {schedule.room}</p>
                                                    <p className="text-xs text-gray-500">GV: {schedule.teacher.fullName}</p>
                                                    <div className="mt-1">
                                                        <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">(Not yet)</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">({schedule.startTime}-{schedule.endTime})</p>
                                                </div>
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};