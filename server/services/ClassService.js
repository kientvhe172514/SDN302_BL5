const Class = require("../model/Class");

class ClassService {
  async addClass(data) {
    try {
      const checkClass = await Class.findOne({ classCode: data.classCode });
      if (checkClass) {
        return {
          success: false,
          message: "Class code is exist",
        };
      }
      const newClass = await Class.create(data);
      await newClass.save();
      return {
        success: true,
        message: "add class successfully",
        data: newClass,
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  async getAll(page, limit, skip, search) {
    try {
        const filter = search ? { email: { $regex: search, $options: "i" } } : {};
        const classes = await Class.find(filter).skip(skip).limit(limit);
        const total = await Class.countDocuments();
        return {
        data: classes,
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

module.exports = new ClassService();
