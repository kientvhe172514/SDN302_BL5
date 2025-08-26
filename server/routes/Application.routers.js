const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/Application.controllers');
const { checkAuth } = require('../middleware/authorization');

// Routes cho Admin/Teacher (cần quyền admin hoặc teacher) - Đặt trước để tránh conflict
router.get('/', checkAuth, ApplicationController.getAllApplications); // Lấy tất cả đơn

// Routes cho sinh viên (cần xác thực)
router.post('/', checkAuth, ApplicationController.createApplication); // Tạo đơn mới
router.get('/my-applications', checkAuth, ApplicationController.getMyApplications); // Lấy đơn của mình
router.get('/:id', checkAuth, ApplicationController.getApplicationById); // Xem chi tiết đơn
router.put('/:id', checkAuth, ApplicationController.updateApplication); // Cập nhật đơn của mình
router.delete('/:id', checkAuth, ApplicationController.deleteApplication); // Xóa đơn của mình
router.get('/student/:studentId', checkAuth, ApplicationController.getApplicationsByStudent); // Lấy đơn theo student
router.put('/:id/process', checkAuth, ApplicationController.processApplication); // Xử lý đơn (approve/reject)

// Routes thống kê (chỉ admin)
router.get('/stats/overview', checkAuth, ApplicationController.getApplicationStats); // Thống kê tổng quan
router.get('/stats/by-type', checkAuth, ApplicationController.getApplicationTypeStats); // Thống kê theo loại

// Routes cho việc lấy danh sách loại đơn (tất cả user có thể truy cập)
router.get('/types/all', ApplicationController.getApplicationTypes); // Lấy tất cả loại đơn
router.get('/types/category/:category', ApplicationController.getApplicationTypesByCategory); // Lấy loại đơn theo category
router.get('/types/categories', ApplicationController.getApplicationCategories); // Lấy tất cả categories

module.exports = router;
