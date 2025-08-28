'use client';
import * as React from 'react';
// Giả sử bạn đã có các hàm service này
import { 
    getClasses, 
    getTeachers, 
    createTimeSchedule, 
    getRooms, 
    getScheduleAvailability, // Hàm service mới
    Room 
} from '../../lib/services/timeschedule/timeschedule.service';
import { User } from '@/models/user/user.model';
import { Class } from '@/models/class';

// Định nghĩa kiểu dữ liệu cho một slot thời gian
interface TimeSlot {
    slotNumber: number;
    time: string;
    startTime: string;
    endTime: string;
}

// Dữ liệu slot cố định
const timeSlots: TimeSlot[] = [
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
    // State cho dữ liệu gốc
    const [classes, setClasses] = React.useState<Class[]>([]);
    const [teachers, setTeachers] = React.useState<User[]>([]);
    const [allRooms, setAllRooms] = React.useState<Room[]>([]);
    
    // Form state
    const [classId, setClassId] = React.useState('');
    const [teacherId, setTeacherId] = React.useState('');
    const [dayOfWeek, setDayOfWeek] = React.useState('Monday');
    const [slotNumber, setSlotNumber] = React.useState<number | ''>('');
    const [roomId, setRoomId] = React.useState('');

    // State cho dữ liệu đã được lọc (khả dụng)
    const [availableSlots, setAvailableSlots] = React.useState<TimeSlot[]>([]);
    const [availableRooms, setAvailableRooms] = React.useState<Room[]>([]);
    
    // State cho trạng thái loading
    const [isInitialLoading, setIsInitialLoading] = React.useState(true);
    const [isAvailabilityLoading, setIsAvailabilityLoading] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [message, setMessage] = React.useState('');
    
    // Dữ liệu về lịch bận (lấy từ API)
    const [occupiedData, setOccupiedData] = React.useState(null);

    // Effect 1: Fetch dữ liệu ban đầu (lớp, gv, phòng)
    React.useEffect(() => {
        const fetchData = async () => {
            setIsInitialLoading(true);
            const [classRes, teacherRes, roomRes] = await Promise.all([
                getClasses({ limit: 200 }),
                getTeachers({ limit: 200 }),
                getRooms({ limit: 200, isActive: true })
            ]);

            if (classRes.success) setClasses(classRes.data.classes);
            if (teacherRes.success) setTeachers(teacherRes.data.users);
            if (roomRes.success) {
                setAllRooms(roomRes.data.rooms);
                setAvailableRooms(roomRes.data.rooms); // Ban đầu hiển thị tất cả phòng
            }
            setIsInitialLoading(false);
        };
        fetchData();
    }, []);

    // Effect 2: Fetch dữ liệu về lịch bận khi Lớp, GV, hoặc Thứ thay đổi
    React.useEffect(() => {
        const fetchAvailability = async () => {
            if (!classId || !teacherId || !dayOfWeek) {
                setOccupiedData(null);
                setAvailableSlots([]); // Xóa danh sách slot khả dụng
                setSlotNumber(''); // Reset slot đã chọn
                return;
            }
            
            setIsAvailabilityLoading(true);
            const res = await getScheduleAvailability({ classId, teacherId, dayOfWeek });
            if (res.success) {
                setOccupiedData(res.data);
            } else {
                setOccupiedData(null);
                setMessage("Lỗi khi lấy dữ liệu lịch học.");
            }
            setIsAvailabilityLoading(false);
        };
        fetchAvailability();
    }, [classId, teacherId, dayOfWeek]);

    // Effect 3: Lọc danh sách SLOT khả dụng khi có dữ liệu lịch bận
    React.useEffect(() => {
        if (occupiedData) {
            const { occupiedSlotsForClass, occupiedSlotsForTeacher } = occupiedData;
            const allOccupiedSlotNumbers = new Set([...occupiedSlotsForClass, ...occupiedSlotsForTeacher]);
            
            const filteredSlots = timeSlots.filter(s => !allOccupiedSlotNumbers.has(s.slotNumber));
            setAvailableSlots(filteredSlots);

            // Nếu slot đang chọn không còn khả dụng, reset nó
            if (slotNumber && allOccupiedSlotNumbers.has(slotNumber)) {
                setSlotNumber('');
            }
        }
    }, [occupiedData, slotNumber]);

    // Effect 4: Lọc danh sách PHÒNG khả dụng khi có dữ liệu lịch bận và đã chọn slot
    React.useEffect(() => {
        if (occupiedData && slotNumber) {
            const { occupiedRoomsBySlot } = occupiedData;
            const occupiedRoomIdsForCurrentSlot = new Set(occupiedRoomsBySlot[slotNumber] || []);

            const filteredRooms = allRooms.filter(r => !occupiedRoomIdsForCurrentSlot.has(r._id));
            setAvailableRooms(filteredRooms);

            // Nếu phòng đang chọn không còn khả dụng, reset nó
            if (roomId && occupiedRoomIdsForCurrentSlot.has(roomId)) {
                setRoomId('');
            }
        } else if (!classId || !teacherId || !dayOfWeek) {
            // Nếu chưa chọn đủ thông tin, hiển thị lại tất cả phòng
            setAvailableRooms(allRooms);
        }
    }, [occupiedData, slotNumber, allRooms, roomId]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!classId || !teacherId || !roomId || !slotNumber) {
            setMessage("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        setIsSubmitting(true);
        setMessage('');

        const selectedSlot = timeSlots.find(s => s.slotNumber === slotNumber);
        if (!selectedSlot) {
            setMessage("Slot không hợp lệ.");
            setIsSubmitting(false);
            return;
        }

        const payload = {
            classId,
            teacherId,
            dayOfWeek,
            slotNumber,
            room: roomId,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
        };

        const result = await createTimeSchedule(payload);
        setMessage(result.message);
        setIsSubmitting(false);
        if (result.success) {
            // Reset form và dữ liệu để thêm lịch mới
            setClassId('');
            setTeacherId('');
            setRoomId('');
            setSlotNumber('');
            setOccupiedData(null);
            setAvailableSlots([]);
        }
    };

    const isSelectionMade = classId && teacherId && dayOfWeek;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-bold mb-6">Tạo Lịch Học Cho Lớp</h2>
            {isInitialLoading ? <p>Đang tải dữ liệu...</p> : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {/* Lớp học phần */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="class" className="font-semibold text-sm">Lớp học phần</label>
                    <select id="class" value={classId} onChange={e => setClassId(e.target.value)} className="border rounded p-2">
                        <option value="" disabled>-- Chọn lớp học --</option>
                        {classes.map(c => <option key={c._id} value={c._id}>{c.classCode}</option>)}
                    </select>
                </div>

                {/* Giảng viên */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="teacher" className="font-semibold text-sm">Giảng viên</label>
                    <select id="teacher" value={teacherId} onChange={e => setTeacherId(e.target.value)} className="border rounded p-2">
                        <option value="" disabled>-- Chọn giảng viên --</option>
                        {teachers.map(t => <option key={t._id} value={t._id}>{t.fullName}</option>)}
                    </select>
                </div>

                {/* Thứ */}
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

                {/* Slot */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="slot" className="font-semibold text-sm">Slot</label>
                    <select 
                        id="slot" 
                        value={slotNumber} 
                        onChange={e => setSlotNumber(Number(e.target.value))} 
                        className="border rounded p-2"
                        disabled={!isSelectionMade || isAvailabilityLoading}
                    >
                        <option value="" disabled>-- Chọn slot --</option>
                        {isAvailabilityLoading && <option>Đang tìm slot trống...</option>}
                        {!isAvailabilityLoading && availableSlots.length === 0 && isSelectionMade && <option disabled>Không có slot trống</option>}
                        {availableSlots.map(s => (
                            <option key={s.slotNumber} value={s.slotNumber}>
                                {`Slot ${s.slotNumber} (${s.time})`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Phòng học */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="room" className="font-semibold text-sm">Phòng học</label>
                    <select 
                        id="room" 
                        value={roomId} 
                        onChange={e => setRoomId(e.target.value)} 
                        className="border rounded p-2"
                        disabled={!slotNumber || isAvailabilityLoading}
                    >
                        <option value="" disabled>-- Chọn phòng học --</option>
                        {availableRooms.length === 0 && slotNumber && <option disabled>Không có phòng trống</option>}
                        {availableRooms.map(room => (
                            <option key={room._id} value={room._id}>
                                {room.roomCode}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <div className="flex items-end col-span-full">
                    <button 
                        type="submit" 
                        disabled={isSubmitting || isAvailabilityLoading} 
                        className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 w-full md:w-auto"
                    >
                        {isSubmitting ? 'Đang tạo...' : 'Tạo Lịch Học'}
                    </button>
                </div>
            </form>
            )}
            {message && (
                <p className={`mt-4 text-center text-sm ${
                    message.includes('thành công') ? 'text-green-700' : 'text-red-700'
                }`}>
                    {message}
                </p>
            )}
        </div>
    );
};
