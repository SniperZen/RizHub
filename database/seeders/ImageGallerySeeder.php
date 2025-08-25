<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImageGallerySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('image_galleries')->insert([
            [
                'kabanata_id' => 1,
                'title' => 'ISANG SALUSALO',
                'description' => 'Bahay ni Don Santiago...',
                'image_url' => '/Img/Dashboard/ImageGallery/K1.png', // Make sure this path is correct
                'category' => 'Lugar',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kabanata_id' => 2,
                'title' => 'SI CRISOSTOMO IBARRA',
                'description' => 'Crisostomo Ibarra...',
                'image_url' => '/Img/Dashboard/ImageGallery/K2.png', // Different image for each entry
                'category' => 'Tauhan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}