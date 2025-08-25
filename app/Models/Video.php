<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    // Disable auto-incrementing since we're using kabanata IDs as video IDs
    public $incrementing = false;
    
    // Set the key type to integer
    protected $keyType = 'int';
    
    protected $fillable = [
        'id',
        'title',
        'file_path',
        'duration',
        'kabanata_id' 
    ];

    // Relationship to kabanata (using kabanata_id column)
    public function kabanata()
    {
        return $this->belongsTo(Kabanata::class, 'kabanata_id');
    }
}