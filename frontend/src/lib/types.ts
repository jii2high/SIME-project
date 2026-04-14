export interface User {
  id: number;
  name: string;
  email: string;
  nisn?: string;
  kelas?: string;
  no_hp?: string;
  roles: string[];
  created_at?: string;
}

export interface Ekstrakurikuler {
  id: number;
  nama: string;
  deskripsi: string;
  logo?: string;
  ketua?: User;
  hari_kegiatan: string;
  jam_mulai: string;
  jam_selesai: string;
  tempat: string;
  kuota?: number;
  status: 'aktif' | 'nonaktif';
  jumlah_anggota?: number;
  created_at?: string;
}

export interface Pendaftaran {
  id: number;
  user?: User;
  ekstrakurikuler?: Ekstrakurikuler;
  motivasi?: string;
  status: 'pending' | 'diterima' | 'ditolak';
  catatan_reviewer?: string;
  reviewer?: User;
  reviewed_at?: string;
  created_at?: string;
}

export interface Jadwal {
  id: number;
  ekstrakurikuler?: Ekstrakurikuler;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  tempat: string;
  keterangan?: string;
}

export interface LaporanKegiatan {
  id: number;
  ekstrakurikuler?: Ekstrakurikuler;
  user?: User;
  judul: string;
  isi_laporan: string;
  tanggal_kegiatan: string;
  file_lampiran?: string;
  created_at?: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

export type UserRole = 'admin' | 'bph' | 'ketua_ekskul' | 'siswa';
