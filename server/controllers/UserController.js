// code mau
const express = require("express");
const jwt = require("jsonwebtoken");
const { checkUser } = require("../services/UserService");

class UserController {
   login = (req, res, next) => {
    try {
      const { userData } = req.body;
      const user = checkUser(userData);
      if (!user) {
        const accessToken = jwt.sign(
          { email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "2d" }
        );
        res.status(400).json({
          access_token: accessToken,
        });
        return;
      }
      res.status(200).json({
        access_token: accessToken,
      });
    } catch (error) {
      res.status(400).json({
        message: error,
        status: 400,
      });
    }
  };
}

module.exports = UserController;
