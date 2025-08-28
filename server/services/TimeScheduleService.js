const Class = require('../model/Class'); // Sử dụng model Class
const TimeSchedule = require('../model/TimeSchedule');
const ApiError = require('../errors/api-error'); // <-- SỬA LẠI ĐƯỜNG DẪN NẾU CẦN
class TimeScheduleService {
    /**
     * Lấy toàn bộ lịch học của một sinh viên.
     * @param {string} studentId - ID của sinh viên
     * @returns {Promise<Array>} - Mảng các lịch học đã được populate thông tin chi tiết
     */
    static async getStudentSchedule(studentId) {
        try {
            const studentClasses = await Class.find({ students: studentId }).select('_id').lean();
            if (!studentClasses || studentClasses.length === 0) {
                return [];
            }
            
            const classIds = studentClasses.map(cls => cls._id);
            
            const schedules = await TimeSchedule.find({ class: { $in: classIds } })
                .populate({
                    path: 'class',
                    // Xóa 'teacher' khỏi select
                    select: 'classCode subject semester', 
                    populate: {
                        // Giờ đây populate không cần là mảng nữa
                        path: 'subject',
                        select: 'name subjectCode'
                    }
                })
                .populate('teacher', 'fullName email') // Giảng viên của buổi học (vẫn giữ lại)
                .sort({ dayOfWeek: 1, startTime: 1 })
                .lean();
            
            return schedules;
        } catch (error) {
            console.error("!!! AN ERROR OCCURRED in getStudentSchedule service:", error);
            throw new ApiError(500, "Failed to get student schedule due to a server error.");
        }
    }

     /**
     * (LOGIC MỚI) Tự động gán một danh sách sinh viên vào các lớp học phần của một môn học.
     * @param {string} subjectId - ID của môn học.
     * @param {string} semester - Học kỳ (ví dụ: "Fall 2024").
     * @param {string[]} studentIds - Mảng ID của các sinh viên cần xếp lớp.
     * @returns {Promise<object>} - Báo cáo kết quả xếp lớp.
     */
     static async assignStudentsToClasses(subjectId, semester, studentIds) {
        console.log("  [TimeScheduleService] Received request to assign students.");
        console.log(`  --> Subject: ${subjectId}, Semester: ${semester}, Student Count: ${studentIds.length}`);

        // 1. Tìm tất cả các lớp học phần cho môn học và học kỳ đã cho.
        console.log("  1. Finding available classes...");
        const classes = await Class.find({ subject: subjectId, semester: semester });
        
        if (!classes || classes.length === 0) {
            console.error(`  --> CRITICAL: No classes found for subject ${subjectId} in semester ${semester}. Cannot assign students.`);
            throw new ApiError(404, `No classes found for subject ${subjectId} in semester ${semester}.`);
        }
        console.log(`  --> Found ${classes.length} class(es).`);

        const assignedStudents = [];
        const unassignedStudents = [];
        const bulkUpdateOps = [];

        // 2. Lặp qua từng sinh viên để tìm lớp trống.
        console.log("  2. Looping through students to find empty slots...");
        for (const studentId of studentIds) {
            let isAssigned = false;
            for (const cls of classes) {
                const studentIdsInClass = cls.students.map(id => id.toString());
                const isFull = cls.students.length >= cls.maxSize;
                const alreadyEnrolled = studentIdsInClass.includes(studentId);

                // Log chi tiết điều kiện
                // console.log(`    - Checking Class ${cls.classCode}: Size (${cls.students.length}/${cls.maxSize}), Student ${studentId} enrolled? ${alreadyEnrolled}`);

                if (!isFull && !alreadyEnrolled) {
                    console.log(`    --> SUCCESS: Assigning student ${studentId} to class ${cls.classCode}`);
                    cls.students.push(studentId); // Cập nhật sĩ số tạm thời
                    bulkUpdateOps.push({
                        updateOne: {
                            filter: { _id: cls._id },
                            update: { $addToSet: { students: studentId } }
                        }
                    });
                    assignedStudents.push(studentId);
                    isAssigned = true;
                    break; 
                }
            }

            if (!isAssigned) {
                console.warn(`    --> WARNING: Could not find a class for student ${studentId}. All classes might be full.`);
                unassignedStudents.push(studentId);
            }
        }
        // 3. Thực thi tất cả các lệnh cập nhật vào database.
        console.log(`  3. Preparing to execute ${bulkUpdateOps.length} update operations...`);
        if (bulkUpdateOps.length > 0) {
            await Class.bulkWrite(bulkUpdateOps);
            console.log("  --> Bulk write to database successful.");
        } else {
            console.log("  --> No new assignments to write to database.");
        }

        // 4. Trả về kết quả
        const report = {
            totalStudentsToAssign: studentIds.length,
            assignedCount: assignedStudents.length,
            unassignedCount: unassignedStudents.length,
            assignedStudents,
            unassignedStudents,
        };
        console.log("  4. Returning assignment report.");
        return report;
    }

