"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import subjectService from "@/lib/services/subject/subject.service";
import {
  Subject,
  UpdateSubjectRequest,
  SubjectValidationErrors,
} from "@/models/subject";

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id as string;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateSubjectRequest>({
    subjectCode: "",
    name: "",
    description: "",
    credits: 0,
  });
  const [errors, setErrors] = useState<SubjectValidationErrors>({});

  useEffect(() => {
    if (subjectId) {
      loadSubject();
    }
  }, [subjectId]);

  const loadSubject = async () => {
    try {
      setLoading(true);
      const response = await subjectService.getSubjectById(subjectId);
      setSubject(response.data);
    } catch (error) {
      toast.error("Không thể tải thông tin môn học");
      console.error("Error loading subject:", error);
      router.push("/subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (subject) {
      setFormData({
        subjectCode: subject.subjectCode,
        name: subject.name,
        description: subject.description,
        credits: subject.credits,
      });
      setErrors({});
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      await subjectService.updateSubject(subjectId, formData);
      toast.success("Cập nhật môn học thành công");
      setIsEditDialogOpen(false);
      loadSubject(); // Reload subject data
    } catch (error) {
      toast.error("Không thể cập nhật môn học");
      console.error("Error updating subject:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await subjectService.deleteSubject(subjectId);
      toast.success("Xóa môn học thành công");
      router.push("/subjects");
    } catch (error) {
      toast.error("Không thể xóa môn học");
      console.error("Error deleting subject:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: SubjectValidationErrors = {};

    if (!formData.subjectCode?.trim()) {
      newErrors.subjectCode = "Mã môn học là bắt buộc";
    }

    if (!formData.name?.trim()) {
      newErrors.name = "Tên môn học là bắt buộc";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    if (!formData.credits || formData.credits <= 0) {
      newErrors.credits = "Số tín chỉ phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handleUpdate();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Đang tải thông tin môn học...</div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Không tìm thấy môn học</p>
          <Button onClick={() => router.push("/subjects")} className="mt-4">
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/subjects")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{subject.name}</h1>
            <p className="text-muted-foreground">Chi tiết môn học</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleEdit} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa môn học "{subject.name}"? Hành động
                  này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Subject Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Mã môn học
                  </Label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {subject.subjectCode}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Số tín chỉ
                  </Label>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {subject.credits} TC
                    </Badge>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Tên môn học
                </Label>
                <p className="mt-1 text-lg font-medium">{subject.name}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Mô tả
                </Label>
                <p className="mt-1 text-sm leading-relaxed">
                  {subject.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  ID
                </Label>
                <p className="mt-1 text-sm font-mono bg-muted p-2 rounded">
                  {subject._id}
                </p>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Ngày tạo
                </Label>
                <p className="mt-1 text-sm">
                  {new Date(subject.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Cập nhật lần cuối
                </Label>
                <p className="mt-1 text-sm">
                  {new Date(subject.updatedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa môn học</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-subjectCode">Mã môn học</Label>
              <Input
                id="edit-subjectCode"
                value={formData.subjectCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subjectCode: e.target.value,
                  }))
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
              <Label htmlFor="edit-name">Tên môn học</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="VD: Lập trình cơ bản"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
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
              <Label htmlFor="edit-credits">Số tín chỉ</Label>
              <Input
                id="edit-credits"
                type="number"
                min="1"
                value={formData.credits}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    credits: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="VD: 3"
              />
              {errors.credits && (
                <p className="text-sm text-red-500 mt-1">{errors.credits}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
