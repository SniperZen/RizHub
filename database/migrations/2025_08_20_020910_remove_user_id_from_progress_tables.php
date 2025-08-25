<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Remove user_id from video_progress
        if (Schema::hasTable('video_progress') && Schema::hasColumn('video_progress', 'user_id')) {
            Schema::table('video_progress', function (Blueprint $table) {
                // Drop foreign key first
                $foreignKeys = DB::select("
                    SELECT CONSTRAINT_NAME 
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE TABLE_NAME = 'video_progress' 
                    AND COLUMN_NAME = 'user_id' 
                    AND CONSTRAINT_NAME LIKE '%_foreign'
                ");

                if (!empty($foreignKeys)) {
                    $table->dropForeign(['user_id']);
                }
                
                // Then drop the column
                $table->dropColumn('user_id');
            });
        }

        // Remove user_id from guessword_progress
        if (Schema::hasTable('guessword_progress') && Schema::hasColumn('guessword_progress', 'user_id')) {
            Schema::table('guessword_progress', function (Blueprint $table) {
                // Drop foreign key first
                $foreignKeys = DB::select("
                    SELECT CONSTRAINT_NAME 
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE TABLE_NAME = 'guessword_progress' 
                    AND COLUMN_NAME = 'user_id' 
                    AND CONSTRAINT_NAME LIKE '%_foreign'
                ");

                if (!empty($foreignKeys)) {
                    $table->dropForeign(['user_id']);
                }
                
                // Then drop the column
                $table->dropColumn('user_id');
            });
        }

        // Remove user_id from quiz_progress
        if (Schema::hasTable('quiz_progress') && Schema::hasColumn('quiz_progress', 'user_id')) {
            Schema::table('quiz_progress', function (Blueprint $table) {
                // Drop foreign key first
                $foreignKeys = DB::select("
                    SELECT CONSTRAINT_NAME 
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE TABLE_NAME = 'quiz_progress' 
                    AND COLUMN_NAME = 'user_id' 
                    AND CONSTRAINT_NAME LIKE '%_foreign'
                ");

                if (!empty($foreignKeys)) {
                    $table->dropForeign(['user_id']);
                }
                
                // Then drop the column
                $table->dropColumn('user_id');
            });
        }

        // Ensure kabanata_progress_id has proper foreign key constraint
        $this->ensureKabanataProgressForeignKeys();
    }

    public function down()
    {
        // Add user_id back to video_progress
        if (Schema::hasTable('video_progress') && !Schema::hasColumn('video_progress', 'user_id')) {
            Schema::table('video_progress', function (Blueprint $table) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        // Add user_id back to guessword_progress
        if (Schema::hasTable('guessword_progress') && !Schema::hasColumn('guessword_progress', 'user_id')) {
            Schema::table('guessword_progress', function (Blueprint $table) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        // Add user_id back to quiz_progress
        if (Schema::hasTable('quiz_progress') && !Schema::hasColumn('quiz_progress', 'user_id')) {
            Schema::table('quiz_progress', function (Blueprint $table) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }
    }

    private function ensureKabanataProgressForeignKeys()
    {
        // Ensure video_progress has kabanata_progress_id foreign key
        if (Schema::hasTable('video_progress') && Schema::hasColumn('video_progress', 'kabanata_progress_id')) {
            Schema::table('video_progress', function (Blueprint $table) {
                $foreignKeys = DB::select("
                    SELECT CONSTRAINT_NAME 
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE TABLE_NAME = 'video_progress' 
                    AND COLUMN_NAME = 'kabanata_progress_id' 
                    AND CONSTRAINT_NAME LIKE '%_foreign'
                ");

                if (empty($foreignKeys)) {
                    $table->foreign('kabanata_progress_id')->references('id')->on('user_kabanata_progress')->onDelete('cascade');
                }
            });
        }

        // Ensure guessword_progress has kabanata_progress_id foreign key
        if (Schema::hasTable('guessword_progress') && Schema::hasColumn('guessword_progress', 'kabanata_progress_id')) {
            Schema::table('guessword_progress', function (Blueprint $table) {
                $foreignKeys = DB::select("
                    SELECT CONSTRAINT_NAME 
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE TABLE_NAME = 'guessword_progress' 
                    AND COLUMN_NAME = 'kabanata_progress_id' 
                    AND CONSTRAINT_NAME LIKE '%_foreign'
                ");

                if (empty($foreignKeys)) {
                    $table->foreign('kabanata_progress_id')->references('id')->on('user_kabanata_progress')->onDelete('cascade');
                }
            });
        }

        // Ensure quiz_progress has kabanata_progress_id foreign key
        if (Schema::hasTable('quiz_progress') && Schema::hasColumn('quiz_progress', 'kabanata_progress_id')) {
            Schema::table('quiz_progress', function (Blueprint $table) {
                $foreignKeys = DB::select("
                    SELECT CONSTRAINT_NAME 
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE TABLE_NAME = 'quiz_progress' 
                    AND COLUMN_NAME = 'kabanata_progress_id' 
                    AND CONSTRAINT_NAME LIKE '%_foreign'
                ");

                if (empty($foreignKeys)) {
                    $table->foreign('kabanata_progress_id')->references('id')->on('user_kabanata_progress')->onDelete('cascade');
                }
            });
        }
    }
};