    static async createSchedule(scheduleData) {
        const { classId, teacherId, slotNumber, dayOfWeek, startTime, endTime, room } = scheduleData;

        // --- BƯỚC 1: VALIDATE DỮ LIỆU ---

        // 1.1: Kiểm tra xem classId có tồn tại không
        const classExists = await Class.findById(classId);
        if (!classExists) {
            throw new ApiError(404, `Class with ID ${classId} not found.`);
        }
        
        // 1.2: Kiểm tra xem LỚP NÀY đã có lịch học vào ĐÚNG NGÀY VÀ SLOT ĐÓ chưa
        const scheduleExistsForClass = await TimeSchedule.findOne({ 
            class: classId, 
            dayOfWeek: dayOfWeek, 
            slotNumber: slotNumber 
        });
        if (scheduleExistsForClass) {
            throw new ApiError(409, `This class already has a schedule on ${dayOfWeek} at slot ${slotNumber}.`);
        }

        // 1.3: Kiểm tra xem PHÒNG HỌC này có bị trùng lịch vào ĐÚNG NGÀY VÀ SLOT ĐÓ không
        const roomIsOccupied = await TimeSchedule.findOne({
            room: room,
            dayOfWeek: dayOfWeek,
            slotNumber: slotNumber
        });
        if (roomIsOccupied) {
            throw new ApiError(409, `Room ${room} is already occupied on ${dayOfWeek} at slot ${slotNumber} by another class.`);
        }

        // 1.4: (THÊM MỚI) Kiểm tra xem GIẢNG VIÊN này có bị trùng lịch vào ĐÚNG NGÀY VÀ SLOT ĐÓ không
        const teacherIsBusy = await TimeSchedule.findOne({
            teacher: teacherId,
            dayOfWeek: dayOfWeek,
            slotNumber: slotNumber
        });
        if (teacherIsBusy) {
            throw new ApiError(409, `This teacher is already scheduled for another class on ${dayOfWeek} at slot ${slotNumber}.`);
        }


        // --- BƯỚC 2: TẠO BẢN GHI MỚI ---
        try {
            const newSchedule = new TimeSchedule({
                class: classId,
                teacher: teacherId,
                slotNumber,
                dayOfWeek,
                startTime,
                endTime,
                room
            });

            await newSchedule.save();

            return {
                success: true,
                message: "Time schedule created successfully.",
                data: newSchedule
            };
        } catch (error) {
            // Ném lại lỗi gốc để global error handler xử lý
            throw error;
        }
    }
    
    static async getScheduleAvailability(classId, teacherId, dayOfWeek) {
        try {
            // Tìm các slot mà LỚP này đã có lịch
            const classSchedules = await TimeSchedule.find({ class: classId, dayOfWeek }).select('slotNumber');
            const occupiedSlotsForClass = classSchedules.map(s => s.slotNumber);
    
            // Tìm các slot mà GIẢNG VIÊN này đã có lịch
            const teacherSchedules = await TimeSchedule.find({ teacher: teacherId, dayOfWeek }).select('slotNumber');
            const occupiedSlotsForTeacher = teacherSchedules.map(s => s.slotNumber);
    
            // Tìm tất cả các phòng đã có lịch trong ngày hôm đó, gom nhóm theo slot
            const allSchedulesOnDay = await TimeSchedule.find({ dayOfWeek }).select('slotNumber room');
            
            const occupiedRoomsBySlot = allSchedulesOnDay.reduce((acc, schedule) => {
                const slot = schedule.slotNumber;
                if (!acc[slot]) {
                    acc[slot] = [];
                }
                // Đảm bảo room ID không bị null và được chuyển thành string
                if (schedule.room) {
                     acc[slot].push(schedule.room.toString());
                }
                return acc;
            }, {});
    
            return {
                success: true,
                data: {
                    occupiedSlotsForClass,
                    occupiedSlotsForTeacher,
                    occupiedRoomsBySlot
                }
            };
        } catch (error) {
            // Trong thực tế, bạn nên log lỗi này
            throw new ApiError(500, "Could not retrieve schedule availability.");
        }
    }
}


module.exports = TimeScheduleService;
