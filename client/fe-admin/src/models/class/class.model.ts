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