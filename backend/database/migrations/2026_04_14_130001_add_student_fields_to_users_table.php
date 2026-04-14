<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nisn')->nullable()->unique()->after('email');
            $table->string('kelas')->nullable()->after('nisn');
            $table->string('no_hp')->nullable()->after('kelas');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nisn', 'kelas', 'no_hp']);
        });
    }
};
