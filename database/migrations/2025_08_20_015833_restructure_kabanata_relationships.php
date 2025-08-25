<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // First, drop existing foreign keys if they exist
        $this->dropExistingForeignKeys();

        // Then add all foreign keys
        $this->addAllForeignKeys();
    }

    public function down()
    {
        $this->dropAllForeignKeys();
    }

    private function dropExistingForeignKeys()
    {
        $tables = [
            'videos' => ['kabanata_id'],
            'guess_words' => ['kabanata_id'],
            'quizzes' => ['kabanata_id'],
            'guesscharacters' => ['kabanata_id'],
            'video_progress' => ['user_id', 'kabanata_progress_id', 'video_id', 'kabanata_id'],
            'guessword_progress' => ['user_id', 'kabanata_progress_id', 'character_id', 'kabanata_id', 'question_id'],
            'quiz_progress' => ['user_id', 'kabanata_progress_id', 'kabanata_id', 'quiz_id'],
            'user_kabanata_progress' => ['user_id', 'kabanata_id'],
        ];

        foreach ($tables as $tableName => $columns) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($columns) {
                    foreach ($columns as $column) {
                        if (Schema::hasColumn($table->getTable(), $column)) {
                            // Generate the foreign key constraint name
                            $constraintName = $this->getForeignKeyName($table->getTable(), $column);
                            
                            // Check if the foreign key exists before trying to drop it
                            $foreignKeys = DB::select("
                                SELECT CONSTRAINT_NAME 
                                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                                WHERE TABLE_NAME = ? 
                                AND COLUMN_NAME = ? 
                                AND CONSTRAINT_NAME LIKE '%_foreign'
                            ", [$table->getTable(), $column]);

                            if (!empty($foreignKeys)) {
                                $table->dropForeign([$column]);
                            }
                        }
                    }
                });
            }
        }
    }

    private function addAllForeignKeys()
    {
        // Videos table
        if (Schema::hasTable('videos')) {
            Schema::table('videos', function (Blueprint $table) {
                $table->foreign('kabanata_id')->references('id')->on('kabanatas')->onDelete('cascade');
            });
        }

        // Guess words table
        if (Schema::hasTable('guess_words')) {
            Schema::table('guess_words', function (Blueprint $table) {
                $table->foreign('kabanata_id')->references('id')->on('kabanatas')->onDelete('cascade');
            });
        }

        // Quizzes table
        if (Schema::hasTable('quizzes')) {
            Schema::table('quizzes', function (Blueprint $table) {
                $table->foreign('kabanata_id')->references('id')->on('kabanatas')->onDelete('cascade');
            });
        }

        // Guess characters table (if kabanata_id exists)
        if (Schema::hasTable('guesscharacters') && Schema::hasColumn('guesscharacters', 'kabanata_id')) {
            Schema::table('guesscharacters', function (Blueprint $table) {
                $table->foreign('kabanata_id')->references('id')->on('kabanatas')->onDelete('cascade');
            });
        }

        // Video progress table
        if (Schema::hasTable('video_progress')) {
            Schema::table('video_progress', function (Blueprint $table) {
                // Add kabanata_id if not exists
                if (!Schema::hasColumn('video_progress', 'kabanata_id')) {
                    $table->unsignedBigInteger('kabanata_id')->nullable()->after('user_id');
                }
                
                $table->foreign('kabanata_id')->references('id')->on('kabanatas')->onDelete('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('kabanata_progress_id')->references('id')->on('user_kabanata_progress')->onDelete('cascade');
                $table->foreign('video_id')->references('id')->on('videos')->onDelete('cascade');
            });
        }

        // Guessword progress table
        if (Schema::hasTable('guessword_progress')) {
            Schema::table('guessword_progress', function (Blueprint $table) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('kabanata_progress_id')->references('id')->on('user_kabanata_progress')->onDelete('cascade');
                $table->foreign('character_id')->references('id')->on('guesscharacters')->onDelete('cascade');
                $table->foreign('kabanata_id')->references('id')->on('kabanatas')->onDelete('cascade');
                $table->foreign('question_id')->references('id')->on('guess_words')->onDelete('cascade');
            });
        }

        // Quiz progress table
        if (Schema::hasTable('quiz_progress')) {
            Schema::table('quiz_progress', function (Blueprint $table) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('kabanata_progress_id')->references('id')->on('user_kabanata_progress')->onDelete('cascade');
                $table->foreign('kabanata_id')->references('id')->on('kabanatas')->onDelete('cascade');
                $table->foreign('quiz_id')->references('id')->on('quizzes')->onDelete('cascade');
            });
        }

        // User kabanata progress table
        if (Schema::hasTable('user_kabanata_progress')) {
            Schema::table('user_kabanata_progress', function (Blueprint $table) {
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('kabanata_id')->references('id')->on('kabanatas')->onDelete('cascade');
            });
        }
    }

    private function dropAllForeignKeys()
    {
        $tables = [
            'videos' => ['kabanata_id'],
            'guess_words' => ['kabanata_id'],
            'quizzes' => ['kabanata_id'],
            'guesscharacters' => ['kabanata_id'],
            'video_progress' => ['user_id', 'kabanata_progress_id', 'video_id', 'kabanata_id'],
            'guessword_progress' => ['user_id', 'kabanata_progress_id', 'character_id', 'kabanata_id', 'question_id'],
            'quiz_progress' => ['user_id', 'kabanata_progress_id', 'kabanata_id', 'quiz_id'],
            'user_kabanata_progress' => ['user_id', 'kabanata_id'],
        ];

        foreach ($tables as $tableName => $columns) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($columns) {
                    foreach ($columns as $column) {
                        if (Schema::hasColumn($table->getTable(), $column)) {
                            $foreignKeys = DB::select("
                                SELECT CONSTRAINT_NAME 
                                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                                WHERE TABLE_NAME = ? 
                                AND COLUMN_NAME = ? 
                                AND CONSTRAINT_NAME LIKE '%_foreign'
                            ", [$table->getTable(), $column]);

                            if (!empty($foreignKeys)) {
                                $table->dropForeign([$column]);
                            }
                        }
                    }
                });
            }
        }
    }

    private function getForeignKeyName($table, $column)
    {
        return $table . '_' . $column . '_foreign';
    }
};