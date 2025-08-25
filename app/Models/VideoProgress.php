<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoProgress extends Model
{
    use HasFactory;

    protected $table = 'video_progress';

    protected $fillable = [
        'user_id',
        'video_id',
        'kabanata_progress_id',
        'seconds_watched',
        'completed',
    ];

    protected $casts = [
        'completed' => 'boolean',
    ];

    /**
     * Get the user that owns the video progress.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the video that owns the progress.
     */
    public function video()
    {
        return $this->belongsTo(Video::class);
    }

    /**
     * Get the kabanata progress that owns the video progress.
     */
    public function kabanataProgress()
    {
        return $this->belongsTo(UserKabanataProgress::class, 'kabanata_progress_id');
    }
}