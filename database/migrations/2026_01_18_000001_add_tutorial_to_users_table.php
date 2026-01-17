<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add tutorial_completed flag to track if user has finished the onboarding tour
            $table->boolean('tutorial_completed')->default(false)->after('sound');
            
            // Add tutorial_started_at to track when user started the tutorial
            $table->timestamp('tutorial_started_at')->nullable()->after('tutorial_completed');
            
            // Add tutorial_completed_at to track when user finished the tutorial
            $table->timestamp('tutorial_completed_at')->nullable()->after('tutorial_started_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['tutorial_completed', 'tutorial_started_at', 'tutorial_completed_at']);
        });
    }
};
