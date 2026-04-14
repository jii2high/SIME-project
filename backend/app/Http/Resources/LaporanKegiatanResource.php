<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LaporanKegiatanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ekstrakurikuler' => new EkstrakurikulerResource($this->whenLoaded('ekstrakurikuler')),
            'user' => new UserResource($this->whenLoaded('user')),
            'judul' => $this->judul,
            'isi_laporan' => $this->isi_laporan,
            'tanggal_kegiatan' => $this->tanggal_kegiatan?->toDateString(),
            'file_lampiran' => $this->file_lampiran,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
