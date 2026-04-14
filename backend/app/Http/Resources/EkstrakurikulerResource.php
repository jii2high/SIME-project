<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EkstrakurikulerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'deskripsi' => $this->deskripsi,
            'logo' => $this->logo,
            'ketua' => new UserResource($this->whenLoaded('ketua')),
            'hari_kegiatan' => $this->hari_kegiatan,
            'jam_mulai' => $this->jam_mulai,
            'jam_selesai' => $this->jam_selesai,
            'tempat' => $this->tempat,
            'kuota' => $this->kuota,
            'status' => $this->status,
            'jumlah_anggota' => $this->when(
                $this->pendaftaran_count !== null || $this->relationLoaded('pendaftaran'),
                fn () => $this->pendaftaran->where('status', 'diterima')->count()
            ),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
