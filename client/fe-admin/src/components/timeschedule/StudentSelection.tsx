'use client';
import * as React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { getStudents } from '../../lib/services/timeschedule/timeschedule.service';
import { User } from '@/models/user'; // Sử dụng interface User đã định nghĩa

interface StudentSelectionProps {
    selectedStudents: string[];
    onSelectionChange: (selectedIds: string[]) => void;
}

export const StudentSelection: React.FC<StudentSelectionProps> = ({ selectedStudents, onSelectionChange }) => {
    const [students, setStudents] = React.useState<User[]>([]); // Sử dụng User interface
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            const result = await getStudents({ limit: 100 }); // Lấy 100 sinh viên đầu tiên
            
            // Log dữ liệu thô từ API để bạn kiểm tra trong console (F12)
            console.log("API response for students:", result);

            // SỬA LẠI Ở ĐÂY: Truy cập vào mảng `users` bên trong `data`
            if (result.success && Array.isArray(result.data.users)) {
                setStudents(result.data.users);
            } else {
                // Xử lý trường hợp API trả về cấu trúc khác hoặc lỗi
                console.error("API did not return a valid student array inside data.users:", result);
            }
            setIsLoading(false);
        };
        fetchStudents();
    }, []);

    const handleCheckboxChange = (studentId: string) => {
        const newSelection = selectedStudents.includes(studentId)
            ? selectedStudents.filter(id => id !== studentId)
            : [...selectedStudents, studentId];
        onSelectionChange(newSelection);
    };

    if (isLoading) {
        return <div className="border rounded-lg p-4 h-96 flex items-center justify-center">Đang tải danh sách sinh viên...</div>;
    }

    return (
        <div className="border rounded-lg p-4 h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Chọn sinh viên</h3>
            <div className="space-y-3">
                {students.map((student) => (
                    <div key={student._id} className="flex items-center gap-3">
                        <Checkbox.Root
                            id={`student-${student._id}`}
                            checked={selectedStudents.includes(student._id)}
                            onCheckedChange={() => handleCheckboxChange(student._id)}
                            className="flex h-5 w-5 appearance-none items-center justify-center rounded bg-white data-[state=checked]:bg-blue-600 outline-none border"
                        >
                            <Checkbox.Indicator className="text-white">
                                <CheckIcon />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        <label htmlFor={`student-${student._id}`} className="text-sm select-none">
                            {student.fullName}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};