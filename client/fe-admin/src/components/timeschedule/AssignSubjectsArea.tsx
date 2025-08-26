'use client';
import * as React from 'react';
import { StudentSelection } from './StudentSelection';
import { SubjectSelection } from './SubjectSelection';
import { assignSubjectsToStudents } from '../../lib/services/timeschedule/timeschedule.service';

export const AssignSubjectsArea: React.FC = () => {
    const [selectedStudents, setSelectedStudents] = React.useState<string[]>([]);
    const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([]);
    const [semester, setSemester] = React.useState('Fall 2024');
    const [isLoading, setIsLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const handleSubmit = async () => {
        if (selectedStudents.length === 0 || selectedSubjects.length === 0) {
            setMessage('Vui lòng chọn ít nhất một sinh viên và một môn học.');
            return;
        }
        setIsLoading(true);
        setMessage('');

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
        setMessage(result.message);
        setIsLoading(false);
    };

    return (
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
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Gán môn học'}
                    </button>
                </div>
            </div>
            
            {message && <p className={`mb-4 text-center text-sm ${message.includes('thành công') ? 'text-green-700' : 'text-red-700'}`}>{message}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StudentSelection selectedStudents={selectedStudents} onSelectionChange={setSelectedStudents} />
                <SubjectSelection selectedSubjects={selectedSubjects} onSelectionChange={setSelectedSubjects} />
            </div>
        </div>
    );
};