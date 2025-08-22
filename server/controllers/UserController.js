// code mau
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const userService = require("../services/UserService");
class UserController {
  login = async (req, res, next) => {
    try {
      const userData = req.body;
      const user = await userService.checkUser(userData);
      if (!user.success) {
        res.status(400).json({
          message:user.message,
        });
        return;
      }
      const accessToken = jwt.sign(
        { email: user.data.email, role: user.data.role },
        JWT_SECRET,
        { expiresIn: "2d" }
      );
      res.status(200).json({
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
      const newUser = req.body;
      const result = await userService.addUser(newUser);
      if (!result.data) {
        res.status(400).json({
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
        message: error,
        status: 400,
      });
    }
  };
}

module.exports = new UserController();
