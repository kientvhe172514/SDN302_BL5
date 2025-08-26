'use client';
import * as React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { getSubjects } from '../../lib/services/timeschedule/timeschedule.service';
import { Subject } from '@/models/subject';

interface SubjectSelectionProps {
    selectedSubjects: string[];
    onSelectionChange: (selectedIds: string[]) => void;
}

export const SubjectSelection: React.FC<SubjectSelectionProps> = ({ selectedSubjects, onSelectionChange }) => {
    const [subjects, setSubjects] = React.useState<Subject[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchSubjects = async () => {
            setIsLoading(true);
            const result = await getSubjects({ limit: 100 });
            console.log("API response for subjects:", result);
            // SỬA LẠI Ở ĐÂY: Truy cập vào mảng `subjects` bên trong `data`
            if (result.status.toLowerCase() === 'success' && Array.isArray(result.data.subjects)) {
                setSubjects(result.data.subjects);
            } else {
                console.error("API did not return a valid subject array inside data.subjects:", result);
            }
            setIsLoading(false);
        };
        fetchSubjects();
    }, []);

    const handleCheckboxChange = (subjectId: string) => {
        const newSelection = selectedSubjects.includes(subjectId)
            ? selectedSubjects.filter(id => id !== subjectId)
            : [...selectedSubjects, subjectId];
        onSelectionChange(newSelection);
    };

    if (isLoading) {
        return <div className="border rounded-lg p-4 h-96 flex items-center justify-center">Đang tải danh sách môn học...</div>;
    }

    return (
        <div className="border rounded-lg p-4 h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Chọn môn học</h3>
            <div className="space-y-3">
                {subjects.map((subject) => (
                    <div key={subject._id} className="flex items-center gap-3">
                        <Checkbox.Root
                            id={`subject-${subject._id}`}
                            checked={selectedSubjects.includes(subject._id)}
                            onCheckedChange={() => handleCheckboxChange(subject._id)}
                            className="flex h-5 w-5 appearance-none items-center justify-center rounded bg-white data-[state=checked]:bg-blue-600 outline-none border"
                        >
                            <Checkbox.Indicator className="text-white">
                                <CheckIcon />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        <label htmlFor={`subject-${subject._id}`} className="text-sm select-none">
                            {subject.name}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};