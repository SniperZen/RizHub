<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Use raw SQL to safely drop columns
        $this->safeDropColumnWithRawSQL('video_progress', 'user_id');
        $this->safeDropColumnWithRawSQL('guessword_progress', 'user_id');
        $this->safeDropColumnWithRawSQL('quiz_progress', 'user_id');

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

    private function safeDropColumnWithRawSQL(string $tableName, string $columnName)
    {
        if (!Schema::hasTable($tableName) || !Schema::hasColumn($tableName, $columnName)) {
            return;
        }

        try {
            // First, drop any foreign key constraints using raw SQL
            $constraints = DB::select("
                SELECT CONSTRAINT_NAME 
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = ? 
                AND TABLE_NAME = ? 
                AND COLUMN_NAME = ? 
                AND REFERENCED_TABLE_NAME IS NOT NULL
            ", [DB::getDatabaseName(), $tableName, $columnName]);

            foreach ($constraints as $constraint) {
                DB::statement("ALTER TABLE {$tableName} DROP FOREIGN KEY {$constraint->CONSTRAINT_NAME}");
            }

            // Drop any indexes on the column
            $indexes = DB::select("
                SELECT INDEX_NAME 
                FROM INFORMATION_SCHEMA.STATISTICS 
                WHERE TABLE_SCHEMA = ? 
                AND TABLE_NAME = ? 
                AND COLUMN_NAME = ?
            ", [DB::getDatabaseName(), $tableName, $columnName]);

            foreach ($indexes as $index) {
                if ($index->INDEX_NAME !== 'PRIMARY') {
                    DB::statement("ALTER TABLE {$tableName} DROP INDEX {$index->INDEX_NAME}");
                }
            }

            // Finally, drop the column
            DB::statement("ALTER TABLE {$tableName} DROP COLUMN {$columnName}");

        } catch (\Exception $e) {
            // If we can't drop the column, output the error but don't stop the migration
            echo "Could not drop column {$columnName} from {$tableName}: " . $e->getMessage() . "\n";
        }
    }

    private function ensureKabanataProgressForeignKeys()
    {
        $tables = ['video_progress', 'guessword_progress', 'quiz_progress'];
        
        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'kabanata_progress_id')) {
                $this->addForeignKeyIfNotExists(
                    $tableName,
                    'kabanata_progress_id',
                    'user_kabanata_progress',
                    'id',
                    'cascade'
                );
            }
        }
    }

    private function addForeignKeyIfNotExists(string $tableName, string $columnName, string $referencedTable, string $referencedColumn, string $onDelete = 'cascade')
    {
        $constraint = DB::select("
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = ? 
            AND COLUMN_NAME = ? 
            AND REFERENCED_TABLE_NAME = ?
        ", [DB::getDatabaseName(), $tableName, $columnName, $referencedTable]);

        if (empty($constraint)) {
            Schema::table($tableName, function (Blueprint $table) use ($columnName, $referencedTable, $referencedColumn, $onDelete) {
                $table->foreign($columnName)
                      ->references($referencedColumn)
                      ->on($referencedTable)
                      ->onDelete($onDelete);
            });
        }
    }
};