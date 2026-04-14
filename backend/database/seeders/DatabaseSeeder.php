<?php

namespace Database\Seeders;

use App\Models\Ekstrakurikuler;
use App\Models\Jadwal;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Permissions ──
        $permissions = [
            'manage-users',
            'manage-roles',
            'manage-ekskul',
            'manage-all',
            'view-all-ekskul',
            'view-reports',
            'export-reports',
            'manage-pengurus',
            'manage-own-ekskul',
            'approve-pendaftaran',
            'manage-anggota',
            'create-laporan',
            'view-ekskul',
            'daftar-ekskul',
            'view-own-status',
            'view-jadwal',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // ── Roles ──
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        $bph = Role::create(['name' => 'bph']);
        $bph->givePermissionTo([
            'view-all-ekskul', 'view-reports', 'export-reports', 'manage-pengurus',
            'view-ekskul', 'view-jadwal',
        ]);

        $ketua = Role::create(['name' => 'ketua_ekskul']);
        $ketua->givePermissionTo([
            'manage-own-ekskul', 'approve-pendaftaran', 'manage-anggota',
            'create-laporan', 'view-ekskul', 'view-jadwal',
        ]);

        $siswa = Role::create(['name' => 'siswa']);
        $siswa->givePermissionTo([
            'view-ekskul', 'daftar-ekskul', 'view-own-status', 'view-jadwal',
        ]);

        // ── Users ──
        $adminUser = User::create([
            'name' => 'Administrator',
            'email' => 'admin@sime.test',
            'password' => Hash::make('password'),
        ]);
        $adminUser->assignRole('admin');

        $bphUser = User::create([
            'name' => 'Staf Kesiswaan',
            'email' => 'bph@sime.test',
            'password' => Hash::make('password'),
        ]);
        $bphUser->assignRole('bph');

        // ── Ekstrakurikuler & Ketua ──
        $ekskulData = [
            [
                'nama' => 'Pramuka',
                'deskripsi' => 'Kegiatan kepramukaan untuk melatih kedisiplinan, kemandirian, dan jiwa kepemimpinan siswa.',
                'hari_kegiatan' => 'Jumat',
                'jam_mulai' => '14:00',
                'jam_selesai' => '16:00',
                'tempat' => 'Lapangan Utama',
                'kuota' => 50,
                'ketua_name' => 'Andi Pratama',
                'ketua_email' => 'andi@sime.test',
            ],
            [
                'nama' => 'PMR (Palang Merah Remaja)',
                'deskripsi' => 'Ekstrakurikuler kepalangmerahan yang melatih siswa dalam pertolongan pertama dan kemanusiaan.',
                'hari_kegiatan' => 'Rabu',
                'jam_mulai' => '14:00',
                'jam_selesai' => '16:00',
                'tempat' => 'Ruang PMR',
                'kuota' => 30,
                'ketua_name' => 'Siti Nurhaliza',
                'ketua_email' => 'siti@sime.test',
            ],
            [
                'nama' => 'Paskibra',
                'deskripsi' => 'Pasukan Pengibar Bendera yang melatih baris-berbaris dan upacara bendera.',
                'hari_kegiatan' => 'Selasa',
                'jam_mulai' => '15:00',
                'jam_selesai' => '17:00',
                'tempat' => 'Lapangan Utama',
                'kuota' => 40,
                'ketua_name' => 'Budi Santoso',
                'ketua_email' => 'budi@sime.test',
            ],
            [
                'nama' => 'Rohis',
                'deskripsi' => 'Rohani Islam - kegiatan keagamaan untuk memperdalam ilmu agama Islam.',
                'hari_kegiatan' => 'Kamis',
                'jam_mulai' => '13:00',
                'jam_selesai' => '15:00',
                'tempat' => 'Musholla Sekolah',
                'kuota' => 35,
                'ketua_name' => 'Fatimah Zahra',
                'ketua_email' => 'fatimah@sime.test',
            ],
            [
                'nama' => 'English Club',
                'deskripsi' => 'Klub bahasa Inggris untuk meningkatkan kemampuan speaking, writing, dan listening.',
                'hari_kegiatan' => 'Senin',
                'jam_mulai' => '14:00',
                'jam_selesai' => '15:30',
                'tempat' => 'Lab Bahasa',
                'kuota' => 25,
                'ketua_name' => 'Dewi Lestari',
                'ketua_email' => 'dewi@sime.test',
            ],
        ];

        foreach ($ekskulData as $data) {
            $ketuaUser = User::create([
                'name' => $data['ketua_name'],
                'email' => $data['ketua_email'],
                'password' => Hash::make('password'),
            ]);
            $ketuaUser->assignRole('ketua_ekskul');

            $ekskul = Ekstrakurikuler::create([
                'nama' => $data['nama'],
                'deskripsi' => $data['deskripsi'],
                'hari_kegiatan' => $data['hari_kegiatan'],
                'jam_mulai' => $data['jam_mulai'],
                'jam_selesai' => $data['jam_selesai'],
                'tempat' => $data['tempat'],
                'kuota' => $data['kuota'],
                'ketua_id' => $ketuaUser->id,
                'status' => 'aktif',
            ]);

            Jadwal::create([
                'ekstrakurikuler_id' => $ekskul->id,
                'hari' => $data['hari_kegiatan'],
                'jam_mulai' => $data['jam_mulai'],
                'jam_selesai' => $data['jam_selesai'],
                'tempat' => $data['tempat'],
            ]);
        }

        // ── Siswa Dummy ──
        $siswaData = [
            ['name' => 'Ahmad Fauzi', 'email' => 'ahmad@sime.test', 'nisn' => '0012345601', 'kelas' => 'XII RPL 1'],
            ['name' => 'Rina Wati', 'email' => 'rina@sime.test', 'nisn' => '0012345602', 'kelas' => 'XI TKJ 2'],
            ['name' => 'Dian Permata', 'email' => 'dian@sime.test', 'nisn' => '0012345603', 'kelas' => 'X MM 1'],
            ['name' => 'Rizki Hidayat', 'email' => 'rizki@sime.test', 'nisn' => '0012345604', 'kelas' => 'XI RPL 1'],
            ['name' => 'Putri Ayu', 'email' => 'putri@sime.test', 'nisn' => '0012345605', 'kelas' => 'XII TKJ 1'],
            ['name' => 'Fajar Nugroho', 'email' => 'fajar@sime.test', 'nisn' => '0012345606', 'kelas' => 'X RPL 2'],
            ['name' => 'Nadia Safitri', 'email' => 'nadia@sime.test', 'nisn' => '0012345607', 'kelas' => 'XI MM 1'],
            ['name' => 'Ilham Maulana', 'email' => 'ilham@sime.test', 'nisn' => '0012345608', 'kelas' => 'XII RPL 2'],
            ['name' => 'Sari Indah', 'email' => 'sari@sime.test', 'nisn' => '0012345609', 'kelas' => 'X TKJ 1'],
            ['name' => 'Yoga Pratama', 'email' => 'yoga@sime.test', 'nisn' => '0012345610', 'kelas' => 'XI RPL 2'],
        ];

        foreach ($siswaData as $data) {
            $student = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'nisn' => $data['nisn'],
                'kelas' => $data['kelas'],
            ]);
            $student->assignRole('siswa');
        }
    }
}
