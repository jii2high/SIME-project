<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pendaftaran extends Model
{
    use HasFactory;

    protected $table = 'pendaftaran';

    protected $fillable = [
        'user_id',
        'ekstrakurikuler_id',
        'motivasi',
        'status',
        'catatan_reviewer',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    /**
     * Siswa yang mendaftar.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Ekstrakurikuler yang didaftarkan.
     */
    public function ekstrakurikuler()
    {
        return $this->belongsTo(Ekstrakurikuler::class);
    }

    /**
     * User yang mereview pendaftaran ini.
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
