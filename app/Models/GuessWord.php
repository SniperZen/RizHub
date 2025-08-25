<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuessWord extends Model
{
    protected $fillable = ['question', 'answer', 'pickedChar'];
}