<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ekstrakurikuler extends Model
{
    use HasFactory;

    protected $table = 'ekstrakurikuler';

    protected $fillable = [
        'nama',
        'deskripsi',
        'logo',
        'ketua_id',
        'hari_kegiatan',
        'jam_mulai',
        'jam_selesai',
        'tempat',
        'kuota',
        'status',
    ];

    protected $casts = [
        'kuota' => 'integer',
    ];

    /**
     * Ketua (pemimpin) ekstrakurikuler ini.
     */
    public function ketua()
    {
        return $this->belongsTo(User::class, 'ketua_id');
    }

    /**
     * Semua pendaftaran untuk ekstrakurikuler ini.
     */
    public function pendaftaran()
    {
        return $this->hasMany(Pendaftaran::class);
    }

    /**
     * Anggota yang sudah diterima.
     */
    public function anggota()
    {
        return $this->hasManyThrough(
            User::class,
            Pendaftaran::class,
            'ekstrakurikuler_id',
            'id',
            'id',
            'user_id'
        )->where('pendaftaran.status', 'diterima');
    }

    /**
     * Jadwal kegiatan.
     */
    public function jadwal()
    {
        return $this->hasMany(Jadwal::class);
    }

    /**
     * Laporan kegiatan.
     */
    public function laporanKegiatan()
    {
        return $this->hasMany(LaporanKegiatan::class);
    }
}
