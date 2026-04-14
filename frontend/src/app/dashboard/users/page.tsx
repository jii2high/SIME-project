'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User, PaginationMeta } from '@/lib/types';

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', nisn: '', kelas: '', no_hp: '', role: 'siswa' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => { loadData(); }, [page, search, roleFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: 10 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await api.get('/users', { params });
      setData(res.data.data || []);
      setMeta(res.data.meta || null);
    } catch { /* silent */ }
    setLoading(false);
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', password: '', nisn: '', kelas: '', no_hp: '', role: 'siswa' });
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: '', nisn: user.nisn || '', kelas: user.kelas || '', no_hp: user.no_hp || '', role: user.roles[0] || 'siswa' });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (editingUser) {
        const payload: Record<string, string> = { ...form };
        if (!payload.password) delete payload.password;
        await api.put(`/users/${editingUser.id}`, payload);
      } else {
        await api.post('/users', form);
      }
      setShowForm(false);
      loadData();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setFormError(axiosError.response?.data?.message || 'Gagal menyimpan.');
    }
    setFormLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    try { await api.delete(`/users/${id}`); loadData(); } catch { /* silent */ }
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/10 text-red-400 border-red-500/30',
    bph: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    ketua_ekskul: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    siswa: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen User</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola semua pengguna sistem</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-600/25">
          + Tambah User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="Cari user..." />
        </div>
        <div className="flex gap-2">
          {['', 'admin', 'bph', 'ketua_ekskul', 'siswa'].map((r) => (
            <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${roleFilter === r ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {r === '' ? 'Semua' : r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">NISN</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Kelas</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-800/50">
                    <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-gray-800 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-600">Tidak ada user ditemukan</td></tr>
              ) : (
                data.map((u) => (
                  <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{u.name}</p>
                          <p className="text-gray-500 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm font-mono">{u.nisn || '-'}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{u.kelas || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-lg border capitalize ${roleColors[u.roles[0]] || roleColors.siswa}`}>
                        {u.roles[0]?.replace('_', ' ') || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(u)} className="text-xs px-3 py-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors border border-blue-500/20">Edit</button>
                        <button onClick={() => handleDelete(u.id)} className="text-xs px-3 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>{p}</button>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg mx-4 glass rounded-2xl p-8 animate-fade-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">{editingUser ? 'Edit User' : 'Tambah User'}</h2>
            {formError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">{formError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Nama</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Password {editingUser && '(kosongkan jika tidak diubah)'}</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} {...(!editingUser ? { required: true } : {})} className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">NISN</label>
                  <input type="text" value={form.nisn} onChange={e => setForm({ ...form, nisn: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Kelas</label>
                  <input type="text" value={form.kelas} onChange={e => setForm({ ...form, kelas: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">No. HP</label>
                <input type="text" value={form.no_hp} onChange={e => setForm({ ...form, no_hp: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option value="siswa">Siswa</option>
                  <option value="ketua_ekskul">Ketua Ekskul</option>
                  <option value="bph">BPH / Kesiswaan</option>
                  <option value="admin">Admin</option>
                </select>
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
