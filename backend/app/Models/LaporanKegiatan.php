<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanKegiatan extends Model
{
    use HasFactory;

    protected $table = 'laporan_kegiatan';

    protected $fillable = [
        'ekstrakurikuler_id',
        'user_id',
        'judul',
        'isi_laporan',
        'tanggal_kegiatan',
        'file_lampiran',
    ];

    protected $casts = [
        'tanggal_kegiatan' => 'date',
    ];

    /**
     * Ekstrakurikuler yang terkait.
     */
    public function ekstrakurikuler()
    {
        return $this->belongsTo(Ekstrakurikuler::class);
    }

    /**
     * User pembuat laporan.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
