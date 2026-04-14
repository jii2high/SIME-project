'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Pendaftaran } from '@/lib/types';

export default function PendaftaranSayaPage() {
  const [data, setData] = useState<Pendaftaran[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.get('/pendaftaran/saya');
      setData(res.data.data || []);
    } catch { /* silent */ }
    setLoading(false);
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Yakin ingin membatalkan pendaftaran ini?')) return;
    try {
      await api.delete(`/pendaftaran/${id}`);
      loadData();
    } catch { /* silent */ }
  };

  const statusConfig: Record<string, { badge: string; icon: string }> = {
    pending: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: '⏳' },
    diterima: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: '✅' },
    ditolak: { badge: 'bg-red-500/10 text-red-400 border-red-500/30', icon: '❌' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Pendaftaran Saya</h1>
        <p className="text-gray-500 text-sm mt-1">Pantau status pendaftaran ekstrakurikuler Anda</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-gray-800 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-400 text-lg font-medium">Belum ada pendaftaran</p>
          <p className="text-gray-600 text-sm mt-1">Kunjungi katalog ekskul untuk mulai mendaftar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((p) => {
            const config = statusConfig[p.status] || statusConfig.pending;
            return (
              <div key={p.id} className="glass rounded-xl p-6 hover:border-gray-600 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl mt-0.5">{config.icon}</div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{p.ekstrakurikuler?.nama}</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        Didaftarkan: {p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </p>
                      {p.motivasi && (
                        <p className="text-gray-400 text-sm mt-2 italic">&quot;{p.motivasi}&quot;</p>
                      )}
                      {p.catatan_reviewer && (
                        <div className="mt-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                          <p className="text-gray-500 text-xs font-medium mb-1">Catatan Reviewer:</p>
                          <p className="text-gray-300 text-sm">{p.catatan_reviewer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1.5 rounded-lg border capitalize ${config.badge}`}>
                      {p.status}
                    </span>
                    {p.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(p.id)}
                        className="text-xs px-3 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
                      >
                        Batalkan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
