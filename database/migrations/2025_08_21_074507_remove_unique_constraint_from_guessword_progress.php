<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (Schema::hasTable('guessword_progress')) {
            $columns = Schema::getColumnListing('guessword_progress');
            if (in_array('user_id', $columns) && in_array('character_id', $columns) && in_array('kabanata_id', $columns)) {
                // Remove the unique constraint only if all columns exist
                Schema::table('guessword_progress', function (Blueprint $table) {
                    $table->dropUnique('guessword_progress_user_id_character_id_kabanata_id_unique');
                });
            }
        }
    }

    public function down()
    {
        if (Schema::hasTable('guessword_progress')) {
            $columns = Schema::getColumnListing('guessword_progress');
            if (in_array('user_id', $columns) && in_array('character_id', $columns) && in_array('kabanata_id', $columns)) {
                // Re-add the unique constraint only if all columns exist
                Schema::table('guessword_progress', function (Blueprint $table) {
                    $table->unique(['user_id', 'character_id', 'kabanata_id'], 'guessword_progress_user_id_character_id_kabanata_id_unique');
                });
            }
        }
    }
};