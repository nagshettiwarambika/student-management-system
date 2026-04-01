const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil", "Electrical", "Other"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      enum: [1, 2, 3, 4],
    },
    gpa: {
      type: Number,
      min: [0, "GPA cannot be negative"],
      max: [10, "GPA cannot exceed 10"],
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Graduated"],
      default: "Active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
