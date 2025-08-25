"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Subject, SubjectFormData, SubjectValidationErrors } from "@/models/subject";

interface SubjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: Subject;
  formData: SubjectFormData;
  errors: SubjectValidationErrors;
  isSubmitting: boolean;
  onFormDataChange: (field: keyof SubjectFormData, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
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
}: SubjectFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {subject ? "Chỉnh sửa môn học" : "Thêm môn học mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subjectCode">Mã môn học</Label>
            <Input
              id="subjectCode"
              value={formData.subjectCode}
              onChange={(e) => onFormDataChange("subjectCode", e.target.value)}
              placeholder="VD: CS101"
            />
            {errors.subjectCode && (
              <p className="text-sm text-red-500 mt-1">{errors.subjectCode}</p>
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
              onChange={(e) => onFormDataChange("description", e.target.value)}
              placeholder="Mô tả chi tiết về môn học"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="credits">Số tín chỉ</Label>
            <Input
              id="credits"
              type="number"
              min="1"
              value={formData.credits}
              onChange={(e) => onFormDataChange("credits", parseInt(e.target.value) || 0)}
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
      </DialogContent>
    </Dialog>
  );
}
