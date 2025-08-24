// Constants cho các loại đơn
const APPLICATION_TYPES = {
    // Loại đơn cơ bản
    ATTENDANCE_EXEMPTION: 'attendance_exemption',
    TRANSCRIPT_REQUEST: 'transcript_request',
    CREDIT_TRANSFER: 'credit_transfer',
    COURSE_SWITCH: 'course_switch',
    GRADE_REVIEW: 'grade_review',
    IMPROVEMENT_EXAM: 'improvement_exam',
    OTHER_APPLICATIONS: 'other_applications',
    WITHDRAWAL_REQUEST: 'withdrawal_request',
    MAJOR_TRANSFER: 'major_transfer',
    CAMPUS_TRANSFER: 'campus_transfer',
    ONLINE_COURSE_ASSESSMENT: 'online_course_assessment',
    MONEY_WITHDRAWAL: 'money_withdrawal',
    COURSE_TRANSFER_REFUND: 'course_transfer_refund',
    ATTENDANCE_COMPLAINT: 'attendance_complaint',
    TOPJ_REGISTRATION: 'topj_registration',
    READMISSION_REQUEST: 'readmission_request',
    LUK_ATTENDANCE_SUPPORT: 'luk_attendance_support',
    SPECIALIZED_COMBO_CHANGE: 'specialized_combo_change',
    EARLY_GRADUATION: 'early_graduation',
    THESIS_POSTPONEMENT: 'thesis_postponement',
    COURSE_WITHDRAWAL: 'course_withdrawal',
    LEAVE_OF_ABSENCE: 'leave_of_absence',
    SUSPENSION: 'suspension'
};

// Mapping tên hiển thị cho từng loại đơn
const APPLICATION_TYPE_LABELS = {
    [APPLICATION_TYPES.ATTENDANCE_EXEMPTION]: 'Đề nghị miễn điểm danh',
    [APPLICATION_TYPES.TRANSCRIPT_REQUEST]: 'Đề nghị cấp bảng điểm quá trình',
    [APPLICATION_TYPES.CREDIT_TRANSFER]: 'Đề nghị chuyển đổi tín chỉ',
    [APPLICATION_TYPES.COURSE_SWITCH]: 'Đề nghị chuyển từ học Võ sang học Cờ',
    [APPLICATION_TYPES.GRADE_REVIEW]: 'Đề nghị phúc khảo',
    [APPLICATION_TYPES.IMPROVEMENT_EXAM]: 'Đăng ký thi cải thiện điểm',
    [APPLICATION_TYPES.OTHER_APPLICATIONS]: 'Các loại đơn khác',
    [APPLICATION_TYPES.WITHDRAWAL_REQUEST]: 'Đơn đề nghị thôi học',
    [APPLICATION_TYPES.MAJOR_TRANSFER]: 'Đề nghị chuyển ngành',
    [APPLICATION_TYPES.CAMPUS_TRANSFER]: 'Đề nghị chuyển cơ sở',
    [APPLICATION_TYPES.ONLINE_COURSE_ASSESSMENT]: 'Đăng ký thi thẩm định các môn học online',
    [APPLICATION_TYPES.MONEY_WITHDRAWAL]: 'Đơn đề nghị rút tiền',
    [APPLICATION_TYPES.COURSE_TRANSFER_REFUND]: 'Đơn đề nghị hoàn tiền chuyển đổi môn học',
    [APPLICATION_TYPES.ATTENDANCE_COMPLAINT]: 'Đơn khiếu nại điểm danh (không bao gồm luk)',
    [APPLICATION_TYPES.TOPJ_REGISTRATION]: 'Đơn đăng ký TOP-J',
    [APPLICATION_TYPES.READMISSION_REQUEST]: 'Đơn xin nhập học trở lại',
    [APPLICATION_TYPES.LUK_ATTENDANCE_SUPPORT]: 'Đơn đề nghị hỗ trợ kiểm tra trạng thái điểm danh LUK',
    [APPLICATION_TYPES.SPECIALIZED_COMBO_CHANGE]: 'Đề nghị đổi combo chuyên sâu',
    [APPLICATION_TYPES.EARLY_GRADUATION]: 'Đơn đề nghị xét tốt nghiệp sớm',
    [APPLICATION_TYPES.THESIS_POSTPONEMENT]: 'Xin tạm hoãn khóa luận tốt nghiệp',
    [APPLICATION_TYPES.COURSE_WITHDRAWAL]: 'Rút môn học',
    [APPLICATION_TYPES.LEAVE_OF_ABSENCE]: 'Bảo lưu',
    [APPLICATION_TYPES.SUSPENSION]: 'Đình chỉ học'
};

// Nhóm các loại đơn theo danh mục
const APPLICATION_CATEGORIES = {
    ACADEMIC: [
        APPLICATION_TYPES.ATTENDANCE_EXEMPTION,
        APPLICATION_TYPES.TRANSCRIPT_REQUEST,
        APPLICATION_TYPES.GRADE_REVIEW,
        APPLICATION_TYPES.IMPROVEMENT_EXAM,
        APPLICATION_TYPES.ATTENDANCE_COMPLAINT,
        APPLICATION_TYPES.LUK_ATTENDANCE_SUPPORT
    ],
    TRANSFER: [
        APPLICATION_TYPES.CREDIT_TRANSFER,
        APPLICATION_TYPES.COURSE_SWITCH,
        APPLICATION_TYPES.MAJOR_TRANSFER,
        APPLICATION_TYPES.CAMPUS_TRANSFER,
        APPLICATION_TYPES.SPECIALIZED_COMBO_CHANGE
    ],
    ENROLLMENT: [
        APPLICATION_TYPES.WITHDRAWAL_REQUEST,
        APPLICATION_TYPES.READMISSION_REQUEST,
        APPLICATION_TYPES.COURSE_WITHDRAWAL,
        APPLICATION_TYPES.LEAVE_OF_ABSENCE,
        APPLICATION_TYPES.SUSPENSION
    ],
    FINANCIAL: [
        APPLICATION_TYPES.MONEY_WITHDRAWAL,
        APPLICATION_TYPES.COURSE_TRANSFER_REFUND
    ],
    GRADUATION: [
        APPLICATION_TYPES.EARLY_GRADUATION,
        APPLICATION_TYPES.THESIS_POSTPONEMENT
    ],
    EXAMINATION: [
        APPLICATION_TYPES.ONLINE_COURSE_ASSESSMENT,
        APPLICATION_TYPES.TOPJ_REGISTRATION
    ],
    OTHER: [
        APPLICATION_TYPES.OTHER_APPLICATIONS
    ]
};

// Helper functions
const getApplicationTypeLabel = (type) => {
    return APPLICATION_TYPE_LABELS[type] || type;
};

const getAllApplicationTypes = () => {
    return Object.values(APPLICATION_TYPES);
};

const getApplicationTypesByCategory = (category) => {
    return APPLICATION_CATEGORIES[category] || [];
};

const getApplicationTypeCategory = (type) => {
    for (const [category, types] of Object.entries(APPLICATION_CATEGORIES)) {
        if (types.includes(type)) {
            return category;
        }
    }
    return 'OTHER';
};

module.exports = {
    APPLICATION_TYPES,
    APPLICATION_TYPE_LABELS,
    APPLICATION_CATEGORIES,
    getApplicationTypeLabel,
    getAllApplicationTypes,
    getApplicationTypesByCategory,
    getApplicationTypeCategory
};
