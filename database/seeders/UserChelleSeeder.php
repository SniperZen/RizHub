<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserChelleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if user exists
        $user = DB::table('users')->where('email', 'chellepbalero@gmail.com')->first();
        
        if (!$user) {
            // Insert new user
            $userId = DB::table('users')->insertGetId([
                'name' => 'Chelle Balero',
                'email' => 'chellepbalero@gmail.com',
                'email_verified_at' => now(), // Already validated
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

        // Define star distribution for first 35 kabanatas (different stars for each)
        $starDistribution = [
            1 => 3,  // Kabanata 1: 3 stars
            2 => 2,  // Kabanata 2: 2 stars
            3 => 1,  // Kabanata 3: 1 star
            4 => 3,
            5 => 2,
            6 => 1,
            7 => 3,
            8 => 2,
            9 => 1,
            10 => 3,
            11 => 2,
            12 => 1,
            13 => 3,
            14 => 2,
            15 => 1,
            16 => 3,
            17 => 2,
            18 => 1,
            19 => 3,
            20 => 2,
            21 => 1,
            22 => 3,
            23 => 2,
            24 => 1,
            25 => 3,
            26 => 2,
            27 => 1,
            28 => 3,
            29 => 2,
            30 => 1,
            31 => 3,
            32 => 2,
            33 => 1,
            34 => 3,
            35 => 2, // Kabanata 35: 2 stars
        ];

        // Create progress for all 64 kabanatas
        $kabanataProgress = [];
        for ($i = 1; $i <= 64; $i++) {
            if ($i <= 35) {
                // First 35 kabanatas: COMPLETED with different stars
                $stars = $starDistribution[$i];
                $progress = 10; // 100% complete
                $unlocked = true;
            } elseif ($i == 36) {
                // Kabanata 36: UNLOCKED but not started
                $stars = 0;
                $progress = 0;
                $unlocked = true;
            } else {
                // Kabanatas 37-64: LOCKED
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

        // Insert video progress (only for completed kabanatas 1-35)
        $videoProgress = [];
        foreach ($kabanataProgress as $progress) {
            if ($progress['kabanata_id'] <= 35 && isset($videoIds[$progress['kabanata_id']])) {
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

        // Insert guess word progress only for 3-star kabanatas (image gallery unlocked)
        $guesswordProgress = [];
        $imageUnlockedKabanatas = [];
        
        foreach ($kabanataProgressIds as $kabanataId => $kabanataProgressId) {
            // Only create guess word progress for kabanatas with 3 stars (1-35 only)
            if ($kabanataId <= 35) {
                $progressDetails = $kabanataProgress[$kabanataId - 1]; // Array is 0-indexed
                
                if ($progressDetails['stars'] === 3) {
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
        }
        
        if (!empty($guesswordProgress)) {
            DB::table('guessword_progress')->insert($guesswordProgress);
            $this->command->info("Inserted " . count($guesswordProgress) . " guess word progress records (for 3-star kabanatas)");
            $this->command->info("Image gallery unlocked for kabanatas: " . implode(', ', $imageUnlockedKabanatas));
        }

        // Clear existing quiz progress
        DB::table('quiz_progress')->whereIn('kabanata_progress_id', $kabanataProgressIds->values())->delete();

        // Insert quiz progress only for completed kabanatas (1-35)
        $quizProgress = [];
        foreach ($kabanataProgressIds as $kabanataId => $kabanataProgressId) {
            if ($kabanataId <= 35) {
                // Get progress details
                $progressDetails = $kabanataProgress[$kabanataId - 1];
                
                // Get quizzes for this kabanata
                $quizzes = DB::table('quizzes')->where('kabanata_id', $kabanataId)->get();
                
                if ($quizzes->count() > 0) {
                    // Determine if all answers should be correct based on stars
                    $allCorrect = ($progressDetails['stars'] >= 2); // 2 or 3 stars means mostly correct
                    
                    foreach ($quizzes as $quizIndex => $quiz) {
                        // For 3 stars: all correct, for 2 stars: mostly correct, for 1 star: some correct
                        if ($progressDetails['stars'] === 3) {
                            $isCorrect = 1;
                            $selectedAnswer = $quiz->correct_answer;
                        } elseif ($progressDetails['stars'] === 2) {
                            // 80% correct for 2 stars
                            $isCorrect = ($quizIndex < ($quizzes->count() * 0.8)) ? 1 : 0;
                            $selectedAnswer = $isCorrect ? $quiz->correct_answer : ($quiz->correct_answer === 'A' ? 'B' : 'A');
                        } else { // 1 star
                            // 50% correct for 1 star
                            $isCorrect = ($quizIndex < ($quizzes->count() * 0.5)) ? 1 : 0;
                            $selectedAnswer = $isCorrect ? $quiz->correct_answer : ($quiz->correct_answer === 'A' ? 'B' : 'A');
                        }
                        
                        $quizProgress[] = [
                            'kabanata_progress_id' => $kabanataProgressId,
                            'quiz_id' => $quiz->id,
                            'selected_answer' => $selectedAnswer,
                            'is_correct' => $isCorrect,
                            'score' => $isCorrect ? 1 : 0,
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
            $this->command->info("Inserted " . count($quizProgress) . " quiz progress records for completed kabanatas");
        }

        // Clear existing notifications for this user
        DB::table('notifications')->where('user_id', $userId)->delete();

        // Insert image unlock notifications only for 3-star kabanatas
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
        
        // Add completion notifications for all completed kabanatas (1-35)
        for ($i = 1; $i <= 35; $i++) {
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
        
        if (!empty($notifications)) {
            DB::table('notifications')->insert($notifications);
            $this->command->info("Inserted " . count($notifications) . " notifications");
        }

        // Check certificate eligibility (all first 35 kabanatas are completed)
        $first35Completed = DB::table('user_kabanata_progress')
            ->where('user_id', $userId)
            ->where('kabanata_id', '<=', 35)
            ->where('progress', '>=', 8)  // At least 80% progress
            ->count() === 35;

        if ($first35Completed) {
            DB::table('certificates')->updateOrInsert(
                ['user_id' => $userId],
                [
                    'unlocked' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
            $this->command->info("✅ Certificate unlocked for user ID: $userId (First 35 kabanatas completed)");
        } else {
            $this->command->info("Certificate not unlocked. Not all first 35 kabanatas are completed.");
        }

        $this->command->info('✅ Seeding completed successfully for Chelle Balero!');
        $this->command->info('📊 Progress Summary:');
        $this->command->info('   - Kabanatas 1-35: COMPLETED (mixed stars 1-3)');
        $this->command->info('   - Kabanata 36: UNLOCKED but not started (0 stars, 0 progress)');
        $this->command->info('   - Kabanatas 37-64: LOCKED');
        $this->command->info('   - Image gallery: UNLOCKED for 3-star kabanatas only');
        $this->command->info('   - Total 3-star kabanatas: ' . count($imageUnlockedKabanatas));
        $this->command->info('   - Email: VALIDATED (email_verified_at is set)');
    }
}