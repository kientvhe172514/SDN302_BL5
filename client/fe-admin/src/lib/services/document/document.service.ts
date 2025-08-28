import { Endpoints } from "@/lib/endpoints";
import {
  DocumentListResponse,
  DocumentUploadResponse,
  DocumentDeleteResponse,
  DocumentDownloadResponse,
  FileUploadState,
  FileUploadProgress,
} from "@/models/document";
import axiosService from "../config/axios.service";

class DocumentService {
  /**
   * Upload multiple documents for a subject
   */
  async uploadDocuments(
    subjectId: string,
    files: File[],
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("documents", file);
    });

    const response = await axiosService
      .getAxiosInstance()
      .post(Endpoints.Document.UPLOAD(subjectId), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress: FileUploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              ),
            };
            onProgress(progress);
          }
        },
      });
    return response.data;
  }

  /**
   * Get all documents for a subject
   */
  async getSubjectDocuments(subjectId: string): Promise<DocumentListResponse> {
    const response = await axiosService
      .getAxiosInstance()
      .get(Endpoints.Document.GET_BY_SUBJECT(subjectId));
    return response.data;
  }

  /**
   * Delete a specific document
   */
  async deleteDocument(
    subjectId: string,
    documentId: string
  ): Promise<DocumentDeleteResponse> {
    const response = await axiosService
      .getAxiosInstance()
      .delete(Endpoints.Document.DELETE(subjectId, documentId));
    return response.data;
  }

  /**
   * Download all documents as ZIP
   */
  async downloadAllDocumentsAsZip(subjectId: string): Promise<Blob> {
    const response = await axiosService
      .getAxiosInstance()
      .get(Endpoints.Document.DOWNLOAD_ZIP(subjectId), {
        responseType: "blob",
      });
    return response.data;
  }

  /**
   * Get download info for a single document
   */
  async getDocumentDownloadInfo(
    subjectId: string,
    documentId: string
  ): Promise<DocumentDownloadResponse> {
    const response = await axiosService
      .getAxiosInstance()
      .get(Endpoints.Document.DOWNLOAD_SINGLE(subjectId, documentId));
    return response.data;
  }

  /**
   * Download a single document
   */
  async downloadDocument(subjectId: string, documentId: string): Promise<void> {
    try {
      const downloadInfo = await this.getDocumentDownloadInfo(
        subjectId,
        documentId
      );
      
      // Create a temporary link to download the file
      const link = document.createElement("a");
      link.href = downloadInfo.data.fileUrl;
      link.download = downloadInfo.data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading document:", error);
      throw error;
    }
  }

  /**
   * Download all documents as ZIP with filename
   */
  async downloadAllDocumentsAsZipWithName(
    subjectId: string,
    subjectCode: string
  ): Promise<void> {
    try {
      const blob = await this.downloadAllDocumentsAsZip(subjectId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${subjectCode}_documents.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading ZIP:", error);
      throw error;
    }
  }

  /**
   * Clean up temporary files (admin only)
   */
  async cleanupTempFiles(): Promise<{ success: boolean; message: string }> {
    const response = await axiosService
      .getAxiosInstance()
      .delete(Endpoints.Document.CLEANUP);
    return response.data;
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "text/csv",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
    ];

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size must be less than 10MB. Current size: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB`,
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type not allowed. Allowed types: PDF, Word, Excel, PowerPoint, Text, Images, Archives`,
      };
    }

    return { isValid: true };
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Get file icon based on MIME type
   */
  getFileIcon(mimeType: string): string {
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("word")) return "📝";
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
      return "📊";
    if (mimeType.includes("powerpoint") || mimeType.includes("presentation"))
      return "📈";
    if (mimeType.includes("image")) return "🖼️";
    if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("7z"))
      return "📦";
    if (mimeType.includes("text")) return "📄";
    return "📎";
  }
}

export default new DocumentService();
