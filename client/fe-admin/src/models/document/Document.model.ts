// Document data model
export interface Document {
  _id: string;
  originalName: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

// API Response types
export interface DocumentListResponse {
  success: boolean;
  data: Document[];
}

export interface DocumentResponse {
  success: boolean;
  data: Document;
}

export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  data: Document[];
}

export interface DocumentDeleteResponse {
  success: boolean;
  message: string;
}

export interface DocumentDownloadResponse {
  success: boolean;
  data: {
    fileUrl: string;
    fileName: string;
    mimeType: string;
  };
}

// Request types
export interface UploadDocumentsRequest {
  files: File[];
}

// File upload types
export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadState {
  file: File;
  progress: FileUploadProgress;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

// Document filters
export interface DocumentFilters {
  searchTerm?: string;
  fileType?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Document statistics
export interface DocumentStats {
  totalDocuments: number;
  totalSize: number;
  documentsByType: Array<{
    type: string;
    count: number;
    totalSize: number;
  }>;
  recentUploads: Document[];
}
