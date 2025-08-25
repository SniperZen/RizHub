<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('guessword_progress', function (Blueprint $table) {
            // Remove the unique constraint
            $table->dropUnique('guessword_progress_user_id_character_id_kabanata_id_unique');
        });
    }

    public function down()
    {
        Schema::table('guessword_progress', function (Blueprint $table) {
            // Re-add the unique constraint if needed
            $table->unique(['user_id', 'character_id', 'kabanata_id'], 'guessword_progress_user_id_character_id_kabanata_id_unique');
        });
    }
};