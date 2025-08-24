"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import subjectService from "@/lib/services/subject/subject.service";
import {
  Subject,
  SubjectStats as SubjectStatsType,
  CreateSubjectRequest,
  UpdateSubjectRequest,
  SubjectFormData,
  SubjectValidationErrors,
} from "@/models/subject";

// Import components
import SubjectStatsCards from "@/components/subject/SubjectStatsCards";
import SubjectFilters from "@/components/subject/SubjectFilters";
import SubjectTable from "@/components/subject/SubjectTable";
import SubjectForm from "@/components/subject/SubjectForm";
import SubjectPagination from "@/components/subject/SubjectPagination";

export default function SubjectsPage() {
  // State management
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [stats, setStats] = useState<SubjectStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [formData, setFormData] = useState<SubjectFormData>({
    subjectCode: "",
    name: "",
    description: "",
    credits: 0,
  });
  const [errors, setErrors] = useState<SubjectValidationErrors>({});

  // Load subjects
  const loadSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await subjectService.getAllSubjects({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        sortBy,
        sortOrder,
      });
      setSubjects(response.data.subjects || []);
      if (response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách môn học");
      console.error("Error loading subjects:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const response = await subjectService.getSubjectsStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }, []);

  // Load data on mount and when filters change
  useEffect(() => {
    loadSubjects();
    loadStats();
  }, [loadSubjects, loadStats]);

  // Handle form submission
  const handleSubmit = async (
    data: CreateSubjectRequest | UpdateSubjectRequest
  ) => {
    try {
      setIsSubmitting(true);
      if (editingSubject) {
        await subjectService.updateSubject(
          editingSubject._id,
          data as UpdateSubjectRequest
        );
        toast.success("Cập nhật môn học thành công");
      } else {
        await subjectService.createSubject(data as CreateSubjectRequest);
        toast.success("Tạo môn học thành công");
      }
      setIsFormOpen(false);
      setEditingSubject(null);
      resetForm();
      loadSubjects();
    } catch (error) {
      toast.error(
        editingSubject ? "Không thể cập nhật môn học" : "Không thể tạo môn học"
      );
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await subjectService.deleteSubject(id);
      toast.success("Xóa môn học thành công");
      loadSubjects();
    } catch (error) {
      toast.error("Không thể xóa môn học");
      console.error("Error deleting subject:", error);
    }
  };

  // Handle edit
  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      subjectCode: subject.subjectCode,
      name: subject.name,
      description: subject.description,
      credits: subject.credits,
    });
    setIsFormOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      subjectCode: "",
      name: "",
      description: "",
      credits: 0,
    });
    setErrors({});
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: SubjectValidationErrors = {};

    if (!formData.subjectCode.trim()) {
      newErrors.subjectCode = "Mã môn học là bắt buộc";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Tên môn học là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    if (formData.credits <= 0) {
      newErrors.credits = "Số tín chỉ phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(formData);
    }
  };

  // Handle form data change
  const handleFormDataChange = (
    field: keyof SubjectFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof SubjectValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý Môn học</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm môn học
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && <SubjectStatsCards stats={stats} />}

      {/* Filters */}
      <SubjectFilters
        searchTerm={searchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={setSearchTerm}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
      />

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách môn học</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : (
            <SubjectTable
              subjects={subjects}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <SubjectPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Subject Form Dialog */}
      <SubjectForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSubject(null);
          resetForm();
        }}
        subject={editingSubject || undefined}
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        onFormDataChange={handleFormDataChange}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
