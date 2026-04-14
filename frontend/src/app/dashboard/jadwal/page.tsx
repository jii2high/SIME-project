'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Jadwal, Ekstrakurikuler } from '@/lib/types';

export default function JadwalPage() {
  const { hasRole } = useAuth();
  const [data, setData] = useState<Jadwal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [ekskulList, setEkskulList] = useState<Ekstrakurikuler[]>([]);
  const [form, setForm] = useState({ ekstrakurikuler_id: '', hari: '', jam_mulai: '', jam_selesai: '', tempat: '', keterangan: '' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await api.get('/jadwal');
      setData(res.data.data || []);
      const ekskulRes = await api.get('/ekstrakurikuler?per_page=50');
      setEkskulList(ekskulRes.data.data || []);
    } catch { /* silent */ }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.post('/jadwal', { ...form, ekstrakurikuler_id: Number(form.ekstrakurikuler_id) });
      setShowForm(false);
      setForm({ ekstrakurikuler_id: '', hari: '', jam_mulai: '', jam_selesai: '', tempat: '', keterangan: '' });
      loadData();
    } catch { /* silent */ }
    setFormLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus jadwal ini?')) return;
    try { await api.delete(`/jadwal/${id}`); loadData(); } catch { /* silent */ }
  };

  const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const groupedByDay = dayOrder.reduce((acc, day) => {
    const items = data.filter(j => j.hari === day);
    if (items.length > 0) acc[day] = items;
    return acc;
  }, {} as Record<string, Jadwal[]>);

  const dayColors: Record<string, string> = {
    Senin: 'from-blue-600 to-blue-500',
    Selasa: 'from-purple-600 to-purple-500',
    Rabu: 'from-emerald-600 to-emerald-500',
    Kamis: 'from-amber-600 to-amber-500',
    Jumat: 'from-rose-600 to-rose-500',
    Sabtu: 'from-cyan-600 to-cyan-500',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Jadwal Kegiatan</h1>
          <p className="text-gray-500 text-sm mt-1">Jadwal seluruh kegiatan ekstrakurikuler</p>
        </div>
        {hasRole(['ketua_ekskul', 'admin']) && (
          <button onClick={() => setShowForm(true)} className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-600/25">
            + Tambah Jadwal
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="glass rounded-xl p-6 h-24 animate-pulse" />)}
        </div>
      ) : Object.keys(groupedByDay).length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-gray-600 text-lg">Belum ada jadwal kegiatan</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDay).map(([day, items]) => (
            <div key={day}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${dayColors[day] || 'from-gray-500 to-gray-400'}`} />
                <h3 className="text-white font-semibold">{day}</h3>
                <span className="text-gray-600 text-xs">{items.length} kegiatan</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((j) => (
                  <div key={j.id} className="glass rounded-xl p-5 hover:border-gray-600 transition-all group">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-white font-medium">{j.ekstrakurikuler?.nama}</h4>
                        <p className="text-gray-500 text-sm mt-1">📍 {j.tempat}</p>
                        <p className="text-blue-400 text-sm font-mono mt-2">🕐 {j.jam_mulai} - {j.jam_selesai}</p>
                        {j.keterangan && <p className="text-gray-600 text-xs mt-2 italic">{j.keterangan}</p>}
                      </div>
                      {hasRole(['ketua_ekskul', 'admin']) && (
                        <button onClick={() => handleDelete(j.id)} className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:bg-red-500/10 px-2 py-1 rounded transition-all">✕</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 glass rounded-2xl p-8 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Tambah Jadwal</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Ekskul</label>
                <select value={form.ekstrakurikuler_id} onChange={e => setForm({ ...form, ekstrakurikuler_id: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option value="">Pilih Ekskul</option>
                  {ekskulList.map(e => <option key={e.id} value={e.id}>{e.nama}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Hari</label>
                  <select value={form.hari} onChange={e => setForm({ ...form, hari: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                    <option value="">Pilih Hari</option>
                    {dayOrder.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Tempat</label>
                  <input type="text" value={form.tempat} onChange={e => setForm({ ...form, tempat: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Jam Mulai</label>
                  <input type="time" value={form.jam_mulai} onChange={e => setForm({ ...form, jam_mulai: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Jam Selesai</label>
                  <input type="time" value={form.jam_selesai} onChange={e => setForm({ ...form, jam_selesai: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Keterangan</label>
                <input type="text" value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="Opsional" />
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
