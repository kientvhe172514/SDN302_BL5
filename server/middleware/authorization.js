const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer", "").trim();
    if (!token) {
      res.status(401).json({
        message: "Quyền truy cập bị từ chối",
      });
      return;
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (decoded) {
        next();
      }

      if (err) {
        res.status(401).json({
          message: "Không thể xác thực quyền truy cập",
        });
        return;
      }
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

module.exports = { checkAuth };
