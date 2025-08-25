export interface Subject {
  _id: string;
  subjectCode: string;
  name: string;
  description?: string;
  credits: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectStats {
  totalSubjects: number;
  subjectsByCredits: Array<{ _id: number; count: number }>;
  averageCredits: number;
}

export interface SubjectQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateSubjectRequest {
  subjectCode: string;
  name: string;
  description?: string;
  credits: number;
}

export interface UpdateSubjectRequest {
  subjectCode?: string;
  name?: string;
  description?: string;
  credits?: number;
}

export interface SubjectFilterByCredits {
  minCredits?: number;
  maxCredits?: number;
}

// Response interfaces
export interface SubjectListResponse {
  subjects: Subject[];
  totalPages: number;
  currentPage: number;
  totalSubjects: number;
}

export interface SubjectResponse {
  status: string;
  message: string;
  data: Subject;
}

export interface SubjectListApiResponse {
  status: string;
  message: string;
  data: SubjectListResponse;
}

export interface SubjectStatsResponse {
  status: string;
  message: string;
  data: SubjectStats;
}

// Form interfaces
export interface SubjectFormData {
  subjectCode: string;
  name: string;
  description: string;
  credits: number;
}

// Validation interfaces
export interface SubjectValidationErrors {
  subjectCode?: string;
  name?: string;
  credits?: string;
}

// Filter interfaces
export interface SubjectFilters {
  search?: string;
  sortBy?: keyof Subject;
  sortOrder?: "asc" | "desc";
  credits?: number[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}
