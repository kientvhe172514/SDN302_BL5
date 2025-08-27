export interface Application {
  _id: string;
  student: {
    _id: string;
    fullName: string;
    email: string;
    studentId: string;
  };
  applicationType: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  processedBy?: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationType {
  value: string;
  label: string;
}

export interface ApplicationCategory {
  category: string;
  label: string;
  types: ApplicationType[];
}

export interface ApplicationStats {
  _id: string;
  count: number;
}
