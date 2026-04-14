<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EkstrakurikulerController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\LaporanKegiatanController;
use App\Http\Controllers\PendaftaranController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (no auth required)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Public Read Routes
|--------------------------------------------------------------------------
*/
Route::get('/ekstrakurikuler', [EkstrakurikulerController::class, 'index']);
Route::get('/ekstrakurikuler/{ekstrakurikuler}', [EkstrakurikulerController::class, 'show']);
Route::get('/jadwal', [JadwalController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // ── Pendaftaran (Siswa) ──
    Route::middleware('role:siswa')->group(function () {
        Route::get('/pendaftaran/saya', [PendaftaranController::class, 'saya']);
        Route::post('/pendaftaran', [PendaftaranController::class, 'store']);
        Route::delete('/pendaftaran/{pendaftaran}', [PendaftaranController::class, 'destroy']);
    });

    // ── Ketua Ekskul ──
    Route::middleware('role:ketua_ekskul|admin')->group(function () {
        Route::put('/ekstrakurikuler/{ekstrakurikuler}', [EkstrakurikulerController::class, 'update']);
        Route::put('/pendaftaran/{pendaftaran}/review', [PendaftaranController::class, 'review']);

        // Jadwal management
        Route::post('/jadwal', [JadwalController::class, 'store']);
        Route::put('/jadwal/{jadwal}', [JadwalController::class, 'update']);
        Route::delete('/jadwal/{jadwal}', [JadwalController::class, 'destroy']);

        // Laporan management
        Route::post('/laporan', [LaporanKegiatanController::class, 'store']);
        Route::put('/laporan/{laporan}', [LaporanKegiatanController::class, 'update']);
        Route::delete('/laporan/{laporan}', [LaporanKegiatanController::class, 'destroy']);
    });

    // ── Pendaftaran List (ketua/bph/admin) ──
    Route::middleware('role:ketua_ekskul|bph|admin')->group(function () {
        Route::get('/pendaftaran', [PendaftaranController::class, 'index']);
    });

    // ── Laporan Read (ketua/bph/admin) ──
    Route::middleware('role:ketua_ekskul|bph|admin')->group(function () {
        Route::get('/laporan', [LaporanKegiatanController::class, 'index']);
        Route::get('/laporan/{laporan}', [LaporanKegiatanController::class, 'show']);
    });

    // ── Admin Only ──
    Route::middleware('role:admin')->group(function () {
        Route::post('/ekstrakurikuler', [EkstrakurikulerController::class, 'store']);
        Route::delete('/ekstrakurikuler/{ekstrakurikuler}', [EkstrakurikulerController::class, 'destroy']);

        // User management
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });

    // ── BPH - can also view users ──
    Route::middleware('role:bph|admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
    });
});
