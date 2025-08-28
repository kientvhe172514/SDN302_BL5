"use client";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import documentService from "@/lib/services/document/document.service";
import { Document, FileUploadProgress } from "@/models/document";
import {
  Download,
  FileText,
  FolderOpen,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface DocumentManagerProps {
  subjectId: string;
  subjectCode: string;
  documents?: Document[];
  onDocumentsChange: () => void | Promise<void>;
}

export default function DocumentManager({
  subjectId,
  subjectCode,
  documents = [],
  onDocumentsChange,
}: DocumentManagerProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] =
    useState<FileUploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      const validation = documentService.validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setIsUploadDialogOpen(true);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setIsUploading(true);
      await documentService.uploadDocuments(
        subjectId,
        selectedFiles,
        (progress) => setUploadProgress(progress)
      );

      toast.success(
        `${selectedFiles.length} tài liệu đã được upload thành công`
      );
      setIsUploadDialogOpen(false);
      setSelectedFiles([]);
      setUploadProgress(null);
      await onDocumentsChange();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Không thể upload tài liệu");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      setIsDeleting(documentId);
      await documentService.deleteDocument(subjectId, documentId);
      toast.success("Đã xóa tài liệu");
      await onDocumentsChange();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Không thể xóa tài liệu");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDownloadDocument = async (documentId: string) => {
    try {
      await documentService.downloadDocument(subjectId, documentId);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Không thể tải tài liệu");
    }
  };

  const handleDownloadAllAsZip = async () => {
    try {
      setIsDownloadingZip(true);
      await documentService.downloadAllDocumentsAsZipWithName(
        subjectId,
        subjectCode
      );
      toast.success("Đang tải file ZIP...");
    } catch (error) {
      console.error("Download ZIP error:", error);
      toast.error("Không thể tải file ZIP");
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Tài liệu môn học
            <Badge variant="secondary">{documents.length}</Badge>
          </CardTitle>
          <div className="flex gap-2">
            {documents.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAllAsZip}
                disabled={isDownloadingZip}
              >
                {isDownloadingZip ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Tải tất cả (ZIP)
              </Button>
            )}
            <Button size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Thêm tài liệu
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp,.zip,.rar,.7z"
          onChange={handleFileSelect}
          className="hidden"
        />

        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có tài liệu nào</p>
            <p className="text-sm">Nhấn &quot;Thêm tài liệu&quot; để upload</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">
                    {documentService.getFileIcon(doc.mimeType)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{doc.originalName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {documentService.formatFileSize(doc.fileSize)}
                      </span>
                      <span>•</span>
                      <span>{formatDate(doc.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadDocument(doc._id)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isDeleting === doc._id}
                      >
                        {isDeleting === doc._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn xóa tài liệu &quot;
                          {doc.originalName}&quot;? Hành động này không thể hoàn
                          tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteDocument(doc._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload tài liệu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Các file sẽ được upload:
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-muted rounded"
                  >
                    <span className="text-sm">
                      {documentService.getFileIcon(file.type)}
                    </span>
                    <span className="text-sm flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {documentService.formatFileSize(file.size)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {uploadProgress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Đang upload...</span>
                  <span>{uploadProgress.percentage}%</span>
                </div>
                <Progress value={uploadProgress.percentage} />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUploadDialogOpen(false);
                  setSelectedFiles([]);
                  setUploadProgress(null);
                }}
                disabled={isUploading}
              >
                Hủy
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || selectedFiles.length === 0}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang upload...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
