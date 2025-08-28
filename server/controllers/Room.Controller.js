const Room = require('../model/Room');

const roomController = {
    // Lấy tất cả phòng học
    getAllRooms: async (req, res) => {
        try {
            const { page = 1, limit = 100, building, roomType, isActive = true } = req.query;
            const query = { isActive };
            if (building) {
                query.building = building;
            }
            if (roomType) {
                query.roomType = roomType;
            }
            const skip = (page - 1) * limit;
            
            const [rooms, total] = await Promise.all([
                Room.find(query)
                    .sort({ building: 1, floor: 1, roomCode: 1 })
                    .skip(skip)
                    .limit(parseInt(limit))
                    .lean(),
                Room.countDocuments(query)
            ]);
            res.json({
                success: true,
                message: "Rooms fetched successfully",
                data: {
                    rooms,
                    total,
                    pages: Math.ceil(total / limit),
                    currentPage: parseInt(page)
                }
            });
        } catch (error) {
            console.error('Error fetching rooms:', error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch rooms",
                error: error.message
            });
        }
    },
    // Lấy phòng theo ID
    getRoomById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const room = await Room.findById(id);
            
            if (!room) {
                return res.status(404).json({
                    success: false,
                    message: "Room not found"
                });
            }
            res.json({
                success: true,
                message: "Room fetched successfully",
                data: { room }
            });
        } catch (error) {
            console.error('Error fetching room:', error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch room",
                error: error.message
            });
        }
    },
    // Tạo phòng mới
    createRoom: async (req, res) => {
        try {
            const {
                roomCode,
                roomName,
                building,
                floor,
                capacity,
                roomType,
                facilities,
                description
            } = req.body;
            
            // Kiểm tra mã phòng đã tồn tại
            const existingRoom = await Room.findOne({ roomCode });
            if (existingRoom) {
                return res.status(400).json({
                    success: false,
                    message: "Room code already exists"
                });
            }
            
            const room = new Room({
                roomCode,
                roomName,
                building,
                floor,
                capacity,
                roomType,
                facilities,
                description
            });
            
            await room.save();
            
            res.status(201).json({
                success: true,
                message: "Room created successfully",
                data: { room }
            });
        } catch (error) {
            console.error('Error creating room:', error);
            res.status(500).json({
                success: false,
                message: "Failed to create room",
                error: error.message
            });
        }
    },

    // Cập nhật phòng
    updateRoom: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            
            const room = await Room.findByIdAndUpdate(
                id,
                { $set: updates },
                { new: true, runValidators: true }
            );
            
            if (!room) {
                return res.status(404).json({
                    success: false,
                    message: "Room not found"
                });
            }
            
            res.json({
                success: true,
                message: "Room updated successfully",
                data: { room }
            });
        } catch (error) {
            console.error('Error updating room:', error);
            res.status(500).json({
                success: false,
                message: "Failed to update room",
                error: error.message
            });
        }
    },

    // Xóa phòng (soft delete)
    deleteRoom: async (req, res) => {
        try {
            const { id } = req.params;
            
            const room = await Room.findByIdAndUpdate(
                id,
                { $set: { isActive: false } },
                { new: true }
            );
            
            if (!room) {
                return res.status(404).json({
                    success: false,
                    message: "Room not found"
                });
            }
            
            res.json({
                success: true,
                message: "Room deleted successfully",
                data: { room }
            });
        } catch (error) {
            console.error('Error deleting room:', error);
            res.status(500).json({
                success: false,
                message: "Failed to delete room",
                error: error.message
            });
        }
    },

    // Lấy danh sách tòa nhà
    getBuildings: async (req, res) => {
        try {
            const buildings = await Room.distinct('building', { isActive: true });
            
            res.json({
                success: true,
                message: "Buildings fetched successfully",
                data: { buildings }
            });
        } catch (error) {
            console.error('Error fetching buildings:', error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch buildings",
                error: error.message
            });
        }
    }
};

module.exports = roomController;