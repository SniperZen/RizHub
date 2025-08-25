<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageGallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'kabanata_id',
        'title',
        'description',
        'image_url',
        'category',
    ];

    public function kabanata()
    {
        return $this->belongsTo(Kabanata::class);
    }
}