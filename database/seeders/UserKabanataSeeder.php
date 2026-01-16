<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserKabanataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if user exists
        $user = DB::table('users')->where('email', 'martjustine56@gmail.com')->first();
        
        if (!$user) {
            // Insert new user
            $userId = DB::table('users')->insertGetId([
                'name' => 'Mart Justine',
                'email' => 'martjustine56@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('Qwerty_123'),
                'usertype' => 'student',
                'status' => 'active',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'music' => 100,
                'sound' => 100,
            ]);
        } else {
            $userId = $user->id;
            // Update existing user
            DB::table('users')->where('id', $userId)->update([
                'email_verified_at' => now(),
                'password' => Hash::make('Qwerty_123'),
                'usertype' => 'student',
                'status' => 'active',
                'updated_at' => now(),
                'music' => 100,
                'sound' => 100,
            ]);
        }
        
        $this->command->info("User ID: $userId");

        // Check if kabanatas exist
        $kabanatasCount = DB::table('kabanatas')->count();
        
        if ($kabanatasCount === 0) {
            $this->command->error('No kabanatas found! Run KabanataSeeder first.');
            return;
        }

        // Clear existing progress for this user
        DB::table('user_kabanata_progress')->where('user_id', $userId)->delete();

        // Insert progress for all 64 kabanata
        $kabanataProgress = [];
        for ($i = 1; $i <= 64; $i++) {
            $kabanataProgress[] = [
                'user_id' => $userId,
                'kabanata_id' => $i,
                'progress' => 100,
                'stars' => 3,
                'unlocked' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        DB::table('user_kabanata_progress')->insert($kabanataProgress);
        $this->command->info("Inserted " . count($kabanataProgress) . " kabanata progress records");

        // Check if videos already exist
        $existingVideos = DB::table('videos')->count();
        
        if ($existingVideos === 0) {
            // Insert videos for all 64 kabanata
            $videos = [];
            for ($i = 1; $i <= 64; $i++) {
                $videos[] = [
                    'kabanata_id' => $i,
                    'title' => "Kabanata $i Video",
                    'youtube_id' => "youtube_id_$i",
                    'duration' => rand(300, 900),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            DB::table('videos')->insert($videos);
            $this->command->info("Inserted " . count($videos) . " video records");
        }

        // Get video IDs
        $videoIds = DB::table('videos')->pluck('id', 'kabanata_id');
        
        // Clear existing video progress
        DB::table('video_progress')->whereIn('kabanata_progress_id', 
            DB::table('user_kabanata_progress')->where('user_id', $userId)->pluck('id')
        )->delete();

        // Insert video progress
        $videoProgress = [];
        foreach ($kabanataProgress as $progress) {
            if (isset($videoIds[$progress['kabanata_id']])) {
                $kabanataProgressId = DB::table('user_kabanata_progress')
                    ->where('user_id', $userId)
                    ->where('kabanata_id', $progress['kabanata_id'])
                    ->value('id');
                
                if ($kabanataProgressId) {
                    $videoProgress[] = [
                        'kabanata_progress_id' => $kabanataProgressId,
                        'video_id' => $videoIds[$progress['kabanata_id']],
                        'seconds_watched' => rand(300, 900), // Full watch
                        'completed' => 1,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }
        
        DB::table('video_progress')->insert($videoProgress);
        $this->command->info("Inserted " . count($videoProgress) . " video progress records");

        // Unlock certificate if all kabanatas are completed
        $allCompleted = DB::table('user_kabanata_progress')
            ->where('user_id', $userId)
            ->where('progress', '<', 100)
            ->doesntExist();

        if ($allCompleted) {
            DB::table('certificates')->updateOrInsert(
                ['user_id' => $userId],
                [
                    'unlocked' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
            $this->command->info("Certificate unlocked for user ID: $userId");
        } else {
            $this->command->info("Certificate not unlocked. Not all kabanatas are completed.");
        }

        $this->command->info('✅ Seeding completed successfully!');
    }
}