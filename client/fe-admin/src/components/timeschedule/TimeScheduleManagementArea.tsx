'use client';
import * as React from 'react';
import { StudentSelection } from './StudentSelection';
import { SubjectSelection } from './SubjectSelection';
import { assignSubjectsToStudents } from '../../lib/services/timeschedule/timeschedule.service';
import { CreateScheduleArea } from './CreateScheduleArea';

export const TimeScheduleManagementArea: React.FC = () => {
    const [selectedStudents, setSelectedStudents] = React.useState<string[]>([]);
    const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([]);
    const [isLoadingAssign, setIsLoadingAssign] = React.useState(false);
    const [messageAssign, setMessageAssign] = React.useState('');
    const getCurrentSemester = (): string => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0 = January, 11 = December
    
        if (month >= 0 && month <= 3) { // Tháng 1 - 4: Kỳ Spring
            return `Spring ${year}`;
        } else if (month >= 4 && month <= 7) { // Tháng 5 - 8: Kỳ Summer
            return `Summer ${year}`;
        } else { // Tháng 9 - 12: Kỳ Fall
            return `Fall ${year}`;
        }
    };
    const [semester, setSemester] = React.useState(getCurrentSemester());
   
    const handleSubmitAssign = async () => {
        if (selectedStudents.length === 0 || selectedSubjects.length === 0) {
            setMessageAssign('Vui lòng chọn ít nhất một sinh viên và một môn học.');
            return;
        }
        setIsLoadingAssign(true);
        setMessageAssign('');

        const payload = {
            studentIds: selectedStudents,
            subjectIds: selectedSubjects,
            semester: semester,
        };

        const result = await assignSubjectsToStudents(payload);
        
        if (result.success) {
            setSelectedStudents([]);
            setSelectedSubjects([]);
        }
        setMessageAssign(result.message);
        setIsLoadingAssign(false);
    };

    return (
        <div className="space-y-8">
            {/* Phần 1: Gán môn học */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Gán môn học cho sinh viên</h1>
                    <div className="flex items-center gap-4">
                    <input 
                            type="text"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            placeholder="Nhập học kỳ, ví dụ: Fall 2024"
                            className="border rounded px-3 py-2"
                        />
                        <button
                            onClick={handleSubmitAssign}
                            disabled={isLoadingAssign}
                            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {isLoadingAssign ? 'Đang xử lý...' : 'Gán môn học'}
                        </button>
                    </div>
                </div>
                
                {messageAssign && <p className={`mb-4 text-center text-sm ${messageAssign.includes('thành công') ? 'text-green-700' : 'text-red-700'}`}>{messageAssign}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StudentSelection selectedStudents={selectedStudents} onSelectionChange={setSelectedStudents} />
                    <SubjectSelection selectedSubjects={selectedSubjects} onSelectionChange={setSelectedSubjects} />
                </div>
            </div>

            {/* Phần 2: Tạo lớp học phần */}
            <CreateScheduleArea />
        </div>
    );
};