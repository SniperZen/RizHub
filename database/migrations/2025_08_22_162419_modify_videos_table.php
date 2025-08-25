<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, drop foreign key constraints that reference the videos table
        Schema::table('video_progress', function (Blueprint $table) {
            // Check if the foreign key exists before trying to drop it
            $foreignKeys = DB::select("
                SELECT CONSTRAINT_NAME 
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                WHERE TABLE_NAME = 'video_progress' 
                AND COLUMN_NAME = 'video_id' 
                AND CONSTRAINT_NAME LIKE '%_foreign'
            ");

            if (!empty($foreignKeys)) {
                $table->dropForeign(['video_id']);
            }
        });

        // Drop the existing videos table
        Schema::dropIfExists('videos');

        // Recreate the videos table with the desired structure
        Schema::create('videos', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary(); // Same as kabanata_id, not auto-increment
            $table->string('title');
            $table->string('file_path');
            $table->integer('duration')->nullable();
            $table->timestamps();

            // Add foreign key constraint to kabanatas table
            $table->foreign('id')->references('id')->on('kabanatas')->onDelete('cascade');
        });

        // Re-add the foreign key constraint to video_progress table
        Schema::table('video_progress', function (Blueprint $table) {
            $table->foreign('video_id')->references('id')->on('videos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop foreign key constraint from video_progress table
        Schema::table('video_progress', function (Blueprint $table) {
            $foreignKeys = DB::select("
                SELECT CONSTRAINT_NAME 
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                WHERE TABLE_NAME = 'video_progress' 
                AND COLUMN_NAME = 'video_id' 
                AND CONSTRAINT_NAME LIKE '%_foreign'
            ");

            if (!empty($foreignKeys)) {
                $table->dropForeign(['video_id']);
            }
        });

        // Drop the videos table
        Schema::dropIfExists('videos');

        // Recreate the original videos table structure
        Schema::create('videos', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID
            $table->string('title');
            $table->string('file_path');
            $table->integer('duration')->nullable();
            $table->unsignedBigInteger('kabanata_id');
            $table->timestamps();

            // Add foreign key constraint
            $table->foreign('kabanata_id')->references('id')->on('kabanatas')->onDelete('cascade');
        });

        // Re-add the foreign key constraint to video_progress table
        Schema::table('video_progress', function (Blueprint $table) {
            $table->foreign('video_id')->references('id')->on('videos')->onDelete('cascade');
        });
    }
};