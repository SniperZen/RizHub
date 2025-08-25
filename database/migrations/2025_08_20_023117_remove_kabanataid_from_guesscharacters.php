<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (Schema::hasTable('guesscharacters')) {
            Schema::table('guesscharacters', function (Blueprint $table) {
                // Check if the column exists before trying to drop it
                if (Schema::hasColumn('guesscharacters', 'kabanata_id')) {
                    // Drop the foreign key first if it exists
                    $table->dropForeign(['kabanata_id']);
                    // Then drop the column
                    $table->dropColumn('kabanata_id');
                }
            });
        }
    }

    public function down()
    {
        if (Schema::hasTable('guesscharacters')) {
            Schema::table('guesscharacters', function (Blueprint $table) {
                // Re-add the column
                $table->unsignedBigInteger('kabanata_id')->nullable()->after('id');
                // Re-add the foreign key constraint
                $table->foreign('kabanata_id')->references('id')->on('kabanatas')->onDelete('cascade');
            });
        }
    }
};
