<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('guessword_progress', function (Blueprint $table) {
            $table->unsignedBigInteger('question_id')->nullable()->after('kabanata_id');
            $table->boolean('completed')->default(false)->after('current_index');
        });
    }

    public function down(): void {
        Schema::table('guessword_progress', function (Blueprint $table) {
            $table->dropColumn(['question_id', 'completed']);
        });
    }
};
