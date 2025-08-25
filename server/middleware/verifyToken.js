const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { secret } = require("../config/secret");

// Fallback JWT secret if not provided in environment
const JWT_SECRET = secret.token_secret || "your_jwt_secret";
/**
 * 1. check if token exists
 * 2. if not token send res
 * 3. decode the token
 * 4. if valid next
 */

module.exports = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];

    if (!token) {
      return res.status(401).json({
        status: "fail",
        error: "You are not logged in"
      });
    }

    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    res.status(403).json({
      status: "fail",
      error: "Invalid token",
      details: error.message
    });
  }
};