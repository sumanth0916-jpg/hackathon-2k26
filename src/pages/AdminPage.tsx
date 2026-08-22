import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Report } from '../types';
import { getReports, deleteReport, updateReport } from '../services/storageService';
import { StatusBadge, TypeBadge } from '../components/common/StatusBadge';
import { LoadingState } from '../components/common/LoadingState';
import { Shield, Trash2, CheckCircle2, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { formatDatePretty } from '../utils/time';

export const AdminPage: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { showToast } = useNotifications();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently remove this report?')) return;
    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
      showToast('Report Deleted', 'The report was removed from the campus registry.', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, status: any) => {
    try {
      await updateReport(id, { status });
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      showToast('Status Updated', `Report status changed to ${status}.`, 'success');
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
        <Shield className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Admin Authorization Required</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          This portal is reserved for campus safety officers and administration.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="p-6 sm:p-8 rounded-3xl subtle-mesh-bg border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Campus Safety Administration</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Lost & Found Moderation Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit inventory, moderate flagged submissions, and update item statuses.
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-white text-slate-700 transition"
          title="Refresh table"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <LoadingState message="Loading Moderation Registry..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Item</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Reporter</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.imageUrl}
                          alt={r.title}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 max-w-[180px] truncate">{r.title}</p>
                          <span className="text-[10px] text-slate-400">ID: {r.id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <TypeBadge type={r.type} size="sm" />
                    </td>
                    <td className="p-4 font-medium text-slate-600">{r.category}</td>
                    <td className="p-4 text-slate-600">{r.userDisplayName}</td>
                    <td className="p-4 text-slate-500 truncate max-w-[140px]">{r.approximateLocation}</td>
                    <td className="p-4">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value)}
                        className="p-1 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
                      >
                        <option value="active">Active</option>
                        <option value="potential_match">Potential Match</option>
                        <option value="claim_pending">Claim Pending</option>
                        <option value="resolved">Reunited 🎉</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Remove report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
