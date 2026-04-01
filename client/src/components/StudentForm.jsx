const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
  "Other",
];

export default function StudentForm({ form, onChange, onSubmit, loading, submitLabel = "Save" }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Personal Info */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="e.g. Rahul Sharma"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label">Roll Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="rollNumber"
              value={form.rollNumber}
              onChange={onChange}
              placeholder="e.g. CS2024001"
              className="input-field font-mono"
              required
            />
          </div>
          <div>
            <label className="label">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="student@example.com"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="e.g. 9876543210"
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Academic Info */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Academic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Department <span className="text-red-500">*</span></label>
            <select name="department" value={form.department} onChange={onChange} className="input-field" required>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Year <span className="text-red-500">*</span></label>
            <select name="year" value={form.year} onChange={onChange} className="input-field" required>
              <option value="">Select year</option>
              <option value="1">Year 1 (First Year)</option>
              <option value="2">Year 2 (Second Year)</option>
              <option value="3">Year 3 (Third Year)</option>
              <option value="4">Year 4 (Fourth Year)</option>
            </select>
          </div>
          <div>
            <label className="label">GPA / CGPA</label>
            <input
              type="number"
              name="gpa"
              value={form.gpa}
              onChange={onChange}
              placeholder="0.0 – 10.0"
              step="0.01"
              min="0"
              max="10"
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select name="status" value={form.status} onChange={onChange} className="input-field">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
