// code mau
const express = require("express");
const app = express();
const path = require("path");
const User = require("../model/User");

class UserService {
  async checkUser(user) {
    try {
      const userExist = await User.find({
        email: user.email,
        password: user.password,
      });
      return userExist;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = { UserService };
