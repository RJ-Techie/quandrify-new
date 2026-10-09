'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  CreditCard,
  Crown,
  FileText,
  RotateCcw,
  BarChart3,
  Settings,
  ShieldAlert,
} from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/codersmansion/admin', icon: LayoutDashboard },
  { name: 'Listings', href: '/codersmansion/admin/listings', icon: Layers },
  { name: 'Payments', href: '/codersmansion/admin/payments', icon: CreditCard },
  { name: 'Top Spots', href: '/codersmansion/admin/top-spots', icon: Crown },
  { name: 'Reports', href: '/codersmansion/admin/reports', icon: FileText },
  { name: 'Refunds', href: '/codersmansion/admin/refunds', icon: RotateCcw },
  { name: 'Analytics', href: '/codersmansion/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/codersmansion/admin/settings', icon: Settings },
  { name: 'Audit Logs', href: '/codersmansion/admin/audit-logs', icon: ShieldAlert },
];

export default function AdminHeaderNav() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 px-4 py-3 mb-8 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto flex items-center gap-2">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
