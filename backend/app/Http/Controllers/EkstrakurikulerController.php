<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEkstrakurikulerRequest;
use App\Http\Requests\UpdateEkstrakurikulerRequest;
use App\Http\Resources\EkstrakurikulerResource;
use App\Models\Ekstrakurikuler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EkstrakurikulerController extends Controller
{
    /**
     * List semua ekstrakurikuler (public, with pagination + search).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Ekstrakurikuler::with('ketua', 'pendaftaran');

        if ($search = $request->query('search')) {
            $query->where('nama', 'like', "%{$search}%");
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $perPage = $request->query('per_page', 10);
        $ekstrakurikuler = $query->paginate($perPage);

        return response()->json([
            'data' => EkstrakurikulerResource::collection($ekstrakurikuler),
            'meta' => [
                'current_page' => $ekstrakurikuler->currentPage(),
                'last_page' => $ekstrakurikuler->lastPage(),
                'per_page' => $ekstrakurikuler->perPage(),
                'total' => $ekstrakurikuler->total(),
            ],
        ]);
    }

    /**
     * Detail satu ekstrakurikuler.
     */
    public function show(Ekstrakurikuler $ekstrakurikuler): JsonResponse
    {
        $ekstrakurikuler->load('ketua', 'pendaftaran', 'jadwal');

        return response()->json([
            'data' => new EkstrakurikulerResource($ekstrakurikuler),
        ]);
    }

    /**
     * Buat ekstrakurikuler baru (admin only).
     */
    public function store(StoreEkstrakurikulerRequest $request): JsonResponse
    {
        $ekstrakurikuler = Ekstrakurikuler::create($request->validated());
        $ekstrakurikuler->load('ketua');

        return response()->json([
            'message' => 'Ekstrakurikuler berhasil dibuat.',
            'data' => new EkstrakurikulerResource($ekstrakurikuler),
        ], 201);
    }

    /**
     * Update ekstrakurikuler (admin or ketua of this ekskul).
     */
    public function update(UpdateEkstrakurikulerRequest $request, Ekstrakurikuler $ekstrakurikuler): JsonResponse
    {
        $user = $request->user();

        // Ketua ekskul hanya bisa update ekskul yang dipimpinnya
        if ($user->hasRole('ketua_ekskul') && $ekstrakurikuler->ketua_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak memiliki akses.'], 403);
        }

        $ekstrakurikuler->update($request->validated());
        $ekstrakurikuler->load('ketua');

        return response()->json([
            'message' => 'Ekstrakurikuler berhasil diperbarui.',
            'data' => new EkstrakurikulerResource($ekstrakurikuler),
        ]);
    }

    /**
     * Hapus ekstrakurikuler (admin only).
     */
    public function destroy(Ekstrakurikuler $ekstrakurikuler): JsonResponse
    {
        $ekstrakurikuler->delete();

        return response()->json([
            'message' => 'Ekstrakurikuler berhasil dihapus.',
        ]);
    }
}
