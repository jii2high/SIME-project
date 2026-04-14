'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Pendaftaran, PaginationMeta } from '@/lib/types';

export default function PendaftaranPage() {
  const { hasRole } = useAuth();
  const [data, setData] = useState<Pendaftaran[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [catatan, setCatatan] = useState('');

  useEffect(() => {
    loadData();
  }, [page, statusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: 10 };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/pendaftaran', { params });
      setData(res.data.data || []);
      setMeta(res.data.meta || null);
    } catch { /* silent */ }
    setLoading(false);
  };

  const handleReview = async (id: number, status: 'diterima' | 'ditolak') => {
    try {
      await api.put(`/pendaftaran/${id}/review`, { status, catatan_reviewer: catatan });
      setReviewingId(null);
      setCatatan('');
      loadData();
    } catch { /* silent */ }
  };

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
      <div>
        <h1 className="text-2xl font-bold text-white">Pendaftaran</h1>
        <p className="text-gray-500 text-sm mt-1">
          {hasRole('ketua_ekskul') ? 'Review pendaftaran anggota ekskul Anda' : 'Semua data pendaftaran'}
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['', 'pending', 'diterima', 'ditolak'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {s === '' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Pendaftar</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Ekskul</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                {hasRole(['ketua_ekskul', 'admin']) && (
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-800/50">
                    <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-gray-800 rounded animate-pulse w-full" /></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-600">Tidak ada data pendaftaran</td>
                </tr>
              ) : (
                data.map((p) => (
                  <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {p.user?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{p.user?.name}</p>
                          <p className="text-gray-500 text-xs">{p.user?.kelas || p.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{p.ekstrakurikuler?.nama}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-lg border capitalize ${statusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    {hasRole(['ketua_ekskul', 'admin']) && (
                      <td className="px-6 py-4">
                        {p.status === 'pending' ? (
                          reviewingId === p.id ? (
                            <div className="space-y-2 min-w-[200px]">
                              <input
                                type="text"
                                value={catatan}
                                onChange={e => setCatatan(e.target.value)}
                                placeholder="Catatan (opsional)"
                                className="w-full px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                              />
                              <div className="flex gap-2">
                                <button onClick={() => handleReview(p.id, 'diterima')} className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors">Terima</button>
                                <button onClick={() => handleReview(p.id, 'ditolak')} className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors">Tolak</button>
                                <button onClick={() => { setReviewingId(null); setCatatan(''); }} className="text-xs px-3 py-1.5 text-gray-400 hover:text-white transition-colors">×</button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => setReviewingId(p.id)} className="text-xs px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-500/30">
                              Review
                            </button>
                          )
                        ) : (
                          <span className="text-xs text-gray-600">Sudah direview</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
