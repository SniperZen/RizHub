<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('guessword_progress', function (Blueprint $table) {
            // First drop the foreign key constraint
            $table->dropForeign(['character_id']);
            
            // The character_id column will remain as a regular unsignedBigInteger column
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guessword_progress', function (Blueprint $table) {
            // Re-add the foreign key constraint
            $table->foreign('character_id')
                  ->references('id')
                  ->on('guesscharacters')
                  ->onDelete('cascade');
        });
    }
};