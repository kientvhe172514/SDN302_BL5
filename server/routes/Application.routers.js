const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/Application.controllers');
const verifyToken = require('../middleware/verifyToken');
const { checkAuth } = require('../middleware/authorization');

// Routes cho sinh viên (cần xác thực)
router.post('/', verifyToken, ApplicationController.createApplication); // Tạo đơn mới
router.get('/my-applications', verifyToken, ApplicationController.getMyApplications); // Lấy đơn của mình
router.get('/:id', verifyToken, ApplicationController.getApplicationById); // Xem chi tiết đơn
router.put('/:id', verifyToken, ApplicationController.updateApplication); // Cập nhật đơn của mình
router.delete('/:id', verifyToken, ApplicationController.deleteApplication); // Xóa đơn của mình

// Routes cho Admin/Teacher (cần quyền admin hoặc teacher)
router.get('/', verifyToken, checkAuth, ApplicationController.getAllApplications); // Lấy tất cả đơn
router.get('/student/:studentId', verifyToken, checkAuth, ApplicationController.getApplicationsByStudent); // Lấy đơn theo student
router.put('/:id/process', verifyToken, checkAuth, ApplicationController.processApplication); // Xử lý đơn (approve/reject)

// Routes thống kê (chỉ admin)
router.get('/stats/overview', verifyToken, checkAuth, ApplicationController.getApplicationStats); // Thống kê tổng quan
router.get('/stats/by-type', verifyToken, checkAuth, ApplicationController.getApplicationTypeStats); // Thống kê theo loại

// Routes cho việc lấy danh sách loại đơn (tất cả user có thể truy cập)
router.get('/types/all', ApplicationController.getApplicationTypes); // Lấy tất cả loại đơn
router.get('/types/category/:category', ApplicationController.getApplicationTypesByCategory); // Lấy loại đơn theo category
router.get('/types/categories', ApplicationController.getApplicationCategories); // Lấy tất cả categories

module.exports = router;
