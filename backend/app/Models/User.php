<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'nisn',
        'kelas',
        'no_hp',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Pendaftaran yang diajukan oleh user ini.
     */
    public function pendaftaran()
    {
        return $this->hasMany(Pendaftaran::class);
    }

    /**
     * Laporan kegiatan yang dibuat oleh user ini.
     */
    public function laporanKegiatan()
    {
        return $this->hasMany(LaporanKegiatan::class);
    }

    /**
     * Ekstrakurikuler yang dipimpin oleh user ini.
     */
    public function ekstrakurikulerDipimpin()
    {
        return $this->hasMany(Ekstrakurikuler::class, 'ketua_id');
    }
}
