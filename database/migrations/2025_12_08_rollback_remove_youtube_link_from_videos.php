<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('videos', 'youtube_link')) {
            Schema::table('videos', function (Blueprint $table) {
                $table->dropColumn('youtube_link');
            });
        }
    }

    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->string('youtube_link')->nullable()->after('youtube_id');
        });
    }
};