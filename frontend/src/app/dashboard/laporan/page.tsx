'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { LaporanKegiatan, Ekstrakurikuler, PaginationMeta } from '@/lib/types';

export default function LaporanPage() {
  const { hasRole } = useAuth();
  const [data, setData] = useState<LaporanKegiatan[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [ekskulList, setEkskulList] = useState<Ekstrakurikuler[]>([]);
  const [form, setForm] = useState({ ekstrakurikuler_id: '', judul: '', isi_laporan: '', tanggal_kegiatan: '' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { loadData(); }, [page]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/laporan', { params: { page, per_page: 10 } });
      setData(res.data.data || []);
      setMeta(res.data.meta || null);
      const ekskulRes = await api.get('/ekstrakurikuler?per_page=50');
      setEkskulList(ekskulRes.data.data || []);
    } catch { /* silent */ }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.post('/laporan', { ...form, ekstrakurikuler_id: Number(form.ekstrakurikuler_id) });
      setShowForm(false);
      setForm({ ekstrakurikuler_id: '', judul: '', isi_laporan: '', tanggal_kegiatan: '' });
      loadData();
    } catch { /* silent */ }
    setFormLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus laporan ini?')) return;
    try { await api.delete(`/laporan/${id}`); loadData(); } catch { /* silent */ }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Laporan Kegiatan</h1>
          <p className="text-gray-500 text-sm mt-1">Log laporan kegiatan ekstrakurikuler</p>
        </div>
        {hasRole(['ketua_ekskul', 'admin']) && (
          <button onClick={() => setShowForm(true)} className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-600/25">
            + Buat Laporan
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="glass rounded-xl p-6 h-32 animate-pulse" />)}
        </div>
      ) : data.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-gray-600 text-lg">Belum ada laporan kegiatan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((laporan) => (
            <div key={laporan.id} className="glass rounded-xl p-6 hover:border-gray-600 transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg">
                      {laporan.ekstrakurikuler?.nama}
                    </span>
                    <span className="text-gray-600 text-xs">
                      {laporan.tanggal_kegiatan ? new Date(laporan.tanggal_kegiatan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg">{laporan.judul}</h3>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-3">{laporan.isi_laporan}</p>
                  {laporan.user && (
                    <p className="text-gray-600 text-xs mt-3">Dibuat oleh: {laporan.user.name}</p>
                  )}
                </div>
                {hasRole(['ketua_ekskul', 'admin']) && (
                  <button onClick={() => handleDelete(laporan.id)} className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all border border-red-500/20">
                    Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg mx-4 glass rounded-2xl p-8 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Buat Laporan Kegiatan</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Ekskul</label>
                <select value={form.ekstrakurikuler_id} onChange={e => setForm({ ...form, ekstrakurikuler_id: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option value="">Pilih Ekskul</option>
                  {ekskulList.map(e => <option key={e.id} value={e.id}>{e.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Judul</label>
                <input type="text" value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Tanggal Kegiatan</label>
                <input type="date" value={form.tanggal_kegiatan} onChange={e => setForm({ ...form, tanggal_kegiatan: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Isi Laporan</label>
                <textarea value={form.isi_laporan} onChange={e => setForm({ ...form, isi_laporan: e.target.value })} rows={5} required className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700">Batal</button>
                <button type="submit" disabled={formLoading} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium disabled:opacity-50">{formLoading ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
