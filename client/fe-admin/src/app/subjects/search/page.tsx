"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SubjectSearch from "@/components/subject/SubjectSearch";
import { Subject } from "@/models/subject";

export default function SubjectSearchPage() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    // Có thể chuyển hướng đến trang chi tiết hoặc thực hiện hành động khác
    router.push(`/subjects/${subject._id}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tìm kiếm Môn học</h1>
        <p className="text-muted-foreground">
          Tìm kiếm môn học theo mã môn học
        </p>
      </div>

      <div className="max-w-2xl">
        <SubjectSearch onSubjectSelect={handleSubjectSelect} />
      </div>

      {selectedSubject && (
        <div className="max-w-2xl p-4 border rounded-lg bg-muted/50">
          <h3 className="font-semibold mb-2">Môn học đã chọn:</h3>
          <p className="text-sm text-muted-foreground">
            {selectedSubject.subjectCode} - {selectedSubject.name}
          </p>
        </div>
      )}
    </div>
  );
}
