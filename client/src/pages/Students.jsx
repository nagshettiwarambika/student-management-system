import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getStudents, deleteStudent } from "../utils/api";
import toast from "react-hot-toast";

const DEPARTMENTS = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil", "Electrical", "Other"];

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (department) params.department = department;
      if (year) params.year = year;
      if (status) params.status = status;
      const res = await getStudents(params);
      setStudents(res.data);
    } catch (err) {
      toast.error("Failed to load students.");
    } finally {
      setLoading(false);
    }
  }, [search, department, year, status]);

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteStudent(deleteId);
      toast.success("Student deleted successfully.");
      setDeleteId(null);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch(""); setDepartment(""); setYear(""); setStatus("");
  };

  const hasFilters = search || department || year || status;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Students</h1>
          <p className="text-slate-500 text-sm mt-1">{students.length} record{students.length !== 1 ? "s" : ""} found</p>
        </div>
        <Link to="/students/add" className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search name, roll no, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="input-field">
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          <select value={year} onChange={(e) => setYear(e.target.value)} className="input-field">
            <option value="">All Years</option>
            {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
          </select>
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium">
            × Clear all filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No students found</p>
            <p className="text-slate-400 text-sm mt-1">
              {hasFilters ? "Try adjusting your filters." : "Add your first student to get started."}
            </p>
            {!hasFilters && (
              <Link to="/students/add" className="btn-primary inline-flex mt-4">Add Student</Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Student</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-slate-600">Roll No</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-slate-600">Department</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-slate-600">Year</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-slate-600">GPA</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-slate-600">Status</th>
                  <th className="text-right px-6 py-3.5 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-bold">{s.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">{s.rollNumber}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{s.department}</td>
                    <td className="px-4 py-3.5 text-slate-600">Year {s.year}</td>
                    <td className="px-4 py-3.5">
                      <span className={`font-semibold ${s.gpa >= 8 ? "text-green-600" : s.gpa >= 6 ? "text-amber-600" : "text-red-500"}`}>
                        {s.gpa?.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={
                        s.status === "Active" ? "badge-active" :
                        s.status === "Graduated" ? "badge-graduated" : "badge-inactive"
                      }>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/students/edit/${s._id}`}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => setDeleteId(s._id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5C2.3 17.333 3.262 19 4.8 19z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center">Delete Student?</h3>
            <p className="text-slate-500 text-sm text-center mt-2">
              This action cannot be undone. The student record will be permanently removed.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1 flex items-center justify-center gap-2">
                {deleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
