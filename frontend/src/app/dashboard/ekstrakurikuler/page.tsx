'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Ekstrakurikuler, PaginationMeta } from '@/lib/types';
import Link from 'next/link';

export default function EkstrakurikulerPage() {
  const { hasRole } = useAuth();
  const [data, setData] = useState<Ekstrakurikuler[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ nama: '', deskripsi: '', hari_kegiatan: '', jam_mulai: '', jam_selesai: '', tempat: '', kuota: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadData();
  }, [page, search]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ekstrakurikuler', { params: { page, search, per_page: 9 } });
      setData(res.data.data || []);
      setMeta(res.data.meta || null);
    } catch { /* silent */ }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      await api.post('/ekstrakurikuler', {
        ...form,
        kuota: form.kuota ? parseInt(form.kuota) : null,
      });
      setShowCreate(false);
      setForm({ nama: '', deskripsi: '', hari_kegiatan: '', jam_mulai: '', jam_selesai: '', tempat: '', kuota: '' });
      loadData();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setFormError(axiosError.response?.data?.message || 'Gagal membuat ekstrakurikuler.');
    }
    setFormLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus ekstrakurikuler ini?')) return;
    try {
      await api.delete(`/ekstrakurikuler/${id}`);
      loadData();
    } catch { /* silent */ }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ekstrakurikuler</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar semua ekstrakurikuler yang tersedia</p>
        </div>
        {hasRole('admin') && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-600/25"
          >
            + Tambah Ekskul
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          placeholder="Cari ekskul..."
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-800 rounded w-full mb-2" />
              <div className="h-3 bg-gray-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((ekskul) => (
            <Link
              key={ekskul.id}
              href={`/dashboard/ekstrakurikuler/${ekskul.id}`}
              className="glass rounded-xl p-6 hover:border-gray-600 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center text-2xl border border-gray-700 group-hover:border-blue-500/30 transition-colors">
                  📋
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-lg border ${
                  ekskul.status === 'aktif' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                }`}>
                  {ekskul.status}
                </span>
              </div>
              <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">{ekskul.nama}</h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">{ekskul.deskripsi}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <span>📅 {ekskul.hari_kegiatan || '-'}</span>
                <span>📍 {ekskul.tempat || '-'}</span>
              </div>
              {ekskul.ketua && (
                <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {ekskul.ketua.name?.charAt(0)}
                  </div>
                  <span className="text-gray-400 text-xs">Ketua: {ekskul.ketua.name}</span>
                </div>
              )}
              {hasRole('admin') && (
                <div className="mt-3 pt-3 border-t border-gray-800 flex gap-2" onClick={(e) => e.preventDefault()}>
                  <button
                    onClick={() => handleDelete(ekskul.id)}
                    className="text-xs px-3 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {data.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Tidak ada ekstrakurikuler ditemukan</p>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                p === page ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg mx-4 glass rounded-2xl p-8 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Tambah Ekstrakurikuler</h2>
            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">{formError}</div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Nama Ekskul</label>
                <input type="text" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Deskripsi</label>
                <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Hari</label>
                  <input type="text" value={form.hari_kegiatan} onChange={e => setForm({ ...form, hari_kegiatan: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="Senin" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Tempat</label>
                  <input type="text" value={form.tempat} onChange={e => setForm({ ...form, tempat: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Jam Mulai</label>
                  <input type="time" value={form.jam_mulai} onChange={e => setForm({ ...form, jam_mulai: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Jam Selesai</label>
                  <input type="time" value={form.jam_selesai} onChange={e => setForm({ ...form, jam_selesai: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Kuota</label>
                  <input type="number" value={form.kuota} onChange={e => setForm({ ...form, kuota: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">Batal</button>
                <button type="submit" disabled={formLoading} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium disabled:opacity-50">{formLoading ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
