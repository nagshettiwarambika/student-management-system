import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getStudent, updateStudent } from "../utils/api";
import StudentForm from "../components/StudentForm";
import toast from "react-hot-toast";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getStudent(id)
      .then((res) => {
        const s = res.data;
        setForm({
          name: s.name,
          rollNumber: s.rollNumber,
          email: s.email,
          phone: s.phone || "",
          department: s.department,
          year: String(s.year),
          gpa: String(s.gpa),
          status: s.status,
        });
      })
      .catch(() => {
        toast.error("Failed to load student.");
        navigate("/students");
      })
      .finally(() => setFetching(false));
  }, [id, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStudent(id, form);
      toast.success("Student updated successfully!");
      navigate("/students");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update student.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/students" className="hover:text-blue-600 transition-colors">Students</Link>
        <span>›</span>
        <span className="text-slate-900 font-medium">Edit Student</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Edit Student</h1>
        <p className="text-slate-500 text-sm mt-1">Update the student information below.</p>
      </div>

      <div className="card p-6">
        <StudentForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Update Student"
        />
      </div>
    </div>
  );
}
