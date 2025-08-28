export interface Class {
    _id: string,
    classCode:string,
    subject:{
        _id:string
        subjectCode:string
    },
    semester:string,
    maxSize:30
}

export interface ClassQuery {
    page?: number;
    limit?: number;
    search?: string;
}

export interface ClassListResponse {
    success: boolean;
    message?: string;
    data: {
        classes: Class[];
        total: number;
    };
}