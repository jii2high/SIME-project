<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ekstrakurikuler', function (Blueprint $table) {
            $table->id();
            $table->string('nama')->unique();
            $table->text('deskripsi')->nullable();
            $table->string('logo')->nullable();
            $table->foreignId('ketua_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('hari_kegiatan')->nullable();
            $table->string('jam_mulai')->nullable();
            $table->string('jam_selesai')->nullable();
            $table->string('tempat')->nullable();
            $table->integer('kuota')->nullable();
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ekstrakurikuler');
    }
};
