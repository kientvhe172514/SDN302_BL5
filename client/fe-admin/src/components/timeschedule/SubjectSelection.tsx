'use client';
import * as React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { getSubjects } from '../../lib/services/timeschedule/timeschedule.service';
import { Subject } from '@/models/subject';

interface SubjectSelectionProps {
    selectedSubjects: string[];
    onSelectionChange: (selectedIds: string[]) => void;
    // Thêm props filter từ component cha
    filterMajor: string;
    filterSemester: string;
}

export const SubjectSelection: React.FC<SubjectSelectionProps> = ({ 
    selectedSubjects, 
    onSelectionChange,
    filterMajor,
    filterSemester
}) => {
    const [allSubjects, setAllSubjects] = React.useState<Subject[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const subjectRes = await getSubjects({ limit: 500 });
            
            // Sử dụng logic kiểm tra từ code gốc
            if (subjectRes.status && subjectRes.status.toLowerCase() === 'success' && Array.isArray(subjectRes.data.subjects)) {
                setAllSubjects(subjectRes.data.subjects);
            } else {
                console.error("API did not return a valid subject array inside data.subjects:", subjectRes);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    // Lọc danh sách môn học dựa trên props filter từ component cha
    const filteredSubjects = React.useMemo(() => {
        return allSubjects.filter(subject => {
            const majorMatch = filterMajor === 'all' || subject.major?._id === filterMajor;
            const semesterMatch = filterSemester === 'all' || subject.semester === Number(filterSemester);
            return majorMatch && semesterMatch;
        });
    }, [allSubjects, filterMajor, filterSemester]);

    // Logic "Chọn tất cả"
    const handleSelectAll = () => {
        const allFilteredIds = filteredSubjects.map(s => s._id);
        const areAllSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedSubjects.includes(id));
        
        if (areAllSelected) {
            onSelectionChange(selectedSubjects.filter(id => !allFilteredIds.includes(id)));
        } else {
            onSelectionChange([...new Set([...selectedSubjects, ...allFilteredIds])]);
        }
    };

    if (isLoading) {
        return <div className="border rounded-lg p-4 h-96 flex items-center justify-center">Đang tải...</div>;
    }

    return (
        <div className="border rounded-lg p-4 flex flex-col h-96">
            <h3 className="text-lg font-semibold mb-4">Chọn môn học</h3>
            
            {/* CHỌN TẤT CẢ */}
            <div className="flex items-center gap-3 p-2 border-t border-b">
                <Checkbox.Root
                    id="select-all-subjects"
                    checked={filteredSubjects.length > 0 && filteredSubjects.every(s => selectedSubjects.includes(s._id))}
                    onCheckedChange={handleSelectAll}
                    className="flex h-5 w-5 appearance-none items-center justify-center rounded bg-white data-[state=checked]:bg-blue-600 outline-none border"
                >
                    <Checkbox.Indicator className="text-white"><CheckIcon /></Checkbox.Indicator>
                </Checkbox.Root>
                <label htmlFor="select-all-subjects" className="text-sm font-semibold select-none">
                    Chọn tất cả ({filteredSubjects.length})
                </label>
            </div>
            
            {/* DANH SÁCH */}
            <div className="overflow-y-auto flex-1 mt-3">
                <div className="space-y-3">
                    {filteredSubjects.map((subject) => (
                        <div key={subject._id} className="flex items-center gap-3">
                            <Checkbox.Root
                                id={`subject-${subject._id}`}
                                checked={selectedSubjects.includes(subject._id)}
                                onCheckedChange={() => onSelectionChange(
                                    selectedSubjects.includes(subject._id)
                                        ? selectedSubjects.filter(id => id !== subject._id)
                                        : [...selectedSubjects, subject._id]
                                )}
                                className="flex h-5 w-5 appearance-none items-center justify-center rounded bg-white data-[state=checked]:bg-blue-600 outline-none border"
                            >
                                <Checkbox.Indicator className="text-white"><CheckIcon /></Checkbox.Indicator>
                            </Checkbox.Root>
                            <label htmlFor={`subject-${subject._id}`} className="text-sm select-none">
                                {subject.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};