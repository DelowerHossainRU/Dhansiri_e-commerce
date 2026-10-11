import React, { useState, useEffect } from 'react';
import { ScrollText, ShieldAlert } from 'lucide-react';
import api from '../../api/client';
import { formatDateTime } from '../../utils/format';
import { Skeleton } from '../../components/common/Skeleton';

export const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/audit-logs');
        if (res.success && res.data) {
          setLogs(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs uppercase tracking-widest font-bold block mb-1 text-emerald-800">
          Governance & Compliance
        </span>
        <h1 className="font-serif-display text-2xl font-bold text-slate-900">
          Administrative Security Audit Trail
        </h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-xs overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Action Event</th>
              <th className="p-3.5">Module</th>
              <th className="p-3.5">Operated By</th>
              <th className="p-3.5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}><td colSpan={5} className="p-4"><Skeleton className="h-6 w-full" /></td></tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xs text-slate-500">
                  No system modifications logged yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 text-slate-500 whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">{log.action}</td>
                  <td className="p-3.5 font-semibold text-emerald-800">{log.module}</td>
                  <td className="p-3.5 text-slate-700">{log.userName || log.userEmail || 'System Admin'}</td>
                  <td className="p-3.5 text-slate-600">{log.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
