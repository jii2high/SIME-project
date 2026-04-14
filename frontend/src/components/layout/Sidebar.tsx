'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const menuItems = {
  siswa: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Katalog Ekskul', href: '/dashboard/ekstrakurikuler', icon: '📋' },
    { label: 'Pendaftaran Saya', href: '/dashboard/pendaftaran/saya', icon: '📝' },
    { label: 'Jadwal', href: '/dashboard/jadwal', icon: '📅' },
  ],
  ketua_ekskul: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Ekskul Saya', href: '/dashboard/ekstrakurikuler', icon: '📋' },
    { label: 'Pendaftaran', href: '/dashboard/pendaftaran', icon: '📝' },
    { label: 'Jadwal', href: '/dashboard/jadwal', icon: '📅' },
    { label: 'Laporan', href: '/dashboard/laporan', icon: '📄' },
  ],
  bph: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Semua Ekskul', href: '/dashboard/ekstrakurikuler', icon: '📋' },
    { label: 'Pendaftaran', href: '/dashboard/pendaftaran', icon: '📝' },
    { label: 'Jadwal', href: '/dashboard/jadwal', icon: '📅' },
    { label: 'Laporan', href: '/dashboard/laporan', icon: '📄' },
    { label: 'Users', href: '/dashboard/users', icon: '👥' },
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Ekstrakurikuler', href: '/dashboard/ekstrakurikuler', icon: '📋' },
    { label: 'Pendaftaran', href: '/dashboard/pendaftaran', icon: '📝' },
    { label: 'Jadwal', href: '/dashboard/jadwal', icon: '📅' },
    { label: 'Laporan', href: '/dashboard/laporan', icon: '📄' },
    { label: 'Users', href: '/dashboard/users', icon: '👥' },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const role = user?.roles[0] || 'siswa';
  const items = menuItems[role as keyof typeof menuItems] || menuItems.siswa;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-950 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          SI
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">SIME</h1>
          <p className="text-gray-500 text-[10px] leading-tight">SMKN 1 Kota Bekasi</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
