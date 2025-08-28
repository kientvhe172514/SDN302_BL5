const express = require('express');
const router = express.Router();
const roomController = require('../controllers/Room.Controller');

// GET /api/rooms - Lấy tất cả phòng học
router.get('/', roomController.getAllRooms);

// GET /api/rooms/buildings - Lấy danh sách tòa nhà
router.get('/buildings', roomController.getBuildings);

// GET /api/rooms/:id - Lấy phòng theo ID
router.get('/:id', roomController.getRoomById);

// POST /api/rooms - Tạo phòng mới
router.post('/', roomController.createRoom);

// PUT /api/rooms/:id - Cập nhật phòng
router.put('/:id', roomController.updateRoom);

// DELETE /api/rooms/:id - Xóa phòng (soft delete)
router.delete('/:id', roomController.deleteRoom);

module.exports = router;