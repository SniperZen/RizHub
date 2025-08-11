<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuessCharacter extends Model
{
    protected $table = 'guesscharacters';
    protected $fillable = ['c_name', 'filename'];
}
