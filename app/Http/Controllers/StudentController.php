<?php

namespace App\Http\Controllers;

use FFMpeg\FFProbe;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\InvitationMail;
use App\Models\Kabanata;
use App\Models\GuessCharacter; 
use App\Models\GuessWord; 
use App\Models\GuessWordProgress;
use App\Models\Quiz;
use App\Models\QuizProgress;
use App\Models\UserKabanataProgress;
use App\Models\VideoProgress;
use App\Models\Video;
use App\Models\ImageGallery;
use App\Models\Notification;
use App\Mail\ImageUnlockMail;

class StudentController extends Controller
{
    public function dash() {
        $user = Auth::user();
        $unreadNotifications = $user->unreadNotifications()->count();
        $notifications = $user->notifications()
        ->orderBy('created_at', 'desc')
        ->get();
        
        return Inertia::render('Dashboard/page', [
            'music' => $user->music ?? 40, 
            'sound' => $user->sound ?? 70,
            'name'  => $user->name ?? 'User101',
            'unreadNotifications' => $unreadNotifications,
            'notifications' => $notifications,
        ]);
    }

    public function exit()
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return redirect('/');
    }

    public function saveSettings(Request $request)
    {
        $user = Auth::user();
        $user->music = $request->music;
        $user->sound = $request->sound;
        $user->save();
        return back();
    }

    public function sendInvite(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'shareLink' => 'required|url',
        ]);

        // Send the email logic
        Mail::to($request->email)->send(new InvitationMail($request->shareLink));

        return back()->with('success', 'Invitation sent');
    }

    public function challenge(Request $request)
    {
        $user = Auth::user();
        $page = $request->input('page', 1);

        $kabanatas = Kabanata::paginate(7, ['*'], 'page', $page);

        // Get progress for these kabanatas for the user
        $progress = UserKabanataProgress::where('user_id', $user->id)
            ->whereIn('kabanata_id', $kabanatas->pluck('id'))
            ->get()
            ->keyBy('kabanata_id');

        // Get video progress for these kabanatas
        $videoProgress = [];
        if ($progress->count() > 0) {
            $videoProgress = VideoProgress::whereIn('kabanata_progress_id', $progress->pluck('id'))
                ->get()
                ->toArray();
        }

        // Merge progress into kabanata data
        $kabanatas->getCollection()->transform(function ($kabanata) use ($progress, $user) {
            $p = $progress[$kabanata->id] ?? null;
            
            // Initialize progress to 0
            $totalScore = 0;
            $maxPossible = 10;
            
            if ($p) {
                // Get quiz total score (max 5)
                $quizScore = QuizProgress::where('kabanata_progress_id', $p->id)
                    ->sum('score');
                
                // Get guessword total score (max 5)
                $guesswordScore = GuesswordProgress::where('kabanata_progress_id', $p->id)
                    ->sum('total_score');
                    
                // Ensure we don't exceed max possible
                $totalScore = min($quizScore + $guesswordScore, $maxPossible);
            }

            $kabanata->progress = $totalScore;
            $kabanata->stars = $p ? $p->stars : 0;
            $kabanata->unlocked = $p ? $p->unlocked : false;

            return $kabanata;
        });

        return Inertia::render('Challenge/page', [
            'kabanatas' => $kabanatas,
            'videoProgress' => $videoProgress,
            'music' => $user->music ?? 40, 
            'sound' => $user->sound ?? 70,
            'studentName' => auth()->user()->name,
        ]);
    }


    public function updateAudioSettings(Request $request)
    {
        $user = Auth::user();
        $user->music = $request->music;
        $user->sound = $request->sound;
        $user->save();
        return back();
    }

    public function store(Request $request)
    {
        $request->validate([
            'video' => 'required|mimes:mp4,mkv,avi,mov|max:500000',
            'kabanata_id' => 'required|exists:kabanatas,id',
        ]);

        $file = $request->file('video');
        $path = $file->store('videos', 'public');

        // Create FFProbe instance properly
        $ffprobe = FFProbe::create();
        $duration = $ffprobe->format(storage_path("app/public/" . $path))->get('duration');

        Video::create([
            'title' => $file->getClientOriginalName(),
            'file_path' => $path,
            'duration' => intval($duration),
            'kabanata_id' => $request->kabanata_id,
        ]);

        // return response()->json(['message' => 'Video added successfully!']);
    }

    private function getSessionKey($type, $kabanataId)
    {
        $userId = Auth::id();
        return "{$type}_progress_{$userId}_{$kabanataId}";
    }


    public function show($id)
    {
        $video = Video::findOrFail($id);
        return view('video-player', compact('video'));
    }

    public function saveVideoProgress(Request $request)
    {
        $request->validate([
            'kabanata_id' => 'required|exists:kabanatas,id',
            'completed' => 'required|boolean',
            'seconds_watched' => 'sometimes|integer|min:0',
            'perfect_score' => 'sometimes|boolean',
        ]);

        $user = Auth::user();
        
        // Get the video for this kabanata
        $video = Video::where('kabanata_id', $request->kabanata_id)->first();
        
        if (!$video) {
            return response()->json(['error' => 'Video not found for this kabanata'], 404);
        }
        
        // Get kabanata progress for this user
        $kabanataProgress = UserKabanataProgress::firstOrCreate([
            'user_id' => $user->id,
            'kabanata_id' => $request->kabanata_id,
        ]);
        
        // Store video progress in session using KABANATA_ID as the key (not video_id)
        $sessionKey = "video_progress_{$user->id}_{$request->kabanata_id}";
        $progressData = [
            'video_id' => $video->id,
            'completed' => $request->completed,
            'seconds_watched' => $request->seconds_watched ?? 0,
            'perfect_score' => $request->perfect_score ?? false,
            'kabanata_progress_id' => $kabanataProgress->id,
        ];
        
        session()->put($sessionKey, $progressData);

        // return response()->json(['message' => 'Video progress saved to session']);
    }


    public function GuessCharacterPicker()
    {
        $characters = GuessCharacter::all();

        return Inertia::render('GuessCharacterPicker', [
            'characters' => $characters
        ]);
    }

    public function guessCharacters(Request $request)
    {
        $characters = GuessCharacter::all();
        $kabanataId = $request->input('kabanata');

        $kabanata = Kabanata::find($kabanataId);

        return Inertia::render('Challenge/GuessCharacter/page', [
            'characters' => $characters,
            'kabanata_id' => $kabanataId,
            'kabanata_number' => $kabanata->id ?? 1,
            'kabanata_title' => $kabanata->title ?? 'Unknown',
        ]);
    }

    public function guessW($characterId, $kabanataId)
    {
        $character = GuessCharacter::findOrFail($characterId);
        
        // Get the kabanata details
        $kabanata = Kabanata::findOrFail($kabanataId);

        $questions = GuessWord::where('kabanata_id', $kabanataId)
            ->inRandomOrder()
            ->limit(5)
            ->get();

        // Get kabanata progress for this user and kabanata
        $kabanataProgress = UserKabanataProgress::firstOrCreate([
            'user_id' => auth()->id(),
            'kabanata_id' => $kabanataId,
        ]);

        // ✅ Get saved progress for this player using kabanata_progress_id
        $progress = GuessWordProgress::where('kabanata_progress_id', $kabanataProgress->id)
            ->where('character_id', $characterId)
            ->first();

        return Inertia::render('Challenge/GuessWord/page', [
            'character' => $character,
            'questions' => $questions,
            'kabanataId' => (int) $kabanataId,
            'kabanata_number' => $kabanata->id, // Add this
            'kabanata_title' => $kabanata->title, // Add this
            'savedProgress' => $progress ? $progress->current_index : 0,
        ]);
    }

    public function saveProgress(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'kabanata_id' => 'required|exists:kabanatas,id',
            'character_id' => 'required|exists:guesscharacters,id',
            'question_id' => 'required|exists:guess_words,id',
            'current_index' => 'required|integer|min:0',
            'completed' => 'sometimes|boolean',
            'total_score' => 'required|integer|min:0',
            'perfect_score' => 'sometimes|boolean',
            'is_correct' => 'required|boolean',
        ]);

        $user = Auth::user();
        
        // Store guessword progress in session
        $sessionKey = "guessword_progress_{$user->id}_{$request->kabanata_id}";
        $progressData = session()->get($sessionKey, []);
        
        $progressData = [
            'character_id' => $validated['character_id'],
            'question_id' => $validated['question_id'],
            'current_index' => $validated['current_index'],
            'completed' => $validated['completed'] ?? false,
            'total_score' => $validated['total_score'],
            'perfect_score' => $validated['perfect_score'] ?? false,
            'is_correct' => $validated['is_correct'],
        ];
        
        session()->put($sessionKey, $progressData);
    }


    private function calculateStars($score)
    {
        if ($score >= 5) return 3;
        if ($score === 4) return 2;
        if ($score === 3) return 1;
        return 0;
    }


    public function Quiz($kabanataId)
    {
        $quizzes = Quiz::where('kabanata_id', $kabanataId)->get();

        $kabanata = Kabanata::findOrFail($kabanataId);

        $kabanataProgress = UserKabanataProgress::firstOrCreate([
            'user_id' => auth()->id(),
            'kabanata_id' => $kabanataId,
        ]);
        
        return Inertia::render('Challenge/Quiz/page', [
            'kabanataId' => (int) $kabanataId,
            'quizzes' => $quizzes,
            'kabanata_number' => $kabanata->number ?? $kabanata->id, 
            'kabanata_title' => $kabanata->title,
        ]);
    }

    public function shows($kabanataId)
    {
        $quizzes = Quiz::where('kabanata_id', $kabanataId)->get();
        $kabanata = Kabanata::findOrFail($kabanataId);
        
        // Get user progress if authenticated
        $userProgress = null;
        if (Auth::check()) {
            $userProgress = $this->getQuizProgress(Auth::id(), $kabanataId);
        }

        return Inertia::render('Challenge/Quiz/Page', [
            'kabanataId' => (int) $kabanataId,
            'kabanataTitle' => $kabanata->title,
            'quizzes' => $quizzes,
            'userProgress' => $userProgress,
        ]);
    }

    /**
     * Save quiz progress.
     */
    public function saveProgresss(Request $request)
    {
        $request->validate([
            'kabanata_id' => 'required|exists:kabanatas,id',
            'quiz_id' => 'required|exists:quizzes,id',
            'selected_answer' => 'required|in:A,B,C',
            'score' => 'required|integer',
            'question_number' => 'required|integer',
            'total_questions' => 'required|integer',
            'completed' => 'sometimes|boolean',
        ]);

        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = Auth::user();
    
        // 1. Get or create the kabanata progress record FIRST
        $kabanataProgress = UserKabanataProgress::firstOrCreate([
            'user_id' => $user->id,
            'kabanata_id' => $request->kabanata_id,
        ]);

        $quiz = Quiz::findOrFail($request->quiz_id);
        $isCorrect = $quiz->correct_answer === $request->selected_answer;
        
        // 2. Check if a progress record for this specific quiz already exists in the DATABASE
        $existingProgress = QuizProgress::where([
            'kabanata_progress_id' => $kabanataProgress->id,
            'quiz_id' => $request->quiz_id,
        ])->first();

        // 3. Decide if we should save this new attempt
        $shouldSave = false;
        $reason = '';

        if (!$existingProgress) {
            // No record exists, so we save this first attempt.
            $shouldSave = true;
            $reason = 'first_attempt';
        } elseif ($request->score > $existingProgress->score) {
            // A record exists, but the new score is HIGHER. We save the better attempt.
            $shouldSave = true;
            $reason = 'higher_score';
        } else {
            // A record exists and the new score is LOWER or equal. We don't save it.
            $shouldSave = false;
            $reason = 'score_not_higher';
        }

        // 4. Store the decision and data in the session
        $sessionKey = "quiz_progress_{$user->id}_{$request->kabanata_id}";
        $progressData = session()->get($sessionKey, []);
        
        $progressData[$request->quiz_id] = [
            'selected_answer' => $request->selected_answer,
            'is_correct' => $isCorrect,
            'score' => $request->score,
            'question_number' => $request->question_number,
            'total_questions' => $request->total_questions,
            'completed' => $request->completed ?? false,
            'should_save_to_db' => $shouldSave,
            'save_reason' => $reason,
        ];
        
        session()->put($sessionKey, $progressData);

    }

    public function complete(Request $request)
    {
        $request->validate([
            'kabanata_id' => 'required|exists:kabanatas,id',
            'score' => 'required|integer',
            'total_questions' => 'required|integer',
        ]);

        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = Auth::user();
        
        // Get kabanata progress
        $kabanataProgress = UserKabanataProgress::firstOrCreate([
            'user_id' => $user->id,
            'kabanata_id' => $request->kabanata_id,
        ]);

        // Get all session data for this kabanata
        $quizSessionKey = "quiz_progress_{$user->id}_{$request->kabanata_id}";
        $guesswordSessionKey = "guessword_progress_{$user->id}_{$request->kabanata_id}";
        $videoSessionKey = "video_progress_{$user->id}_{$request->kabanata_id}";

        $quizProgressData = session()->get($quizSessionKey, []);
        $guesswordProgressData = session()->get($guesswordSessionKey, []);
        $videoProgressData = session()->get($videoSessionKey, []);

        foreach ($quizProgressData as $quizId => $data) {
            // Only proceed if the session data is flagged to be saved
            if ($data['should_save_to_db'] ?? false) {
                // Check if ANY record already exists with this kabanata_progress_id
                $existingRecord = QuizProgress::where([
                    'kabanata_progress_id' => $kabanataProgress->id,
                ])->first();

                if ($existingRecord) {
                    // UPDATE existing record only if new score is higher
                    // This maintains the ONE record per kabanata_progress_id rule
                    if ($data['score'] > $existingRecord->score) {
                        $existingRecord->update([
                            'quiz_id' => $quizId, // Update the quiz_id too
                            'selected_answer' => $data['selected_answer'],
                            'is_correct' => $data['is_correct'],
                            'score' => $data['score'],
                            'question_number' => $data['question_number'],
                            'total_questions' => $data['total_questions'],
                            'completed' => $data['completed'] ?? false,
                        ]);
                    }
                    // If score is not higher, do nothing (keep the existing record)
                } else {
                    // CREATE new record only if no record exists for this kabanata_progress_id
                    QuizProgress::create([
                        'kabanata_progress_id' => $kabanataProgress->id,
                        'quiz_id' => $quizId,
                        'selected_answer' => $data['selected_answer'],
                        'is_correct' => $data['is_correct'],
                        'score' => $data['score'],
                        'question_number' => $data['question_number'],
                        'total_questions' => $data['total_questions'],
                        'completed' => $data['completed'] ?? false,
                    ]);
                }
            }
        }

        // Save guessword progress to database if exists in session
        if (!empty($guesswordProgressData)) {
            // Get the highest existing score for this kabanata (regardless of character)
            $existingGuesswordProgress = GuesswordProgress::where([
                'kabanata_progress_id' => $kabanataProgress->id,
            ])->orderBy('total_score', 'desc')->first();

            // Only create/update if new score is higher than existing or no record exists
            if (!$existingGuesswordProgress || $guesswordProgressData['total_score'] > $existingGuesswordProgress->total_score) {
                if ($existingGuesswordProgress) {
                    // Update existing record with higher score
                    $existingGuesswordProgress->update([
                        'character_id' => $guesswordProgressData['character_id'],
                        'question_id' => $guesswordProgressData['question_id'],
                        'current_index' => $guesswordProgressData['current_index'],
                        'completed' => $guesswordProgressData['completed'],
                        'total_score' => $guesswordProgressData['total_score'],
                    ]);
                } else {
                    // Create new record if none exists
                    GuesswordProgress::create([
                        'kabanata_progress_id' => $kabanataProgress->id,
                        'character_id' => $guesswordProgressData['character_id'],
                        'question_id' => $guesswordProgressData['question_id'],
                        'current_index' => $guesswordProgressData['current_index'],
                        'completed' => $guesswordProgressData['completed'],
                        'total_score' => $guesswordProgressData['total_score'],
                    ]);
                }
            }
            // If new score is not higher, do nothing (don't create duplicate)
        }

        if (!empty($videoProgressData)) {
            // Use updateOrCreate to ensure only one record exists per combination
            VideoProgress::updateOrCreate(
                [
                    'video_id' => $videoProgressData['video_id'],
                    'kabanata_progress_id' => $videoProgressData['kabanata_progress_id'],
                ],
                [
                    'completed' => $videoProgressData['completed'],
                    'seconds_watched' => $videoProgressData['seconds_watched'],
                    'perfect_score' => $videoProgressData['perfect_score'] ?? false,
                ]
            );
        }

        // Clear all session data
        session()->forget($quizSessionKey);
        session()->forget($guesswordSessionKey);
        session()->forget($videoSessionKey);

        // Calculate final scores for star calculation
        $finalQuizScore = QuizProgress::where('kabanata_progress_id', $kabanataProgress->id)
            ->sum('score');
        
        // Get the highest guessword score for this kabanata
        $finalGuesswordScore = GuesswordProgress::where('kabanata_progress_id', $kabanataProgress->id)
            ->max('total_score') ?? 0;
        
        $totalScore = min($finalQuizScore + $finalGuesswordScore, 10);
        
        // Update kabanata progress with the total score
        $kabanataProgress->progress = $totalScore;
        
        // Calculate stars based on guessword score (3 points = 1 star, 4 points = 2 stars, 5 points = 3 stars)
        $stars = $this->calculateStars($finalGuesswordScore);
        
        // Update stars only if the new calculation is higher than current stars
        if ($stars > $kabanataProgress->stars) {
            $kabanataProgress->stars = $stars;
        }

        // Mark current kabanata as completed and unlocked
        $kabanataProgress->unlocked = true;
        $kabanataProgress->save();

        // Unlock the next kabanata
        $nextKabanataId = $request->kabanata_id + 1;
        
        if (Kabanata::where('id', $nextKabanataId)->exists()) {
            UserKabanataProgress::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'kabanata_id' => $nextKabanataId,
                ],
                [
                    'unlocked' => true,
                ]
            );
        }

        $totalScore = min($finalQuizScore + $finalGuesswordScore, 10);
    
    // Update kabanata progress with the total score
    $kabanataProgress->progress = $totalScore;
    
    // Calculate stars based on guessword score
    $stars = $this->calculateStars($finalGuesswordScore);
    
    // Update stars only if the new calculation is higher than current stars
    if ($stars > $kabanataProgress->stars) {
        $kabanataProgress->stars = $stars;
    }

    // Check if this achievement unlocks any images
    if ($finalGuesswordScore === 5) {
        $this->checkAndNotifyImageUnlocks($user, $request->kabanata_id);
    }

        return Inertia::location(route('challenge'));
    }

    private function checkAndNotifyImageUnlocks($user, $kabanataId)
{
    $images = ImageGallery::where('kabanata_id', $kabanataId)->get();
    
    foreach ($images as $image) {
        // Check if this image should be unlocked but notification not sent yet
        $alreadyNotified = Notification::where('user_id', $user->id)
            ->where('type', 'image_unlock')
            ->where('message', 'like', '%Kabanata ' . $kabanataId . '%')
            ->exists();

        if (!$alreadyNotified) {
            // Create notification
            $notification = Notification::create([
                'user_id' => $user->id,
                'title' => 'New Image Unlocked! 🎉',
                'message' => 'Congratulations! You unlocked a new image from Kabanata ' . $kabanataId . '. Check your gallery to view it!',
                'type' => 'image_unlock',
                'is_read' => false,
            ]);

            // Send email notification
            try {
                Mail::to($user->email)->queue(new ImageUnlockMail($notification, $image));
            } catch (\Exception $e) {
                \Log::error('Failed to send image unlock email: ' . $e->getMessage());
            }
        }
    }
}
    /**
     * Get user's quiz progress for a specific kabanata.
     */
    private function getQuizProgress($userId, $kabanataId)
    {
        $kabanataProgress = UserKabanataProgress::where('user_id', $userId)
            ->where('kabanata_id', $kabanataId)
            ->first();

        if (!$kabanataProgress) {
            return null;
        }

        $quizProgress = QuizProgress::where('kabanata_progress_id', $kabanataProgress->id)
            ->get();

        return [
            'total_score' => $quizProgress->sum('score'),
            'total_questions' => $quizProgress->count(),
            'correct_answers' => $quizProgress->where('is_correct', true)->count(),
        ];
    }

    /**
     * Reset user's progress for a specific kabanata.
     */
    public function resetProgress($kabanataId)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $kabanataProgress = UserKabanataProgress::where('user_id', Auth::id())
            ->where('kabanata_id', $kabanataId)
            ->first();

        if ($kabanataProgress) {
            // Delete related progress records
            QuizProgress::where('kabanata_progress_id', $kabanataProgress->id)->delete();
            GuessWordProgress::where('kabanata_progress_id', $kabanataProgress->id)->delete();
            
            // Reset kabanata progress
            $kabanataProgress->update([
                'progress' => 0,
                'stars' => 0,
                'unlocked' => false,
            ]);
        }
    }

    public function sample(){
        return Inertia::render('sample');
    }

    public function gallery()
    {
        $user = Auth::user();
        
        // Get all images with their kabanata
        $images = ImageGallery::with('kabanata')
            ->orderBy('kabanata_id')
            ->get();

        // For each image, check if it should be unlocked based on guessword progress
        $images->each(function ($image) use ($user) {
            // Get the kabanata progress for this user and kabanata
            $kabanataProgress = UserKabanataProgress::where('user_id', $user->id)
                ->where('kabanata_id', $image->kabanata_id)
                ->first();
                
            // Check if there's a completed guessword progress with perfect score (5)
            $guesswordProgress = null;
            if ($kabanataProgress) {
                $guesswordProgress = GuesswordProgress::where('kabanata_progress_id', $kabanataProgress->id)
                    ->where('completed', true)
                    ->where('total_score', 5) // Perfect score
                    ->first();
            }
            
            // Unlock the image if perfect score was achieved
            $image->unlocked = (bool) $guesswordProgress;
            $image->image_url = asset($image->image_url);
        });

        return Inertia::render('Dashboard/ImageGallery/page', [
            'images' => $images
        ]);
    }

    public function notifications()
    {
        $user = Auth::user();
        $notifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'notifications' => $notifications
        ]);
    }

    public function markAsRead()
    {
        $user = Auth::user();
        $user->notifications()->update(['is_read' => true]);

        // return response()->json(['success' => true]);
    }

    public function sendNotification(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'nullable|string'
        ]);

        Notification::create([
            'user_id' => $request->user_id,
            'title' => $request->title,
            'message' => $request->message,
            'type' => $request->type ?? 'general',
        ]);

        // return response()->json(['success' => true]);
    }

    public function markAsReads(Request $request)
    {
        $request->validate([
            'notification_id' => 'required|exists:notifications,id'
        ]);

        $notification = Notification::where('id', $request->notification_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $notification->update(['is_read' => true]);

        // return response()->json(['success' => true]);
    }

    public function markAsUnread(Request $request)
    {
        $request->validate([
            'notification_id' => 'required|exists:notifications,id'
        ]);

        $notification = Notification::where('id', $request->notification_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $notification->update(['is_read' => false]);

        // return response()->json(['success' => true]);
    }

    public function markAllAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $notification->delete();

        // return response()->json(['success' => true]);
    }

    public function destroyAll()
    {
        Notification::where('user_id', Auth::id())->delete();

        // return response()->json(['success' => true]);
    }

}