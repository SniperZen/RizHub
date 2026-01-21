<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserLaizaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if user exists
        $user = DB::table('users')->where('email', 'laizavenzon07@gmail.com')->first();
        
        if (!$user) {
            // Insert new user
            $userId = DB::table('users')->insertGetId([
                'name' => 'Laiza Venzon',
                'email' => 'laizavenzon07@gmail.com',
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

        // Create progress for all 64 kabanatas
        $kabanataProgress = [];
        for ($i = 1; $i <= 64; $i++) {
            if ($i <= 5) {
                // Kabanatas 1-5: COMPLETED with 3 STARS
                $stars = 3; // ALL 3 STARS
                $progress = 10; // 100% complete
                $unlocked = true;
            } elseif ($i == 6) {
                // Kabanata 6: UNLOCKED but not started (play button only)
                $stars = 0;
                $progress = 0;
                $unlocked = true;
            } else {
                // Kabanatas 7-64: LOCKED
                $stars = 0;
                $progress = 0;
                $unlocked = false;
            }
            
            $kabanataProgress[] = [
                'user_id' => $userId,
                'kabanata_id' => $i,
                'progress' => $progress,
                'stars' => $stars,
                'unlocked' => $unlocked,
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

        // Insert video progress (only for completed kabanatas 1-5)
        $videoProgress = [];
        foreach ($kabanataProgress as $progress) {
            if ($progress['kabanata_id'] <= 5 && isset($videoIds[$progress['kabanata_id']])) {
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
        $this->command->info("Inserted " . count($videoProgress) . " video progress records for completed kabanatas");

        // Get kabanata progress IDs for all kabanatas
        $kabanataProgressIds = DB::table('user_kabanata_progress')
            ->where('user_id', $userId)
            ->pluck('id', 'kabanata_id');

        // Clear existing guess word progress
        DB::table('guessword_progress')->whereIn('kabanata_progress_id', $kabanataProgressIds->values())->delete();

        // Insert guess word progress for ALL completed kabanatas (ALL have 3 stars)
        $guesswordProgress = [];
        $imageUnlockedKabanatas = [];
        
        foreach ($kabanataProgressIds as $kabanataId => $kabanataProgressId) {
            // Create guess word progress for ALL completed kabanatas (1-5)
            if ($kabanataId <= 5) {
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
                    $imageUnlockedKabanatas[] = $kabanataId;
                }
            }
        }
        
        if (!empty($guesswordProgress)) {
            DB::table('guessword_progress')->insert($guesswordProgress);
            $this->command->info("Inserted " . count($guesswordProgress) . " guess word progress records (for ALL completed kabanatas)");
            $this->command->info("Image gallery unlocked for ALL completed kabanatas: " . implode(', ', $imageUnlockedKabanatas));
        }

        // Clear existing quiz progress
        DB::table('quiz_progress')->whereIn('kabanata_progress_id', $kabanataProgressIds->values())->delete();

        // Insert quiz progress only for completed kabanatas (1-5)
        $quizProgress = [];
        foreach ($kabanataProgressIds as $kabanataId => $kabanataProgressId) {
            if ($kabanataId <= 5) {
                // Get quizzes for this kabanata
                $quizzes = DB::table('quizzes')->where('kabanata_id', $kabanataId)->get();
                
                if ($quizzes->count() > 0) {
                    // ALL 3 STARS = ALL ANSWERS CORRECT
                    foreach ($quizzes as $quizIndex => $quiz) {
                        $quizProgress[] = [
                            'kabanata_progress_id' => $kabanataProgressId,
                            'quiz_id' => $quiz->id,
                            'selected_answer' => $quiz->correct_answer, // ALWAYS correct
                            'is_correct' => 1, // ALWAYS correct
                            'score' => 1, // Full points
                            'question_number' => $quizIndex + 1,
                            'total_questions' => $quizzes->count(),
                            'completed' => 1,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
            }
        }
        
        if (!empty($quizProgress)) {
            DB::table('quiz_progress')->insert($quizProgress);
            $this->command->info("Inserted " . count($quizProgress) . " quiz progress records for completed kabanatas (ALL correct answers)");
        }

        // Clear existing notifications for this user
        DB::table('notifications')->where('user_id', $userId)->delete();

        // Insert image unlock notifications for ALL completed kabanatas
        $notifications = [];
        foreach ($imageUnlockedKabanatas as $kabanataId) {
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
        
        // Add completion notifications for all completed kabanatas (1-5)
        for ($i = 1; $i <= 5; $i++) {
            $kabanata = DB::table('kabanatas')->where('id', $i)->first();
            if ($kabanata) {
                $progressDetails = $kabanataProgress[$i - 1];
                $stars = $progressDetails['stars'];
                
                $notifications[] = [
                    'user_id' => $userId,
                    'title' => "Kabanata $i Natapos",
                    'message' => "Nakumpleto mo ang \"" . $kabanata->kabanata . "\" na may $stars bituin!",
                    'is_read' => 0,
                    'type' => 'kabanata_complete',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        // Add notification about kabanata 6 being available
        $kabanata6 = DB::table('kabanatas')->where('id', 6)->first();
        if ($kabanata6) {
            $notifications[] = [
                'user_id' => $userId,
                'title' => "Bagong Kabanata Available",
                'message' => "Ang \"" . $kabanata6->kabanata . "\" ay available na para laruin!",
                'is_read' => 0,
                'type' => 'kabanata_unlock',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        if (!empty($notifications)) {
            DB::table('notifications')->insert($notifications);
            $this->command->info("Inserted " . count($notifications) . " notifications");
        }

        // Check certificate eligibility - NOT eligible (need more kabanatas)
        $completedKabanatas = DB::table('user_kabanata_progress')
            ->where('user_id', $userId)
            ->where('progress', '>=', 8)  // At least 80% progress
            ->count();

        if ($completedKabanatas >= 35) { // Need at least 35 kabanatas completed for certificate
            DB::table('certificates')->updateOrInsert(
                ['user_id' => $userId],
                [
                    'unlocked' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
            $this->command->info("✅ Certificate unlocked for user ID: $userId");
        } else {
            $this->command->info("Certificate not unlocked. Only $completedKabanatas kabanatas completed (need 35+).");
        }

        $this->command->info('✅ Seeding completed successfully for Laiza Venzon!');
        $this->command->info('📊 Progress Summary:');
        $this->command->info('   - Kabanatas 1-5: ✅ COMPLETED (ALL 3 STARS ⭐⭐⭐)');
        $this->command->info('   - Kabanata 6: 🔓 UNLOCKED but NOT STARTED (0 stars, 0 progress)');
        $this->command->info('   - Kabanatas 7-64: 🔒 LOCKED');
        $this->command->info('   - Image gallery: ✅ UNLOCKED for ALL completed kabanatas (1-5)');
        $this->command->info('   - Certificate: ❌ NOT unlocked (need 35+ completed kabanatas)');
        $this->command->info('   - Email: ✅ VERIFIED');
        $this->command->info('   - Quiz Performance: PERFECT (100% correct answers for all kabanatas)');
    }
}