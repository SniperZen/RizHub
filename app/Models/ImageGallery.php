<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImageGallery extends Model
{
    protected $table = 'image_galleries'; // Make sure this is correct
    
    protected $fillable = [
        'kabanata_id',
        'title',
        'description',
        'image_url',
        'category',
        'created_at',
        'updated_at'
    ];
    
    public function kabanata()
    {
        return $this->belongsTo(Kabanata::class, 'kabanata_id');
    }
}