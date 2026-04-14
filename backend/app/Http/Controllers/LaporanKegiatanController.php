<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLaporanRequest;
use App\Http\Resources\LaporanKegiatanResource;
use App\Models\LaporanKegiatan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LaporanKegiatanController extends Controller
{
    /**
     * List laporan kegiatan (filterable by ekskul & period).
     */
    public function index(Request $request): JsonResponse
    {
        $query = LaporanKegiatan::with('ekstrakurikuler', 'user');
        $user = $request->user();

        // Ketua hanya melihat laporan ekskulnya sendiri
        if ($user->hasRole('ketua_ekskul')) {
            $ekskulIds = $user->ekstrakurikulerDipimpin()->pluck('id');
            $query->whereIn('ekstrakurikuler_id', $ekskulIds);
        }

        if ($ekskulId = $request->query('ekstrakurikuler_id')) {
            $query->where('ekstrakurikuler_id', $ekskulId);
        }

        if ($from = $request->query('from')) {
            $query->where('tanggal_kegiatan', '>=', $from);
        }

        if ($to = $request->query('to')) {
            $query->where('tanggal_kegiatan', '<=', $to);
        }

        $query->latest('tanggal_kegiatan');
        $perPage = $request->query('per_page', 10);
        $laporan = $query->paginate($perPage);

        return response()->json([
            'data' => LaporanKegiatanResource::collection($laporan),
            'meta' => [
                'current_page' => $laporan->currentPage(),
                'last_page' => $laporan->lastPage(),
                'per_page' => $laporan->perPage(),
                'total' => $laporan->total(),
            ],
        ]);
    }

    /**
     * Detail laporan.
     */
    public function show(LaporanKegiatan $laporan): JsonResponse
    {
        $laporan->load('ekstrakurikuler', 'user');

        return response()->json([
            'data' => new LaporanKegiatanResource($laporan),
        ]);
    }

    /**
     * Ketua buat laporan kegiatan baru.
     */
    public function store(StoreLaporanRequest $request): JsonResponse
    {
        $user = $request->user();

        // Verifikasi ketua hanya membuat laporan untuk ekskulnya
        if ($user->hasRole('ketua_ekskul')) {
            $ekskulIds = $user->ekstrakurikulerDipimpin()->pluck('id');
            if (! $ekskulIds->contains($request->ekstrakurikuler_id)) {
                return response()->json(['message' => 'Anda tidak memiliki akses.'], 403);
            }
        }

        $laporan = LaporanKegiatan::create([
            ...$request->validated(),
            'user_id' => $user->id,
        ]);

        $laporan->load('ekstrakurikuler', 'user');

        return response()->json([
            'message' => 'Laporan kegiatan berhasil dibuat.',
            'data' => new LaporanKegiatanResource($laporan),
        ], 201);
    }

    /**
     * Update laporan kegiatan.
     */
    public function update(StoreLaporanRequest $request, LaporanKegiatan $laporan): JsonResponse
    {
        $user = $request->user();

        if ($user->hasRole('ketua_ekskul') && $laporan->user_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak memiliki akses.'], 403);
        }

        $laporan->update($request->validated());
        $laporan->load('ekstrakurikuler', 'user');

        return response()->json([
            'message' => 'Laporan kegiatan berhasil diperbarui.',
            'data' => new LaporanKegiatanResource($laporan),
        ]);
    }

    /**
     * Hapus laporan kegiatan.
     */
    public function destroy(Request $request, LaporanKegiatan $laporan): JsonResponse
    {
        $user = $request->user();

        if ($user->hasRole('ketua_ekskul') && $laporan->user_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak memiliki akses.'], 403);
        }

        $laporan->delete();

        return response()->json([
            'message' => 'Laporan kegiatan berhasil dihapus.',
        ]);
    }
}
