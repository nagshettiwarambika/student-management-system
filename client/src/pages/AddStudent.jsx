import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createStudent } from "../utils/api";
import StudentForm from "../components/StudentForm";
import toast from "react-hot-toast";

const INITIAL = {
  name: "", rollNumber: "", email: "", phone: "",
  department: "", year: "", gpa: "", status: "Active",
};

export default function AddStudent() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createStudent(form);
      toast.success("Student added successfully!");
      navigate("/students");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/students" className="hover:text-blue-600 transition-colors">Students</Link>
        <span>›</span>
        <span className="text-slate-900 font-medium">Add Student</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Add New Student</h1>
        <p className="text-slate-500 text-sm mt-1">Fill in the details below to register a new student.</p>
      </div>

      <div className="card p-6">
        <StudentForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Add Student"
        />
      </div>
    </div>
  );
}
