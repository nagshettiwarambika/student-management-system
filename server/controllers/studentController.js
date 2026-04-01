const Student = require("../models/Student");

// @route   GET /api/students
const getStudents = async (req, res) => {
  try {
    const { search, department, year, status } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (department) filter.department = department;
    if (year) filter.year = Number(year);
    if (status) filter.status = status;

    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @route   GET /api/students/:id
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @route   POST /api/students
const createStudent = async (req, res) => {
  try {
    const { name, rollNumber, email, phone, department, year, gpa, status } = req.body;

    if (!name || !rollNumber || !email || !department || !year) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const existing = await Student.findOne({
      $or: [{ rollNumber }, { email }],
    });

    if (existing) {
      return res.status(400).json({
        message: existing.rollNumber === rollNumber
          ? "Roll number already exists."
          : "Email already registered.",
      });
    }

    const student = await Student.create({
      name,
      rollNumber,
      email,
      phone,
      department,
      year,
      gpa,
      status,
      createdBy: req.user._id,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @route   PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const { name, rollNumber, email, phone, department, year, gpa, status } = req.body;

    // Check for duplicate rollNumber or email (excluding current student)
    if (rollNumber !== student.rollNumber || email !== student.email) {
      const existing = await Student.findOne({
        _id: { $ne: req.params.id },
        $or: [{ rollNumber }, { email }],
      });
      if (existing) {
        return res.status(400).json({
          message: existing.rollNumber === rollNumber
            ? "Roll number already exists."
            : "Email already registered.",
        });
      }
    }

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { name, rollNumber, email, phone, department, year, gpa, status },
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @route   DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @route   GET /api/students/stats/overview
const getStats = async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const active = await Student.countDocuments({ status: "Active" });
    const graduated = await Student.countDocuments({ status: "Graduated" });
    const byDepartment = await Student.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);
    const byYear = await Student.aggregate([
      { $group: { _id: "$year", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ total, active, graduated, byDepartment, byYear });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

module.exports = { getStudents, getStudent, createStudent, updateStudent, deleteStudent, getStats };
