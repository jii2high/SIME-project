<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewPendaftaranRequest;
use App\Http\Requests\StorePendaftaranRequest;
use App\Http\Resources\PendaftaranResource;
use App\Models\Pendaftaran;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PendaftaranController extends Controller
{
    /**
     * List pendaftaran (ketua/bph/admin — filterable).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Pendaftaran::with('user', 'ekstrakurikuler', 'reviewer');
        $user = $request->user();

        // Ketua ekskul hanya melihat pendaftaran untuk ekskulnya
        if ($user->hasRole('ketua_ekskul')) {
            $ekskulIds = $user->ekstrakurikulerDipimpin()->pluck('id');
            $query->whereIn('ekstrakurikuler_id', $ekskulIds);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($ekskulId = $request->query('ekstrakurikuler_id')) {
            $query->where('ekstrakurikuler_id', $ekskulId);
        }

        $query->latest();
        $perPage = $request->query('per_page', 10);
        $pendaftaran = $query->paginate($perPage);

        return response()->json([
            'data' => PendaftaranResource::collection($pendaftaran),
            'meta' => [
                'current_page' => $pendaftaran->currentPage(),
                'last_page' => $pendaftaran->lastPage(),
                'per_page' => $pendaftaran->perPage(),
                'total' => $pendaftaran->total(),
            ],
        ]);
    }

    /**
     * List pendaftaran milik siswa yang sedang login.
     */
    public function saya(Request $request): JsonResponse
    {
        $pendaftaran = Pendaftaran::with('ekstrakurikuler', 'reviewer')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => PendaftaranResource::collection($pendaftaran),
        ]);
    }

    /**
     * Siswa mendaftar ke ekstrakurikuler.
     */
    public function store(StorePendaftaranRequest $request): JsonResponse
    {
        $user = $request->user();

        // Cek apakah sudah pernah mendaftar ke ekskul ini
        $exists = Pendaftaran::where('user_id', $user->id)
            ->where('ekstrakurikuler_id', $request->ekstrakurikuler_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Anda sudah mendaftar ke ekstrakurikuler ini.',
            ], 422);
        }

        $pendaftaran = Pendaftaran::create([
            'user_id' => $user->id,
            'ekstrakurikuler_id' => $request->ekstrakurikuler_id,
            'motivasi' => $request->motivasi,
            'status' => 'pending',
        ]);

        $pendaftaran->load('ekstrakurikuler');

        return response()->json([
            'message' => 'Pendaftaran berhasil dikirim.',
            'data' => new PendaftaranResource($pendaftaran),
        ], 201);
    }

    /**
     * Ketua review (approve/reject) pendaftaran.
     */
    public function review(ReviewPendaftaranRequest $request, Pendaftaran $pendaftaran): JsonResponse
    {
        $user = $request->user();

        // Pastikan ketua hanya bisa review ekskul miliknya
        if ($user->hasRole('ketua_ekskul')) {
            $ekskul = $pendaftaran->ekstrakurikuler;
            if ($ekskul->ketua_id !== $user->id) {
                return response()->json(['message' => 'Anda tidak memiliki akses.'], 403);
            }
        }

        if ($pendaftaran->status !== 'pending') {
            return response()->json([
                'message' => 'Pendaftaran ini sudah direview.',
            ], 422);
        }

        $pendaftaran->update([
            'status' => $request->status,
            'catatan_reviewer' => $request->catatan_reviewer,
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
        ]);

        $pendaftaran->load('user', 'ekstrakurikuler', 'reviewer');

        return response()->json([
            'message' => 'Pendaftaran berhasil di-review.',
            'data' => new PendaftaranResource($pendaftaran),
        ]);
    }

    /**
     * Siswa membatalkan pendaftaran (hanya jika masih pending).
     */
    public function destroy(Request $request, Pendaftaran $pendaftaran): JsonResponse
    {
        if ($pendaftaran->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Anda tidak memiliki akses.'], 403);
        }

        if ($pendaftaran->status !== 'pending') {
            return response()->json([
                'message' => 'Hanya pendaftaran berstatus pending yang bisa dibatalkan.',
            ], 422);
        }

        $pendaftaran->delete();

        return response()->json([
            'message' => 'Pendaftaran berhasil dibatalkan.',
        ]);
    }
}
