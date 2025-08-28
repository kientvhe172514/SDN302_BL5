"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Subject,
  SubjectFormData,
  SubjectValidationErrors,
} from "@/models/subject";
import { Input } from "../ui/input";
import DocumentManager from "./DocumentManager";
import subjectService from "@/lib/services/subject/subject.service";

interface SubjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: Subject;
  formData: SubjectFormData;
  errors: SubjectValidationErrors;
  isSubmitting: boolean;
  onFormDataChange: (
    field: keyof SubjectFormData,
    value: string | number
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDocumentsChange?: () => void | Promise<void>;
  onSubjectUpdate?: (updatedSubject: Subject) => void;
}

export default function SubjectForm({
  isOpen,
  onClose,
  subject,
  formData,
  errors,
  isSubmitting,
  onFormDataChange,
  onSubmit,
  onDocumentsChange,
  onSubjectUpdate,
}: SubjectFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={
          subject ? "max-w-4xl max-h-[90vh] overflow-y-auto" : "max-w-md"
        }
      >
        <DialogHeader>
          <DialogTitle>
            {subject ? "Chỉnh sửa môn học" : "Thêm môn học mới"}
          </DialogTitle>
        </DialogHeader>

        {subject ? (
          // Edit mode - show form and document manager
          <div className="space-y-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subjectCode">Mã môn học</Label>
                <Input
                  id="subjectCode"
                  value={formData.subjectCode}
                  onChange={(e) =>
                    onFormDataChange("subjectCode", e.target.value)
                  }
                  placeholder="VD: CS101"
                />
                {errors.subjectCode && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.subjectCode}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="name">Tên môn học</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => onFormDataChange("name", e.target.value)}
                  placeholder="VD: Lập trình cơ bản"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    onFormDataChange("description", e.target.value)
                  }
                  placeholder="Mô tả chi tiết về môn học"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="credits">Số tín chỉ</Label>
                <Input
                  id="credits"
                  value={formData.credits}
                  onChange={(e) => {
                    const value = e.target.value;
                    onFormDataChange(
                      "credits",
                      value === "" ? "" : parseInt(value)
                    );
                  }}
                  placeholder="VD: 3"
                />
                {errors.credits && (
                  <p className="text-sm text-red-500 mt-1">{errors.credits}</p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Đang xử lý..."
                    : subject
                    ? "Cập nhật"
                    : "Tạo"}
                </Button>
              </div>
            </form>

            {/* Document Manager Section */}
            <DocumentManager
              subjectId={subject._id}
              subjectCode={subject.subjectCode}
              documents={subject.documents}
              onDocumentsChange={async () => {
                // Reload subject data to get updated documents
                if (onDocumentsChange) {
                  await onDocumentsChange();
                }
                // Also reload the specific subject data for the modal
                try {
                  const updatedSubject = await subjectService.getSubjectById(
                    subject._id
                  );
                  // Update the editingSubject in parent component
                  if (updatedSubject?.data && onSubjectUpdate) {
                    onSubjectUpdate(updatedSubject.data);
                  }
                } catch (error) {
                  console.error("Error reloading subject data:", error);
                }
              }}
            />
          </div>
        ) : (
          // Create mode - show only form
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="subjectCode">Mã môn học</Label>
              <Input
                id="subjectCode"
                value={formData.subjectCode}
                onChange={(e) =>
                  onFormDataChange("subjectCode", e.target.value)
                }
                placeholder="VD: CS101"
              />
              {errors.subjectCode && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.subjectCode}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="name">Tên môn học</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onFormDataChange("name", e.target.value)}
                placeholder="VD: Lập trình cơ bản"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  onFormDataChange("description", e.target.value)
                }
                placeholder="Mô tả chi tiết về môn học"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="credits">Số tín chỉ</Label>
              <Input
                id="credits"
                value={formData.credits}
                onChange={(e) => {
                  const value = e.target.value;
                  onFormDataChange(
                    "credits",
                    value === "" ? "" : parseInt(value)
                  );
                }}
                placeholder="VD: 3"
              />
              {errors.credits && (
                <p className="text-sm text-red-500 mt-1">{errors.credits}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : subject ? "Cập nhật" : "Tạo"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
