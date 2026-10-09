import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import AdminHeaderNav from '@/components/AdminHeaderNav';
import { Mail, FileText } from 'lucide-react';

export const revalidate = 0;

export default async function AdminReportsPage() {
  const admin = await verifyAdminAuth();
  if (!admin) redirect('/codersmansion/admin/login');

  const contactMessages = await db.contactMessage.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: { listing: true },
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminHeaderNav />
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-amber-400" /> Buyer Contact Inquiries
          </h1>
          <p className="text-xs text-slate-400 mt-1">Audit log of lead inquiries submitted to verified sellers.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Listing Target</th>
              <th className="p-4">Sender Name</th>
              <th className="p-4">Sender Email</th>
              <th className="p-4">Message Excerpt</th>
              <th className="p-4">Submitted At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {contactMessages.map((msg) => (
              <tr key={msg.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-white">{msg.listing?.title}</td>
                <td className="p-4 text-slate-300">{msg.senderName}</td>
                <td className="p-4 text-indigo-400">{msg.senderEmail}</td>
                <td className="p-4 text-slate-400 max-w-xs truncate">{msg.message}</td>
                <td className="p-4 text-slate-500">{new Date(msg.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
