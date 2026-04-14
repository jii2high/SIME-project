<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * List semua user (filterable by role).
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::with('roles');

        if ($role = $request->query('role')) {
            $query->role($role);
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        $perPage = $request->query('per_page', 10);
        $users = $query->paginate($perPage);

        return response()->json([
            'data' => UserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    /**
     * Detail user.
     */
    public function show(User $user): JsonResponse
    {
        $user->load('roles');

        return response()->json([
            'data' => new UserResource($user),
        ]);
    }

    /**
     * Admin buat user baru.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'nisn' => $request->nisn,
            'kelas' => $request->kelas,
            'no_hp' => $request->no_hp,
        ]);

        $user->assignRole($request->role);

        return response()->json([
            'message' => 'User berhasil dibuat.',
            'data' => new UserResource($user),
        ], 201);
    }

    /**
     * Admin update user.
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $data = $request->only(['name', 'email', 'nisn', 'kelas', 'no_hp']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        if ($request->filled('role')) {
            $user->syncRoles([$request->role]);
        }

        return response()->json([
            'message' => 'User berhasil diperbarui.',
            'data' => new UserResource($user),
        ]);
    }

    /**
     * Admin hapus user.
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'User berhasil dihapus.',
        ]);
    }
}
