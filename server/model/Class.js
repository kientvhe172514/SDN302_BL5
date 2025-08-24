const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema(
  {
    classCode: {
      type: String,
      required: true,
      unique: true,
    },
    subject: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },
    ],
    semester: {
      type: String,
      required: true,
    },
    maxSize: {
      type: Number,
      default: 30,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
