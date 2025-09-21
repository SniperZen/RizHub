<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kabanata extends Model
{
    use HasFactory;

    protected $table = 'kabanatas';

    protected $fillable = [
        'kabanata',
        'content',
        'title',
        'unlocked',
    ];

    public function videos()
    {
        return $this->hasMany(Video::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

}