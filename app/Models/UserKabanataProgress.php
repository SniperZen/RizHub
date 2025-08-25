<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserKabanataProgress extends Model
{
    use HasFactory;

    protected $table = 'user_kabanata_progress';

    protected $fillable = [
        'user_id',
        'kabanata_id',
        'progress',
        'stars',
        'unlocked',
    ];

    protected $casts = [
        'unlocked' => 'boolean',
    ];

    /**
     * Get the user that owns the progress.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the kabanata that owns the progress.
     */
    public function kabanata()
    {
        return $this->belongsTo(Kabanata::class);
    }

    /**
     * Get the video progress for this kabanata progress.
     */
    public function videoProgress()
    {
        return $this->hasMany(VideoProgress::class, 'kabanata_progress_id');
    }

    /**
     * Get the quiz progress for this kabanata progress.
     */
    public function quizProgress()
    {
        return $this->hasMany(QuizProgress::class, 'kabanata_progress_id');
    }

    /**
     * Get the guessword progress for this kabanata progress.
     */
    public function guesswordProgress()
    {
        return $this->hasMany(GuessWordProgress::class, 'kabanata_progress_id');
    }

    /**
     * Calculate stars based on guessword progress.
     */
    public static function calculateStars($userId, $kabanataId)
    {
        $kabanataProgress = self::where('user_id', $userId)
            ->where('kabanata_id', $kabanataId)
            ->first();

        if (!$kabanataProgress) {
            return 0;
        }

        $score = $kabanataProgress->guesswordProgress()
            ->where('completed', true)
            ->count();

        if ($score < 3) return 0;
        if ($score == 3) return 1;
        if ($score == 4) return 2;
        return 3;
    }

    public static function calculateProgress($userId, $kabanataId)
{
    $kabanataProgress = self::where('user_id', $userId)
        ->where('kabanata_id', $kabanataId)
        ->first();

    if (!$kabanataProgress) return;

    $totalComponents = 3;
    $completedComponents = 0;
    
    $videoCompleted = VideoProgress::where('kabanata_progress_id', $kabanataProgress->id)
        ->where('completed', true)
        ->exists();
    
    if ($videoCompleted) $completedComponents++;
    
    // Check GuessWord completion
    $guessWordCompleted = GuessWordProgress::where('kabanata_progress_id', $kabanataProgress->id)
        ->where('completed', true)
        ->exists();
    
    if ($guessWordCompleted) $completedComponents++;
    
    // Check Quiz completion
    $quizCompleted = QuizProgress::where('kabanata_progress_id', $kabanataProgress->id)
        ->where('completed', true)
        ->exists();
    
    if ($quizCompleted) $completedComponents++;
    
    // Update progress (0-10 scale)
    $kabanataProgress->progress = round(($completedComponents / $totalComponents) * 10);
    $kabanataProgress->save();
    
    return $kabanataProgress->progress;
}
}