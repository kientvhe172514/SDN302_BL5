const classService = require("../services/ClassService");

class ClassController {
  getAllClass = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const skip = (page - 1) * 10;
      const classes = await classService.getAll(page, limit, skip, search);
      if (!classes) {
        res.status(400).json({
          success: true,
          message: "get data successfully",
          status: 400,
        });

        return;
      }

      res.status(200).json({
        status: 200,
        success: true,
        data: {
          classes: classes.data,
          pagination: classes.pagination,
        },
        message: "get data success",
      });
    } catch (error) {
      res.status(500).json({
        message: error,
        status: 400,
      });
    }
  };

  addClass = async (req, res, next) => {
    try {
      const newData = req.body;
      const result = await classService.addClass(newData);
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
        message: "add class successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error,
        status: 400,
      });
    }
  };
}

module.exports = new ClassController();
