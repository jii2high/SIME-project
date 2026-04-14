'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    nisn: '',
    kelas: '',
    no_hp: '',
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setLoading(true);

    try {
      await register(formData);
      router.push('/dashboard');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      setError(axiosError.response?.data?.message || 'Registrasi gagal.');
      if (axiosError.response?.data?.errors) {
        setErrors(axiosError.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all ${
      errors[field] ? 'border-red-500/50' : 'border-gray-700'
    }`;

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden py-12">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="mx-auto w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg shadow-blue-500/20">
              SI
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Daftar Akun Siswa</h1>
          <p className="text-gray-500 text-sm mt-1">Buat akun untuk mendaftar ekstrakurikuler</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nama Lengkap</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass('name')} placeholder="Nama lengkap" required />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass('email')} placeholder="nama@email.com" required />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">NISN</label>
              <input type="text" name="nisn" value={formData.nisn} onChange={handleChange} className={inputClass('nisn')} placeholder="0012345678" />
              {errors.nisn && <p className="text-red-400 text-xs mt-1">{errors.nisn[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Kelas</label>
              <input type="text" name="kelas" value={formData.kelas} onChange={handleChange} className={inputClass('kelas')} placeholder="XII RPL 1" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">No. HP</label>
            <input type="text" name="no_hp" value={formData.no_hp} onChange={handleChange} className={inputClass('no_hp')} placeholder="08xxxxxxxxxx" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass('password')} placeholder="Minimal 8 karakter" required />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Konfirmasi Password</label>
            <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} className={inputClass('password_confirmation')} placeholder="Ulangi password" required />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>

          <p className="text-center text-gray-500 text-sm">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterForm />
    </AuthProvider>
  );
}
