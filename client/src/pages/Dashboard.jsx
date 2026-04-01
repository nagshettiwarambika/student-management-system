import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStats, getStudents } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const StatCard = ({ label, value, icon, color }) => (
  <div className="card p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900">{value ?? "—"}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          getStats(),
          getStudents(),
        ]);
        setStats(statsRes.data);
        setRecentStudents(studentsRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deptColors = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500",
    "bg-amber-500", "bg-rose-500", "bg-cyan-500", "bg-indigo-500",
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your students.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Students"
          value={stats?.total}
          color="bg-blue-100"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label="Active Students"
          value={stats?.active}
          color="bg-green-100"
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Graduated"
          value={stats?.graduated}
          color="bg-violet-100"
          icon={
            <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatCard
          label="Departments"
          value={stats?.byDepartment?.length}
          color="bg-amber-100"
          icon={
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent students */}
        <div className="lg:col-span-2 card">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Students</h2>
            <Link to="/students" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </Link>
          </div>
          {recentStudents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-400 text-sm">No students yet.</p>
              <Link to="/students/add" className="btn-primary inline-flex mt-4 text-sm">
                Add first student
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentStudents.map((s) => (
                <div key={s._id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{s.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.rollNumber} · {s.department}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    s.status === "Active" ? "bg-green-100 text-green-700" :
                    s.status === "Graduated" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department breakdown */}
        <div className="card">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">By Department</h2>
          </div>
          {!stats?.byDepartment?.length ? (
            <div className="px-6 py-8 text-center text-slate-400 text-sm">No data yet</div>
          ) : (
            <div className="px-6 py-4 space-y-3">
              {stats.byDepartment.map((d, i) => {
                const pct = stats.total ? Math.round((d.count / stats.total) * 100) : 0;
                return (
                  <div key={d._id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium truncate max-w-[160px]">{d._id}</span>
                      <span className="text-slate-500">{d.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${deptColors[i % deptColors.length]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
