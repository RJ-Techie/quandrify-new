import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import AdminHeaderNav from '@/components/AdminHeaderNav';
import { ShieldAlert, FileText } from 'lucide-react';

export const revalidate = 0;

export default async function AdminAuditLogsPage() {
  const admin = await verifyAdminAuth();
  if (!admin) redirect('/codersmansion/admin/login');

  const logs = await db.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminHeaderNav />
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" /> Admin Audit Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">Immutable security log of admin actions, status overrides, and moderation events.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Action</th>
              <th className="p-4">Admin Actor</th>
              <th className="p-4">Details</th>
              <th className="p-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-mono font-bold text-amber-400">{log.action}</td>
                <td className="p-4 text-slate-300">{log.actor}</td>
                <td className="p-4 text-slate-400">{log.details}</td>
                <td className="p-4 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
