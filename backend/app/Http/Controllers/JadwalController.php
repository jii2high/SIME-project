<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJadwalRequest;
use App\Http\Resources\JadwalResource;
use App\Models\Jadwal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JadwalController extends Controller
{
    /**
     * List jadwal (filterable by ekskul).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Jadwal::with('ekstrakurikuler');

        if ($ekskulId = $request->query('ekstrakurikuler_id')) {
            $query->where('ekstrakurikuler_id', $ekskulId);
        }

        $jadwal = $query->get();

        return response()->json([
            'data' => JadwalResource::collection($jadwal),
        ]);
    }

    /**
     * Buat jadwal baru.
     */
    public function store(StoreJadwalRequest $request): JsonResponse
    {
        $user = $request->user();

        // Ketua hanya bisa buat jadwal untuk ekskulnya
        if ($user->hasRole('ketua_ekskul')) {
            $ekskulIds = $user->ekstrakurikulerDipimpin()->pluck('id');
            if (! $ekskulIds->contains($request->ekstrakurikuler_id)) {
                return response()->json(['message' => 'Anda tidak memiliki akses.'], 403);
            }
        }

        $jadwal = Jadwal::create($request->validated());
        $jadwal->load('ekstrakurikuler');

        return response()->json([
            'message' => 'Jadwal berhasil dibuat.',
            'data' => new JadwalResource($jadwal),
        ], 201);
    }

    /**
     * Update jadwal.
     */
    public function update(StoreJadwalRequest $request, Jadwal $jadwal): JsonResponse
    {
        $user = $request->user();

        if ($user->hasRole('ketua_ekskul') && $jadwal->ekstrakurikuler->ketua_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak memiliki akses.'], 403);
        }

        $jadwal->update($request->validated());
        $jadwal->load('ekstrakurikuler');

        return response()->json([
            'message' => 'Jadwal berhasil diperbarui.',
            'data' => new JadwalResource($jadwal),
        ]);
    }

    /**
     * Hapus jadwal.
     */
    public function destroy(Request $request, Jadwal $jadwal): JsonResponse
    {
        $user = $request->user();

        if ($user->hasRole('ketua_ekskul') && $jadwal->ekstrakurikuler->ketua_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak memiliki akses.'], 403);
        }

        $jadwal->delete();

        return response()->json([
            'message' => 'Jadwal berhasil dihapus.',
        ]);
    }
}
