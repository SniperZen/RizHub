<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('guessword_progress', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('character_id');
            $table->unsignedBigInteger('kabanata_id');
            $table->integer('current_index')->default(0); // ✅ progress tracking
            $table->timestamps();

            $table->unique(['user_id', 'character_id', 'kabanata_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('guessword_progress');
    }
};