<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'usertype',
        'status',
        'music',
        'sound'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the kabanata progress for the user.
     */
    public function kabanataProgress()
    {
        return $this->hasMany(UserKabanataProgress::class);
    }

    /**
     * Get all video progress through kabanata progress.
     */
    public function videoProgress()
    {
        return $this->hasManyThrough(
            VideoProgress::class,
            UserKabanataProgress::class,
            'user_id',
            'kabanata_progress_id',
            'id',
            'id' 
        );
    }

    /**
     * Get all quiz progress through kabanata progress.
     */
    public function quizProgress()
    {
        return $this->hasManyThrough(
            QuizProgress::class,
            UserKabanataProgress::class,
            'user_id',
            'kabanata_progress_id',
            'id', 
            'id'
        );
    }

    /**
     * Get all guessword progress through kabanata progress.
     */
    public function guesswordProgress()
    {
        return $this->hasManyThrough(
            GuessWordProgress::class,
            UserKabanataProgress::class,
            'user_id',
            'kabanata_progress_id', 
            'id',
            'id' 
        );
    }
}