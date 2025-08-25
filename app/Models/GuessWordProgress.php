<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuessWordProgress extends Model
{
    protected $table = 'guessword_progress';

    protected $fillable = [
        'kabanata_progress_id',
        'character_id',
        'question_id',
        'current_index',
        'completed',
        'total_score',
    ];

    protected $casts = [
        'completed' => 'boolean',
    ];

    /**
     * Get the kabanata progress that owns this guessword progress.
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
            'kabanata_progress_id', // Local key on guessword_progress table
            'user_id' // Local key on UserKabanataProgress table
        );
    }

    /**
     * Get the character associated with the progress.
     */
    public function character()
    {
        return $this->belongsTo(Questionnaire::class, 'character_id');
    }

    /**
     * Get the question associated with the progress.
     */
    public function question()
    {
        return $this->belongsTo(GuessWord::class, 'question_id');
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