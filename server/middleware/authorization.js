const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "").trim();
    console.log('Auth middleware - Token received:', token ? 'Token exists' : 'No token');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Quyền truy cập bị từ chối",
      });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({
          success: false,
          message: "Không thể xác thực quyền truy cập",
        });
      }
      
      if (decoded) {
        console.log('Auth middleware - User authenticated:', decoded.userId);
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ success: false, message: "Token không hợp lệ" });
  }
};

module.exports = { checkAuth };
