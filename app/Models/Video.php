<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    // OPTIONAL: if you want default auto-incrementing id keep default (remove $incrementing=false)
    // public $incrementing = false;
    // protected $keyType = 'int';

    protected $fillable = [
        'id',
        'title',
        'duration',
        'kabanata_id',
        'youtube_id',
    ];

    public function kabanata()
    {
        return $this->belongsTo(Kabanata::class, 'kabanata_id');
    }
}