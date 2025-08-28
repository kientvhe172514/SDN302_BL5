export interface Room {
    _id: string;
    roomCode: string;
    roomName: string;
    building: string;
    floor: number;
    capacity: number;
    roomType: 'classroom' | 'lab' | 'seminar' | 'auditorium' | 'computer_lab';
    facilities: string[];
    isActive: boolean;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface RoomQuery {
    page?: number;
    limit?: number;
    building?: string;
    roomType?: string;
    isActive?: boolean;
}

export interface RoomListResponse {
    success: boolean;
    message: string;
    data: {
        rooms: Room[];
        total: number;
        pages: number;
        currentPage: number;
    };
}