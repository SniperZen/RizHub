<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyVideosTableRemoveAutoIncrement extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the foreign key constraint
        Schema::table('video_progress', function (Blueprint $table) {
            $table->dropForeign(['video_id']); // Ensure this matches your foreign key column
        });

        // Modify the id column in videos table
        Schema::table('videos', function (Blueprint $table) {
            // Drop the primary key constraint first
            $table->dropPrimary('id'); 
            // Change the id column to unsignedBigInteger without auto-increment
            $table->unsignedBigInteger('id')->change(); 
            // Set it back as primary key
            $table->primary('id'); 
        });

        // Re-add the foreign key constraint if necessary
        Schema::table('video_progress', function (Blueprint $table) {
            $table->foreign('video_id')->references('id')->on('videos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the foreign key constraint
        Schema::table('video_progress', function (Blueprint $table) {
            $table->dropForeign(['video_id']);
        });

        // Revert changes to the videos table
        Schema::table('videos', function (Blueprint $table) {
            $table->dropPrimary('id'); // Drop the primary key constraint
            $table->increments('id')->change(); // Change back to auto-incrementing
            $table->primary('id'); // Set it back as primary key
        });

        // Re-add the foreign key constraint
        Schema::table('video_progress', function (Blueprint $table) {
            $table->foreign('video_id')->references('id')->on('videos')->onDelete('cascade');
        });
    }
}
