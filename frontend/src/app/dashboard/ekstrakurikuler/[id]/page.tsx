'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Ekstrakurikuler, Jadwal } from '@/lib/types';

export default function EkstrakurikulerDetailPage() {
  const { id } = useParams();
  const { hasRole } = useAuth();
  const router = useRouter();
  const [ekskul, setEkskul] = useState<Ekstrakurikuler | null>(null);
  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const [loading, setLoading] = useState(true);
  const [daftarLoading, setDaftarLoading] = useState(false);
  const [motivasi, setMotivasiText] = useState('');
  const [showDaftarForm, setShowDaftarForm] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const res = await api.get(`/ekstrakurikuler/${id}`);
      setEkskul(res.data.data);

      const jadwalRes = await api.get('/jadwal', { params: { ekstrakurikuler_id: id } });
      setJadwal(jadwalRes.data.data || []);
    } catch {
      router.push('/dashboard/ekstrakurikuler');
    }
    setLoading(false);
  };

  const handleDaftar = async (e: React.FormEvent) => {
    e.preventDefault();
    setDaftarLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await api.post('/pendaftaran', { ekstrakurikuler_id: Number(id), motivasi: motivasi });
      setMessage({ text: 'Pendaftaran berhasil dikirim! Menunggu persetujuan ketua ekskul.', type: 'success' });
      setShowDaftarForm(false);
      setMotivasiText('');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setMessage({ text: axiosError.response?.data?.message || 'Gagal mendaftar.', type: 'error' });
    }
    setDaftarLoading(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-800 rounded w-1/3" />
        <div className="h-4 bg-gray-800 rounded w-2/3" />
        <div className="h-48 bg-gray-800 rounded-xl" />
      </div>
    );
  }

  if (!ekskul) return null;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Back */}
      <button onClick={() => router.back()} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
        ← Kembali
      </button>

      {/* Header */}
      <div className="glass rounded-2xl p-8">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center text-3xl border border-gray-700 shrink-0">
            📋
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{ekskul.nama}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-lg border ${
                ekskul.status === 'aktif' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
              }`}>{ekskul.status}</span>
            </div>
            <p className="text-gray-400 leading-relaxed">{ekskul.deskripsi}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800">
          <div>
            <p className="text-gray-500 text-xs font-medium">Hari</p>
            <p className="text-white font-medium mt-1">{ekskul.hari_kegiatan || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Jam</p>
            <p className="text-white font-medium mt-1">{ekskul.jam_mulai && ekskul.jam_selesai ? `${ekskul.jam_mulai} - ${ekskul.jam_selesai}` : '-'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Tempat</p>
            <p className="text-white font-medium mt-1">{ekskul.tempat || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-medium">Kuota</p>
            <p className="text-white font-medium mt-1">{ekskul.kuota || 'Tidak terbatas'}</p>
          </div>
        </div>

        {ekskul.ketua && (
          <div className="mt-6 pt-6 border-t border-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
              {ekskul.ketua.name?.charAt(0)}
            </div>
            <div>
              <p className="text-white font-medium">{ekskul.ketua.name}</p>
              <p className="text-gray-500 text-sm">Ketua Ekskul</p>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`px-4 py-3 rounded-xl text-sm border ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Daftar Button (Siswa) */}
      {hasRole('siswa') && (
        <div className="glass rounded-xl p-6">
          {!showDaftarForm ? (
            <button
              onClick={() => setShowDaftarForm(true)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-600/25"
            >
              📝 Daftar ke Ekskul Ini
            </button>
          ) : (
            <form onSubmit={handleDaftar} className="space-y-4">
              <h3 className="text-white font-semibold">Form Pendaftaran</h3>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Motivasi (opsional)</label>
                <textarea
                  value={motivasi}
                  onChange={e => setMotivasiText(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Tuliskan motivasi kamu bergabung..."
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowDaftarForm(false)} className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700">Batal</button>
                <button type="submit" disabled={daftarLoading} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium disabled:opacity-50">{daftarLoading ? 'Mengirim...' : 'Kirim Pendaftaran'}</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Jadwal */}
      {jadwal.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Jadwal Kegiatan</h3>
          <div className="space-y-3">
            {jadwal.map((j) => (
              <div key={j.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-white font-medium">{j.hari}</p>
                  <p className="text-gray-500 text-sm">{j.tempat}</p>
                </div>
                <p className="text-gray-300 text-sm font-mono">{j.jam_mulai} - {j.jam_selesai}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
