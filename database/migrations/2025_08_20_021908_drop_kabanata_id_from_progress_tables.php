<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Remove kabanata_id from video_progress
        if (Schema::hasTable('video_progress') && Schema::hasColumn('video_progress', 'kabanata_id')) {
            Schema::table('video_progress', function (Blueprint $table) {
                // Drop foreign key first
                $foreignKeys = DB::select("
                    SELECT CONSTRAINT_NAME 
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE TABLE_NAME = 'video_progress' 
                    AND COLUMN_NAME = 'kabanata_id' 
                    AND CONSTRAINT_NAME LIKE '%_foreign'
                ");

                if (!empty($foreignKeys)) {
                    $table->dropForeign(['kabanata_id']);
                }
                
                // Then drop the column
                $table->dropColumn('kabanata_id');
            });
        }

        // Remove kabanata_id from guessword_progress
        if (Schema::hasTable('guessword_progress') && Schema::hasColumn('guessword_progress', 'kabanata_id')) {
            Schema::table('guessword_progress', function (Blueprint $table) {
                // Drop foreign key first
                $foreignKeys = DB::select("
                    SELECT CONSTRAINT_NAME 
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE TABLE_NAME = 'guessword_progress' 
                    AND COLUMN_NAME = 'kabanata_id' 
                    AND CONSTRAINT_NAME LIKE '%_foreign'
                ");

                if (!empty($foreignKeys)) {
                    $table->dropForeign(['kabanata_id']);
                }
                
                // Then drop the column
                $table->dropColumn('kabanata_id');
            });
        }

        // Remove kabanata_id from quiz_progress
        if (Schema::hasTable('quiz_progress') && Schema::hasColumn('quiz_progress', 'kabanata_id')) {
            Schema::table('quiz_progress', function (Blueprint $table) {
                // Drop foreign key first
                $foreignKeys = DB::select("
                    SELECT CONSTRAINT_NAME 
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE TABLE_NAME = 'quiz_progress' 
                    AND COLUMN_NAME = 'kabanata_id' 
                    AND CONSTRAINT_NAME LIKE '%_foreign'
                ");

                if (!empty($foreignKeys)) {
                    $table->dropForeign(['kabanata_id']);
                }
                
                // Then drop the column
                $table->dropColumn('kabanata_id');
            });
        }
    }

    public function down()
    {
        // Add kabanata_id back to video_progress
        if (Schema::hasTable('video_progress') && !Schema::hasColumn('video_progress', 'kabanata_id')) {
            Schema::table('video_progress', function (Blueprint $table) {
                $table->unsignedBigInteger('kabanata_id')->nullable()->after('kabanata_progress_id');
                $table->foreign('kabanata_id')->references('id')->on('kabanatas')->onDelete('cascade');
            });
        }

        // Add kabanata_id back to guessword_progress
        if (Schema::hasTable('guessword_progress') && !Schema::hasColumn('guessword_progress', 'kabanata_id')) {
            Schema::table('guessword_progress', function (Blueprint $table) {
                $table->unsignedBigInteger('kabanata_id')->nullable()->after('kabanata_progress_id');
                $table->foreign('kabanata_id')->references('id')->on('kabanatas')->onDelete('cascade');
            });
        }

        // Add kabanata_id back to quiz_progress
        if (Schema::hasTable('quiz_progress') && !Schema::hasColumn('quiz_progress', 'kabanata_id')) {
            Schema::table('quiz_progress', function (Blueprint $table) {
                $table->unsignedBigInteger('kabanata_id')->nullable()->after('kabanata_progress_id');
                $table->foreign('kabanata_id')->references('id')->on('kabanatas')->onDelete('cascade');
            });
        }
    }
};