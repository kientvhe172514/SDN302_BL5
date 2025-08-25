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

  async getAll(page, limit, skip, filterSemster) {
    try {
      let filter = filterSemster
        ? { semester: { $regex: filterSemster, $options: "i" } }
        : {};
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

  async getById(id) {
    try {
      const classById = await Class.findById(id).populate(
        "subject",
        "_id subjectCode"
      );
      console.log(classById);
      if (!classById) {
        return {
          message: "class does not exist",
          success: false,
        };
      }

      return {
        data: classById,
        message: "get data successfully",
        success: true,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateClass(id, data) {
    try {
      const updateClass = await Class.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      ).populate("subject", "-_id subjectCode");

      if (!updateClass) {
        return {
          message: "class can not update",
          success: false,
        };
      }

      return {
        data: updateClass,
        message: "update class successfully",
        success: true,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async deleteClass(id) {
    try {
      const deleteClass = await Class.findByIdAndDelete(id);
      if(!deleteClass){
        return {
          message: "class can not delete",
          success: false,
        };
      }

      return {
        data: deleteClass,
        message: "delete class successfully",
        success: true,
      };


    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = new ClassService();
