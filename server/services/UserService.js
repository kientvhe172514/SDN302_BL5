// code mau
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const Major = require("../model/Major");
class UserService {
  async checkUser(user) {
    console.log(user.email);
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
      return {
        success: false,
        message: "Internal server error",
      };
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
        role: user.role,
      });
      await newUser.save();
      return { success: true, data: newUser };
    } catch (error) {
      return {
        success: false,
        message: "Internal server error",
      };
    }
  }

  async getAllUser(page, limit, skip, search) {
    try {
      const filter = search ? { email: { $regex: search, $options: "i" } } : {};

      const user = await User.find(filter)
        .populate('major', 'name') // Populate tên ngành học
        .skip(skip)
        .limit(limit)

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
      return {
        success: false,
        message: "Internal server error",
      };
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const { email, password, currentPassword, ...allowedUpdates } = updateData;

      const allowedFields = [
        "fullName",
        "dateOfBirth",
        "phoneNumber",
        "avatar",
      ];
      const filteredUpdates = {};

      Object.keys(allowedUpdates).forEach((key) => {
        if (allowedFields.includes(key) && allowedUpdates[key] !== undefined) {
          filteredUpdates[key] = allowedUpdates[key];
        }
      });

      if (password && currentPassword) {
        const passwordChangeResult = await this.changePassword(userId, currentPassword, password);
        if (!passwordChangeResult.success) {
          return passwordChangeResult;
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        filteredUpdates,
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return {
          success: false,
          message: "Không tìm thấy người dùng",
        };
      }

      const userData = updatedUser.toObject();
      if (userData.dateOfBirth) {
        userData.dateOfBirth = userData.dateOfBirth.toISOString().split("T")[0];
      }

      return {
        success: true,
        message: "Cập nhật thông tin cá nhân thành công!",
        data: userData,
      };
    } catch (error) {
      return {
        success: false,
        message: "Cập nhật thất bại",
      };
    }
  }

  // if (
  //         allowedUpdates.hasOwnProperty('dateOfBirth') &&
  //         (!allowedUpdates.dateOfBirth || allowedUpdates.dateOfBirth.trim() === "")
  //       ) {
  //         return {
  //           success: false,
  //           message: "Ngày sinh không được để trống",
  //         };
  //       }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return {
          success: false,
          message: "Không tìm thấy người dùng",
        };
      }

      const userData = user.toObject();
      if (userData.dateOfBirth) {
        userData.dateOfBirth = userData.dateOfBirth.toISOString().split("T")[0];
      }

      return {
        success: true,
        data: userData,
      };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        message: "Lấy dữ liệu thất bại",
      };
    }
  }
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          message: "Không tìm thấy người dùng",
        };
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return {
          success: false,
          message: "Mật khẩu hiện tại không đúng",
        };
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return {
          success: false,
          message: "Mật khẩu mới không được trùng với mật khẩu cũ",
        };
      }

      user.password = newPassword;
      await user.save();

      return {
        success: true,
        message: "Đổi mật khẩu thành công!",
      };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        message: "Đổi mật khẩu thất bại",
      };
    }
  }
}



module.exports = new UserService();
