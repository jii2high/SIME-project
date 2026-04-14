'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden">
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
          <h1 className="text-2xl font-bold text-white">Masuk ke SIME</h1>
          <p className="text-gray-500 text-sm mt-1">Sistem Informasi Manajemen Ekstrakurikuler</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              placeholder="nama@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Memproses...
              </span>
            ) : 'Masuk'}
          </button>

          <p className="text-center text-gray-500 text-sm">
            Belum punya akun?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Daftar di sini
            </Link>
          </p>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 glass rounded-xl p-4">
          <p className="text-gray-500 text-xs font-medium mb-2">Demo Login:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-400">Admin: <span className="text-gray-300">admin@sime.test</span></div>
            <div className="text-gray-400">BPH: <span className="text-gray-300">bph@sime.test</span></div>
            <div className="text-gray-400">Ketua: <span className="text-gray-300">andi@sime.test</span></div>
            <div className="text-gray-400">Siswa: <span className="text-gray-300">ahmad@sime.test</span></div>
          </div>
          <p className="text-gray-600 text-xs mt-1">Password: password</p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
