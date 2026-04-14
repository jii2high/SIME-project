'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Ekstrakurikuler, Pendaftaran } from '@/lib/types';

export default function DashboardPage() {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState({ ekskul: 0, pendaftaran: 0, anggota: 0 });
  const [recentEkskul, setRecentEkskul] = useState<Ekstrakurikuler[]>([]);
  const [myPendaftaran, setMyPendaftaran] = useState<Pendaftaran[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const ekskulRes = await api.get('/ekstrakurikuler');
      setRecentEkskul(ekskulRes.data.data?.slice(0, 5) || []);
      setStats(prev => ({ ...prev, ekskul: ekskulRes.data.meta?.total || ekskulRes.data.data?.length || 0 }));

      if (hasRole('siswa')) {
        const pendRes = await api.get('/pendaftaran/saya');
        setMyPendaftaran(pendRes.data.data || []);
      }

      if (hasRole(['ketua_ekskul', 'bph', 'admin'])) {
        try {
          const pendRes = await api.get('/pendaftaran?status=pending');
          setStats(prev => ({ ...prev, pendaftaran: pendRes.data.meta?.total || 0 }));
        } catch { /* may not have access */ }
      }
    } catch { /* silent */ }
  };

  const statCards = [
    { label: 'Total Ekskul', value: stats.ekskul, icon: '📋', color: 'from-blue-600 to-blue-500' },
    ...(hasRole(['ketua_ekskul', 'bph', 'admin']) ? [
      { label: 'Pendaftaran Pending', value: stats.pendaftaran, icon: '⏳', color: 'from-amber-600 to-amber-500' },
    ] : []),
    ...(hasRole('siswa') ? [
      { label: 'Ekskul Diikuti', value: myPendaftaran.filter(p => p.status === 'diterima').length, icon: '✅', color: 'from-emerald-600 to-emerald-500' },
      { label: 'Menunggu Review', value: myPendaftaran.filter(p => p.status === 'pending').length, icon: '⏳', color: 'from-amber-600 to-amber-500' },
    ] : []),
  ];

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      diterima: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      ditolak: 'bg-red-500/10 text-red-400 border-red-500/30',
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {hasRole('admin') && 'Overview sistem SIME'}
          {hasRole('bph') && 'Monitoring seluruh ekstrakurikuler'}
          {hasRole('ketua_ekskul') && 'Kelola ekstrakurikuler Anda'}
          {hasRole('siswa') && 'Pantau status pendaftaran Anda'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="glass rounded-xl p-5 hover:border-gray-600 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.color}`} />
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-gray-500 text-sm mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ekskul List */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Ekstrakurikuler Aktif</h3>
          <div className="space-y-3">
            {recentEkskul.map((ekskul) => (
              <div key={ekskul.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center text-lg border border-gray-700">
                    📋
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{ekskul.nama}</p>
                    <p className="text-gray-500 text-xs">{ekskul.hari_kegiatan} • {ekskul.tempat}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg border ${
                  ekskul.status === 'aktif' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                }`}>
                  {ekskul.status}
                </span>
              </div>
            ))}
            {recentEkskul.length === 0 && (
              <p className="text-gray-600 text-sm text-center py-4">Belum ada data</p>
            )}
          </div>
        </div>

        {/* Siswa: My Pendaftaran / Others: Quick Info */}
        {hasRole('siswa') ? (
          <div className="glass rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Status Pendaftaran Saya</h3>
            <div className="space-y-3">
              {myPendaftaran.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                  <div>
                    <p className="text-white font-medium text-sm">{p.ekstrakurikuler?.nama}</p>
                    <p className="text-gray-500 text-xs">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-lg border capitalize ${statusBadge(p.status)}`}>
                    {p.status}
                  </span>
                </div>
              ))}
              {myPendaftaran.length === 0 && (
                <p className="text-gray-600 text-sm text-center py-4">Belum ada pendaftaran</p>
              )}
            </div>
          </div>
        ) : (
          <div className="glass rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Informasi</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <p className="text-blue-400 font-medium text-sm">Role Anda</p>
                <p className="text-white text-lg capitalize mt-1">{user?.roles[0]?.replace('_', ' ')}</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <p className="text-purple-400 font-medium text-sm">Email</p>
                <p className="text-white text-sm mt-1">{user?.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
