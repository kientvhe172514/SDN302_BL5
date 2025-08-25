const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

const checkAuth = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Quyền truy cập bị từ chối - Không tìm thấy thông tin người dùng",
        });
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Không có quyền truy cập - Vai trò không phù hợp",
        });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
  };
};

module.exports = { checkAuth };