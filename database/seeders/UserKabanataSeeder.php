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
                'progress' => 10,
                'stars' => 3,
                'unlocked' => true,
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

        // Get kabanata progress IDs for all kabanatas
        $kabanataProgressIds = DB::table('user_kabanata_progress')
            ->where('user_id', $userId)
            ->pluck('id', 'kabanata_id');

        // Clear existing guess word progress
        DB::table('guessword_progress')->whereIn('kabanata_progress_id', $kabanataProgressIds->values())->delete();

        // Insert guess word progress for all kabanatas
        $guesswordProgress = [];
        foreach ($kabanataProgressIds as $kabanataId => $kabanataProgressId) {
            // Get guess words for this kabanata
            $guessWords = DB::table('guess_words')->where('kabanata_id', $kabanataId)->get();
            
            if ($guessWords->count() > 0) {
                foreach ($guessWords as $index => $guessWord) {
                    $guesswordProgress[] = [
                        'kabanata_progress_id' => $kabanataProgressId,
                        'character_id' => 1, // Default character
                        'question_id' => $guessWord->id,
                        'current_index' => 0,
                        'completed' => 1,
                        'total_score' => 5, // Perfect score required for image unlock
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }
        
        if (!empty($guesswordProgress)) {
            DB::table('guessword_progress')->insert($guesswordProgress);
            $this->command->info("Inserted " . count($guesswordProgress) . " guess word progress records");
        }

        // Clear existing quiz progress
        DB::table('quiz_progress')->whereIn('kabanata_progress_id', $kabanataProgressIds->values())->delete();

        // Insert quiz progress for all kabanatas
        $quizProgress = [];
        foreach ($kabanataProgressIds as $kabanataId => $kabanataProgressId) {
            // Get quizzes for this kabanata
            $quizzes = DB::table('quizzes')->where('kabanata_id', $kabanataId)->get();
            
            if ($quizzes->count() > 0) {
                foreach ($quizzes as $quizIndex => $quiz) {
                    $quizProgress[] = [
                        'kabanata_progress_id' => $kabanataProgressId,
                        'quiz_id' => $quiz->id,
                        'selected_answer' => $quiz->correct_answer, // Assume correct answer
                        'is_correct' => 1,
                        'score' => 1, // Points per question
                        'question_number' => $quizIndex + 1,
                        'total_questions' => 10,
                        'completed' => 1,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }
        
        if (!empty($quizProgress)) {
            DB::table('quiz_progress')->insert($quizProgress);
            $this->command->info("Inserted " . count($quizProgress) . " quiz progress records");
        }

        // Clear existing notifications for this user
        DB::table('notifications')->where('user_id', $userId)->delete();

        // Insert image unlock notifications for all kabanatas
        $notifications = [];
        foreach ($kabanataProgressIds as $kabanataId => $kabanataProgressId) {
            $kabanata = DB::table('kabanatas')->where('id', $kabanataId)->first();
            if ($kabanata) {
                $notifications[] = [
                    'user_id' => $userId,
                    'title' => "Larawan Nang-unlock: Kabanata $kabanataId",
                    'message' => "Nakamit mo ang lahat ng hamon sa \"" . $kabanata->kabanata . "\". Ang mga eksklusibong larawan ay nang-unlock na!",
                    'is_read' => 0,
                    'type' => 'image_unlock',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        if (!empty($notifications)) {
            DB::table('notifications')->insert($notifications);
            $this->command->info("Inserted " . count($notifications) . " image unlock notifications");
        }

        // Unlock certificate if all kabanatas are completed (progress >= 8/10 = 80%)
        $allCompleted = DB::table('user_kabanata_progress')
            ->where('user_id', $userId)
            ->where('progress', '<', 8)  // Check if any kabanata is below 80%
            ->doesntExist();


        $this->command->info('✅ Seeding completed successfully!');
    }
}