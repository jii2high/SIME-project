<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jadwal extends Model
{
    use HasFactory;

    protected $table = 'jadwal';

    protected $fillable = [
        'ekstrakurikuler_id',
        'hari',
        'jam_mulai',
        'jam_selesai',
        'tempat',
        'keterangan',
    ];

    /**
     * Ekstrakurikuler yang memiliki jadwal ini.
     */
    public function ekstrakurikuler()
    {
        return $this->belongsTo(Ekstrakurikuler::class);
    }
}
