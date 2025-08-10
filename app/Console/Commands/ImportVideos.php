<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Video;
use getID3;

class ImportVideos extends Command
{
    protected $signature = 'videos:import';
    protected $description = 'Import existing videos from public/Video into the database';

    public function handle()
    {
        $getID3 = new getID3;
        $folderPath = public_path('Video');

        if (!is_dir($folderPath)) {
            $this->error("Folder not found: " . $folderPath);
            return;
        }

        $files = scandir($folderPath);

        foreach ($files as $file) {
            if (in_array($file, ['.', '..'])) continue; // skip system dirs
            $filePath = $folderPath . DIRECTORY_SEPARATOR . $file;

            // Skip non-video files
            if (!is_file($filePath) || !preg_match('/\.(mp4|mkv|avi|mov)$/i', $file)) continue;

            // Skip if already in DB
            if (Video::where('file_path', 'Video/' . $file)->exists()) continue;

            // Get duration
            $fileInfo = $getID3->analyze($filePath);
            $duration = isset($fileInfo['playtime_seconds']) ? intval($fileInfo['playtime_seconds']) : null;

            // Insert into DB
            Video::create([
                'title' => $file,
                'file_path' => 'Video/' . $file, // relative to public folder
                'duration' => $duration,
            ]);

            $this->info("Inserted: {$file} ({$duration}s)");
        }
    }
}
