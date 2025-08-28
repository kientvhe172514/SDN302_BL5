'use client';
import * as React from 'react';
import { StudentSelection } from './StudentSelection';
import { SubjectSelection } from './SubjectSelection';
import { assignSubjectsToStudents } from '../../lib/services/timeschedule/timeschedule.service';
import { CreateScheduleArea } from './CreateScheduleArea';
import { Major } from '@/models/major';

// --- DỮ LIỆU NGÀNH HỌC CỐ ĐỊNH ---
const majors: Major[] = [
    { _id: '68aec4d0461460172d946552', majorCode: 'SE', name: 'Software Engineering' },
    { _id: '68aec4d0461460172d946553', majorCode: 'MKT', name: 'Marketing' },
];

// Component Filter riêng biệt
const SharedFilter: React.FC<{
    filterMajor: string;
    filterSemester: string;
    onMajorChange: (major: string) => void;
    onSemesterChange: (semester: string) => void;
}> = ({ filterMajor, filterSemester, onMajorChange, onSemesterChange }) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngành học</label>
                    <select 
                        value={filterMajor} 
                        onChange={e => onMajorChange(e.target.value)} 
                        className="w-full border rounded p-2 text-sm"
                    >
                        <option value="all">Tất cả ngành</option>
                        {majors.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kỳ học</label>
                    <select 
                        value={filterSemester} 
                        onChange={e => onSemesterChange(e.target.value)} 
                        className="w-full border rounded p-2 text-sm"
                    >
                        <option value="all">Tất cả kỳ học</option>
                        {[...Array(9)].map((_, i) => <option key={i+1} value={i+1}>Kỳ {i+1}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export const TimeScheduleManagementArea: React.FC = () => {
    const [selectedStudents, setSelectedStudents] = React.useState<string[]>([]);
    const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([]);
    const [isLoadingAssign, setIsLoadingAssign] = React.useState(false);
    const [messageAssign, setMessageAssign] = React.useState('');
    
    // State cho bộ lọc chung
    const [filterMajor, setFilterMajor] = React.useState('all');
    const [filterSemester, setFilterSemester] = React.useState('all');
    
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
            {/* Phần 1: Tạo lớp học phần */}
            <CreateScheduleArea />
            
            {/* Phần 2: Gán môn học */}
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

                {/* Bộ lọc chung */}
                <SharedFilter 
                    filterMajor={filterMajor}
                    filterSemester={filterSemester}
                    onMajorChange={setFilterMajor}
                    onSemesterChange={setFilterSemester}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StudentSelection 
                        selectedStudents={selectedStudents} 
                        onSelectionChange={setSelectedStudents}
                        filterMajor={filterMajor}
                        filterSemester={filterSemester}
                    />
                    <SubjectSelection 
                        selectedSubjects={selectedSubjects} 
                        onSelectionChange={setSelectedSubjects}
                        filterMajor={filterMajor}
                        filterSemester={filterSemester}
                    />
                </div>
            </div>
        </div>
    );
};