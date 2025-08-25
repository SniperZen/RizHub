<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizProgress extends Model
{
    use HasFactory;

    protected $table = 'quiz_progress';

    protected $fillable = [
        'kabanata_progress_id', // Changed from user_id
        'quiz_id',
        'selected_answer',
        'is_correct',
        'score',
        'question_number',
        'total_questions',
        'completed',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'completed' => 'boolean',
    ];

    /**
     * Get the kabanata progress that owns the quiz progress.
     */
    public function kabanataProgress()
    {
        return $this->belongsTo(UserKabanataProgress::class, 'kabanata_progress_id');
    }

    /**
     * Get the user through kabanata progress.
     */
    public function user()
    {
        return $this->hasOneThrough(
            User::class,
            UserKabanataProgress::class,
            'id', // Foreign key on UserKabanataProgress table
            'id', // Foreign key on User table
            'kabanata_progress_id', // Local key on quiz_progress table
            'user_id' // Local key on UserKabanataProgress table
        );
    }

    /**
     * Get the quiz that owns the quiz progress.
     */
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Get the kabanata through kabanata progress.
     */
    public function kabanata()
    {
        return $this->hasOneThrough(
            Kabanata::class,
            UserKabanataProgress::class,
            'id',
            'id',
            'kabanata_progress_id',
            'kabanata_id'
        );
    }
}