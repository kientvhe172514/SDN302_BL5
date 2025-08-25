// code mau
const jwt = require("jsonwebtoken");
const { secret } = require("../config/secret");
const userService = require("../services/UserService");

// Fallback JWT secret if not provided in environment
const JWT_SECRET = secret.token_secret || "your_jwt_secret";
class UserController {
  login = async (req, res, next) => {
    try {
      const userData = req.body.values;
      const user = await userService.checkUser(userData);
      if (!user.success) {
        res.status(400).json({
          message: user.message,
          success: user.success
        });
        return;
      }
      const accessToken = jwt.sign(
        {
          userId: user.data._id,
          email: user.data.email,
          fullname: user.data.fullName,
          role: user.data.role,
          avatar: user.data.avatar || ""
        },
        JWT_SECRET,
        { expiresIn: "2d" }
      );

      // Trả về thông tin user không bao gồm password
      const userResponse = {
        _id: user.data._id,
        email: user.data.email,
        fullName: user.data.fullName,
        dateOfBirth: user.data.dateOfBirth,
        phoneNumber: user.data.phoneNumber,
        avatar: user.data.avatar,
        role: user.data.role,
        createdAt: user.data.createdAt,
        updatedAt: user.data.updatedAt
      };

      res.status(200).json({
        success: true,
        access_token: accessToken,
        user: userResponse
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
        status: 400,
      });
      return;
    }
  };

  addUser = async (req, res, next) => {
    try {
      const newUser = req.body.values;
      const result = await userService.addUser(newUser);
      if (!result.data) {
        res.status(400).json({
          success: result.success,
          message: result.message,
        });
        return;
      }

      res.status(201).json({
        success: result.success,
        data: result.data,
        message: "add user successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: 400,
      });
    }
  };

  getAllUser = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || ''
      const skip = (page - 1) * 10;
      const user = await userService.getAllUser(page, limit, skip, search);
      if (!user.success) {
        res.status(400).json({
          success: user.success,
          message: user.message,
          status: 400
        })

        return;
      }

      res.status(200).json({
        status: 200,
        success: user.success,
        data: {
          users: user.data,
          pagination: user.pagination
        },
        message: user.message,
      });
    } catch (error) {
      res.status(500).json({
        message: error,
        status: 400,
      });
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const updateData = req.body;

      const result = await userService.updateProfile(userId, updateData);

      if (!result.success) {
        res.status(400).json({
          success: result.success,
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        success: result.success,
        data: result.data,
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: 500,
      });
    }
  };

  getUserProfile = async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const result = await userService.getUserById(userId);

      if (!result.success) {
        res.status(400).json({
          success: result.success,
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        success: result.success,
        data: result.data,
        message: "Lấy dữ liệu Profile thành công",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: 500,
      });
    }
  };
}

module.exports = new UserController();
