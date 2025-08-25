<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('guessword_progress', function (Blueprint $table) {
            $table->integer('total_score')->default(0)->after('completed');
        });
    }

    public function down(): void {
        Schema::table('guessword_progress', function (Blueprint $table) {
            $table->dropColumn('total_score');
        });
    }
};
