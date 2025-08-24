// code mau
const User = require("../model/User");
const bcrypt = require("bcryptjs");
class UserService {
  async checkUser(user) {
    try {
      const userExist = await User.findOne({
        email: user.email,
      });
      if (!userExist) {
        return {
          success: false,
          message: "email does not exist",
        };
      }

      const isMatch = await bcrypt.compare(user.password, userExist.password);
      if (!isMatch) {
        return {
          success: false,
          message: "Incorrect password",
        };
      }
      return {
        success: true,
        data: userExist,
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  async addUser(user) {
    try {
      const checkUser = await User.findOne({ email: user.email });
      if (checkUser) {
        return { success: false, message: "User already exists" };
      }
      const newUser = await User.create({
        email: user.email,
        password: user.password,
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        phoneNumber: user.phoneNumber,
      });
      await newUser.save();
      return { success: true, data: newUser };
    } catch (error) {
      console.log(error.message);
    }
  }

  async getAllUser(page, limit, skip, search) {
    try {
      const filter = search ? { email: { $regex: search, $options: "i" } } : {};

      const user = await User.find(filter)
        .skip(skip)
        .limit(limit)
        .select("email fullName phoneNumber dateOfBirth role createdAt");

      const total = await User.countDocuments();
      if (!user) {
        return {
          success: false,
          message: "get data failed",
        };
      }

      return {
        success: true,
        message: "get data successfully",
        data: user,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new UserService();
