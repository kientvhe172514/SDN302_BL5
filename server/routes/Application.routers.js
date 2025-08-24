const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/Application.controllers');
const { verifyToken } = require('../middleware/verifyToken');
const { authorization } = require('../middleware/authorization');

// Middleware xác thực cho tất cả routes
router.use(verifyToken);

// Routes cho sinh viên
router.post('/', ApplicationController.createApplication); // Tạo đơn mới
router.get('/my-applications', ApplicationController.getMyApplications); // Lấy đơn của mình
router.get('/:id', ApplicationController.getApplicationById); // Xem chi tiết đơn
router.put('/:id', ApplicationController.updateApplication); // Cập nhật đơn của mình
router.delete('/:id', ApplicationController.deleteApplication); // Xóa đơn của mình

// Routes cho Admin/Teacher (cần quyền admin hoặc teacher)
router.get('/', authorization(['admin', 'teacher']), ApplicationController.getAllApplications); // Lấy tất cả đơn
router.get('/student/:studentId', authorization(['admin', 'teacher']), ApplicationController.getApplicationsByStudent); // Lấy đơn theo student
router.put('/:id/process', authorization(['admin', 'teacher']), ApplicationController.processApplication); // Xử lý đơn (approve/reject)

// Routes thống kê (chỉ admin)
router.get('/stats/overview', authorization(['admin']), ApplicationController.getApplicationStats); // Thống kê tổng quan
router.get('/stats/by-type', authorization(['admin']), ApplicationController.getApplicationTypeStats); // Thống kê theo loại

// Routes cho việc lấy danh sách loại đơn (tất cả user có thể truy cập)
router.get('/types/all', ApplicationController.getApplicationTypes); // Lấy tất cả loại đơn
router.get('/types/category/:category', ApplicationController.getApplicationTypesByCategory); // Lấy loại đơn theo category
router.get('/types/categories', ApplicationController.getApplicationCategories); // Lấy tất cả categories

module.exports = router;
