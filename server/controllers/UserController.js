// code mau
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const userService = require("../services/UserService");
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
        { email: user.data.email, role: user.data.role, id: user.data._id },
        JWT_SECRET,
        { expiresIn: "2d" }
      );
      res.status(200).json({
        success:true,
        access_token: accessToken,
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
          success:result.success,
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
      const user = await userService.getAllUser(page,limit,skip,search);
      if(!user.success){
        res.status(400).json({
          success: user.success,
          message: user.message,
          status: 400
        })

        return;
      }

      res.status(200).json({
        status:200,
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
}

module.exports = new UserController();
