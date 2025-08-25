<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('kabanata_id')->constrained()->onDelete('cascade');
            $table->foreignId('quiz_id')->constrained()->onDelete('cascade');
            $table->string('selected_answer', 1); // A, B, or C
            $table->boolean('is_correct');
            $table->integer('score');
            $table->integer('question_number');
            $table->integer('total_questions');
            $table->boolean('completed')->default(false);
            $table->timestamps();
            
            // Unique constraint to prevent duplicate entries for the same user and quiz
            $table->unique(['user_id', 'quiz_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_progress');
    }
};