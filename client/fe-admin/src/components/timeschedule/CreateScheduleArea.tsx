'use client';
import * as React from 'react';
import { getClasses, getTeachers, createTimeSchedule } from '../../lib/services/timeschedule/timeschedule.service';
import { User } from '@/models/user/user.model';
import { Class } from '@/models/class';

// Dữ liệu slot cố định
const timeSlots = [
    { slotNumber: 1, time: "07:30 - 08:35", startTime: "07:30", endTime: "08:35" },
    { slotNumber: 2, time: "08:45 - 09:50", startTime: "08:45", endTime: "09:50" },
    { slotNumber: 3, time: "10:00 - 11:05", startTime: "10:00", endTime: "11:05" },
    { slotNumber: 4, time: "11:15 - 12:20", startTime: "11:15", endTime: "12:20" },
    { slotNumber: 5, time: "12:50 - 13:55", startTime: "12:50", endTime: "13:55" },
    { slotNumber: 6, time: "14:05 - 15:10", startTime: "14:05", endTime: "15:10" },
    { slotNumber: 7, time: "15:20 - 16:25", startTime: "15:20", endTime: "16:25" },
    { slotNumber: 8, time: "16:35 - 17:40", startTime: "16:35", endTime: "17:40" },
    { slotNumber: 9, time: "17:50 - 18:55", startTime: "17:50", endTime: "18:55" },
];

export const CreateScheduleArea: React.FC = () => {
    const [classes, setClasses] = React.useState<Class[]>([]);
    const [teachers, setTeachers] = React.useState<User[]>([]);
    
    // Form state
    const [classId, setClassId] = React.useState('');
    const [teacherId, setTeacherId] = React.useState('');
    const [dayOfWeek, setDayOfWeek] = React.useState('Monday');
    const [slotNumber, setSlotNumber] = React.useState(1);
    const [room, setRoom] = React.useState('');

    const [isLoading, setIsLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            const classRes = await getClasses({ limit: 200 });
            if (classRes.success) setClasses(classRes.data.classes);

            const teacherRes = await getTeachers({ limit: 200 });
            if (teacherRes.success) setTeachers(teacherRes.data.users);
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!classId || !teacherId || !room) {
            setMessage("Vui lòng chọn lớp, giảng viên và điền phòng học.");
            return;
        }
        setIsLoading(true);
        setMessage('');

        const selectedSlot = timeSlots.find(s => s.slotNumber === slotNumber);
        if (!selectedSlot) {
            setMessage("Slot không hợp lệ.");
            setIsLoading(false);
            return;
        }

        const payload = {
            classId,
            teacherId,
            dayOfWeek,
            slotNumber,
            room,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
        };

        const result = await createTimeSchedule(payload);
        setMessage(result.message);
        setIsLoading(false);
        if (result.success) {
            // Reset form
            setClassId('');
            setTeacherId('');
            setRoom('');
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-bold mb-6">Tạo Lịch Học Cho Lớp</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {/* Inputs */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="class" className="font-semibold text-sm">Lớp học phần</label>
                    <select id="class" value={classId} onChange={e => setClassId(e.target.value)} className="border rounded p-2">
                        <option value="" disabled>-- Chọn lớp học --</option>
                        {classes.map(c => <option key={c._id} value={c._id}>{c.classCode}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="teacher" className="font-semibold text-sm">Giảng viên</label>
                    <select id="teacher" value={teacherId} onChange={e => setTeacherId(e.target.value)} className="border rounded p-2">
                        <option value="" disabled>-- Chọn giảng viên --</option>
                        {teachers.map(t => <option key={t._id} value={t._id}>{t.fullName}</option>)}
                    </select>
                </div>
                 <div className="flex flex-col gap-2">
                    <label htmlFor="day" className="font-semibold text-sm">Thứ</label>
                    <select id="day" value={dayOfWeek} onChange={e => setDayOfWeek(e.target.value)} className="border rounded p-2">
                        <option value="Monday">Thứ Hai</option>
                        <option value="Tuesday">Thứ Ba</option>
                        <option value="Wednesday">Thứ Tư</option>
                        <option value="Thursday">Thứ Năm</option>
                        <option value="Friday">Thứ Sáu</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="slot" className="font-semibold text-sm">Slot</label>
                    <select id="slot" value={slotNumber} onChange={e => setSlotNumber(Number(e.target.value))} className="border rounded p-2">
                        {timeSlots.map(s => <option key={s.slotNumber} value={s.slotNumber}>{`Slot ${s.slotNumber} (${s.time})`}</option>)}
                    </select>
                </div>
                 <div className="flex flex-col gap-2">
                    <label htmlFor="room" className="font-semibold text-sm">Phòng học</label>
                    <input id="room" type="text" value={room} onChange={e => setRoom(e.target.value)} className="border rounded p-2" placeholder="VD: BE-210" />
                </div>
                {/* Submit Button */}
                <div className="flex items-end col-span-full">
                     <button type="submit" disabled={isLoading} className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 w-full md:w-auto">
                        {isLoading ? 'Đang tạo...' : 'Tạo Lịch Học'}
                    </button>
                </div>
            </form>
            {message && <p className="mt-4 text-center text-sm">{message}</p>}
        </div>
    );
};