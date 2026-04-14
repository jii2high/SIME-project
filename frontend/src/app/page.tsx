import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-6 animate-fade-in">
        {/* Logo */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mb-8 shadow-2xl shadow-blue-500/20">
          SIME
        </div>

        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
          Sistem Informasi
          <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Manajemen Ekstrakurikuler
          </span>
        </h1>

        <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
          SMKN 1 Kota Bekasi — Digitalisasi pengelolaan ekstrakurikuler yang efisien dan terstruktur.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 hover:text-white transition-all duration-300 border border-gray-700 hover:-translate-y-0.5"
          >
            Daftar Akun
          </Link>
        </div>

        <p className="text-gray-600 text-sm mt-16">
          © 2026 SMKN 1 Kota Bekasi. All rights reserved.
        </p>
      </div>
    </main>
  );
}
