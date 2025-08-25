// Subject data model
export interface Subject {
  _id: string;
  subjectCode: string;
  name: string;
  description: string;
  credits: number;
  createdAt: string;
  updatedAt: string;
}

// Subject statistics
export interface SubjectStats {
  totalSubjects: number;
  averageCredits: number;
  minCredits: number;
  maxCredits: number;
  subjectsByCredits: Array<{
    _id: number;
    count: number;
  }>;
}

// API Response types
export interface SubjectListResponse {
  status: string;
  message: string;
  data: {
    subjects: Subject[];
    totalPages: number;
    currentPage: number;
    total: number;
  };
}

export interface SubjectResponse {
  status: string;
  message: string;
  data: Subject;
}

export interface SubjectStatsResponse {
  status: string;
  message: string;
  data: SubjectStats;
}

// Request types
export interface CreateSubjectRequest {
  subjectCode: string;
  name: string;
  description: string;
  credits: number;
}

export interface UpdateSubjectRequest {
  subjectCode?: string;
  name?: string;
  description?: string;
  credits?: number;
}

// Filter types
export interface SubjectFilterByCredits {
  minCredits?: number;
  maxCredits?: number;
}

export interface SubjectQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Form types
export interface SubjectFormData {
  subjectCode: string;
  name: string;
  description: string;
  credits: number;
}

export interface SubjectValidationErrors {
  subjectCode?: string;
  name?: string;
  description?: string;
  credits?: string;
}

export interface SubjectFilters {
  searchTerm: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}
