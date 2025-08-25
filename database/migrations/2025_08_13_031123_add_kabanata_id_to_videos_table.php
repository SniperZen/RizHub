<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            // Add kabanata_id as unsigned big integer and nullable first
            $table->unsignedBigInteger('kabanata_id')->nullable()->after('id');

            $table->foreign('kabanata_id')
                  ->references('id')
                  ->on('kabanatas')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->dropForeign(['kabanata_id']);
            $table->dropColumn('kabanata_id');
        });
    }
};
