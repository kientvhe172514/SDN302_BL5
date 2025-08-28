'use client';
import * as React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { getStudents } from '../../lib/services/timeschedule/timeschedule.service';
import { User } from '@/models/user/user.model';

interface StudentSelectionProps {
    selectedStudents: string[];
    onSelectionChange: (selectedIds: string[]) => void;
    // Thêm props filter từ component cha
    filterMajor: string;
    filterSemester: string;
}

export const StudentSelection: React.FC<StudentSelectionProps> = ({ 
    selectedStudents, 
    onSelectionChange,
    filterMajor,
    filterSemester
}) => {
    const [allStudents, setAllStudents] = React.useState<User[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const studentRes = await getStudents({ limit: 500 });
            if (studentRes.success) setAllStudents(studentRes.data.users);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    // Lọc danh sách sinh viên dựa trên props filter từ component cha
    const filteredStudents = React.useMemo(() => {
        return allStudents.filter(student => {
            const majorMatch = filterMajor === 'all' || student.major?._id === filterMajor;
            const semesterMatch = filterSemester === 'all' || student.currentSemester === Number(filterSemester);
            return majorMatch && semesterMatch;
        });
    }, [allStudents, filterMajor, filterSemester]);

    // Logic cho "Chọn tất cả"
    const handleSelectAll = () => {
        const allFilteredIds = filteredStudents.map(s => s._id);
        const areAllSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedStudents.includes(id));
        
        if (areAllSelected) {
            // Bỏ chọn tất cả những sinh viên đã lọc
            onSelectionChange(selectedStudents.filter(id => !allFilteredIds.includes(id)));
        } else {
            // Chọn tất cả những sinh viên đã lọc (không làm ảnh hưởng đến những lựa chọn cũ)
            onSelectionChange([...new Set([...selectedStudents, ...allFilteredIds])]);
        }
    };

    if (isLoading) {
        return <div className="border rounded-lg p-4 h-96 flex items-center justify-center">Đang tải...</div>;
    }

    return (
        <div className="border rounded-lg p-4 flex flex-col h-96">
            <h3 className="text-lg font-semibold mb-4">Chọn sinh viên</h3>
            
            {/* CHỌN TẤT CẢ */}
            <div className="flex items-center gap-3 p-2 border-t border-b">
                <Checkbox.Root
                    id="select-all-students"
                    checked={filteredStudents.length > 0 && filteredStudents.every(s => selectedStudents.includes(s._id))}
                    onCheckedChange={handleSelectAll}
                    className="flex h-5 w-5 appearance-none items-center justify-center rounded bg-white data-[state=checked]:bg-blue-600 outline-none border"
                >
                    <Checkbox.Indicator className="text-white"><CheckIcon /></Checkbox.Indicator>
                </Checkbox.Root>
                <label htmlFor="select-all-students" className="text-sm font-semibold select-none">
                    Chọn tất cả ({filteredStudents.length})
                </label>
            </div>
            
            {/* DANH SÁCH */}
            <div className="overflow-y-auto flex-1 mt-3">
                <div className="space-y-3">
                    {filteredStudents.map((student) => (
                        <div key={student._id} className="flex items-center gap-3">
                            <Checkbox.Root
                                id={`student-${student._id}`}
                                checked={selectedStudents.includes(student._id)}
                                onCheckedChange={() => onSelectionChange(
                                    selectedStudents.includes(student._id)
                                        ? selectedStudents.filter(id => id !== student._id)
                                        : [...selectedStudents, student._id]
                                )}
                                className="flex h-5 w-5 appearance-none items-center justify-center rounded bg-white data-[state=checked]:bg-blue-600 outline-none border"
                            >
                                <Checkbox.Indicator className="text-white"><CheckIcon /></Checkbox.Indicator>
                            </Checkbox.Root>
                            <label htmlFor={`student-${student._id}`} className="text-sm select-none">
                                {student.fullName}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};