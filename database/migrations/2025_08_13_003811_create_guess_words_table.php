<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('guess_words', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('kabanata_id');
            $table->string('question');
            $table->string('answer');
            $table->string('pickedChar')->nullable();
            $table->timestamps();

            $table->foreign('kabanata_id')
                  ->references('id')
                  ->on('kabanatas')
                  ->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('guess_words');
    }
};
