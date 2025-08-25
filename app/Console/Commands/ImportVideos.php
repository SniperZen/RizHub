<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Video;
use App\Models\Kabanata;
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
            if (in_array($file, ['.', '..'])) continue;
            $filePath = $folderPath . DIRECTORY_SEPARATOR . $file;

            // Skip non-video files
            if (!is_file($filePath) || !preg_match('/\.(mp4|mkv|avi|mov)$/i', $file)) continue;

            // Extract kabanata number from filename (e.g., K1.mp4 -> 1, K2.mp4 -> 2)
            preg_match('/K(\d+)\./i', $file, $matches);
            $kabanataNumber = $matches[1] ?? null;

            if (!$kabanataNumber) {
                $this->error("Could not extract kabanata number from filename: {$file}");
                continue;
            }

            // Convert to integer
            $kabanataId = (int)$kabanataNumber;

            // Check if kabanata exists
            $kabanata = Kabanata::find($kabanataId);

            if (!$kabanata) {
                $this->error("Kabanata ID {$kabanataId} not found in database for file: {$file}");
                continue;
            }

            // Get duration
            $fileInfo = $getID3->analyze($filePath);
            $duration = isset($fileInfo['playtime_seconds']) ? intval($fileInfo['playtime_seconds']) : null;

            // Insert into DB using kabanataId as the video ID
            Video::updateOrCreate(
                ['id' => $kabanataId],
                [
                    'title' => $file,
                    'file_path' => 'Video/' . $file,
                    'duration' => $duration,
                    'kabanata_id' => $kabanataId,
                ]
            );

            $this->info("Inserted: {$file} -> Video ID: {$kabanataId}, Kabanata ID: {$kabanataId} ({$duration}s)");
        }

        $this->info("Video import completed!");
    }
}