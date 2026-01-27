<?php

namespace App\Http\Controllers;

use FFMpeg\FFProbe;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
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
use App\Helpers\HashIdHelper;

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

    public function book($kabanata = null)
    {
        Log::info('Book route accessed', ['kabanata' => $kabanata]);
        
        // Decode if kabanata is hashed
        if ($kabanata && !is_numeric($kabanata)) {
            $decoded = HashIdHelper::decrypt($kabanata);
            $kabanata = $decoded ? (int) $decoded : $kabanata;
        }
        
        return Inertia::render('Dashboard/Book/Page', [
            'kabanata' => $kabanata,
        ]);
    }

    public function help()
    {
        $user = Auth::user();
        $unreadNotifications = $user->unreadNotifications()->count();
        $notifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Dashboard/help/page', [
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
        $validated = $request->validate([
            'music' => 'required|integer|min:0|max:100',
            'sound' => 'required|integer|min:0|max:100',
        ]);
        
        $user = Auth::user();
        $user->music = $validated['music'];
        $user->sound = $validated['sound'];
        $user->save();
        
        return back();
    }

    public function sendInvite(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'shareLink' => 'required|url',
        ]);

        Mail::to($request->email)->send(new InvitationMail($request->shareLink));

        return back();
    }

    public function challenge(Request $request)
    {
        $user = Auth::user();
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 7);

        $kabanatas = Kabanata::where('id', '<=', 64)->paginate($perPage, ['*'], 'page', $page);

        $progress = UserKabanataProgress::where('user_id', $user->id)
            ->whereIn('kabanata_id', $kabanatas->pluck('id'))
            ->get()
            ->keyBy('kabanata_id');

        $videoProgress = [];
        if ($progress->count() > 0) {
            $videoProgress = VideoProgress::whereIn('kabanata_progress_id', $progress->pluck('id'))
                ->get()
                ->toArray();
        }

        $kabanatas->getCollection()->transform(function ($kabanata) use ($progress, $user) {
            $p = $progress[$kabanata->id] ?? null;
            
            $totalScore = 0;
            $maxPossible = 10;
            
            if ($p) {
                $quizScore = QuizProgress::where('kabanata_progress_id', $p->id)
                    ->sum('score');
                
                $guesswordScore = GuesswordProgress::where('kabanata_progress_id', $p->id)
                    ->sum('total_score');
                    
                $totalScore = min($quizScore + $guesswordScore, $maxPossible);
            }

            $kabanata->progress = $totalScore;
            $kabanata->stars = $p ? $p->stars : 0;
            $kabanata->unlocked = $p ? $p->unlocked : false;

            // Use URL-safe hash
            $kabanata->hash = HashIdHelper::encrypt($kabanata->id);

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
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $request->validate([
            'kabanata_id' => 'required|exists:kabanatas,id',
            'completed' => 'required|boolean',
            'seconds_watched' => 'sometimes|integer|min:0',
            'youtube_id' => 'sometimes|string|nullable',
        ]);

        $user = Auth::user();
        $youtubeId = $request->youtube_id ? trim($request->youtube_id) : null;

        Log::info('Video progress save attempt', [
            'user_id' => $user->id,
            'kabanata_id' => $request->kabanata_id,
            'youtube_id' => $youtubeId,
            'completed' => $request->completed,
            'seconds_watched' => $request->seconds_watched
        ]);

        try {
            $kabanataProgress = UserKabanataProgress::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'kabanata_id' => $request->kabanata_id,
                ],
                [
                    'unlocked' => true,
                    'progress' => 0,
                    'stars' => 0
                ]
            );

            $video = Video::updateOrCreate(
                ['kabanata_id' => $request->kabanata_id],
                [
                    'title' => $youtubeId ? 'YouTube - ' . $youtubeId : ('Video for kabanata ' . $request->kabanata_id),
                    'duration' => 0,
                    'youtube_id' => $youtubeId,
                ]
            );

            $videoProgress = VideoProgress::updateOrCreate(
                [
                    'video_id' => $video->id,
                    'kabanata_progress_id' => $kabanataProgress->id,
                ],
                [
                    'seconds_watched' => $request->seconds_watched ?? 0,
                    'completed' => (bool)$request->completed,
                ]
            );

            Log::info('Video progress saved successfully', [
                'video_id' => $video->id,
                'video_progress_id' => $videoProgress->id
            ]);

            return back();

        } catch (\Exception $e) {
            Log::error('Error saving video progress: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return back();
        }
    }

    public function GuessCharacterPicker()
    {
        $characters = GuessCharacter::all();

        return Inertia::render('GuessCharacterPicker', [
            'characters' => $characters
        ]);
    }

    public function guessCharacters(Request $request, $kabanata = null)
    {
        Log::info('guessCharacters accessed', [
            'kabanata_parameter' => $kabanata,
            'request_url' => $request->fullUrl()
        ]);
        
        $characters = GuessCharacter::all();
        
        // Decode hashed kabanata if necessary
        if ($kabanata) {
            $decoded = HashIdHelper::decrypt($kabanata);
            $kabanataId = $decoded ? (int) $decoded : (is_numeric($kabanata) ? (int) $kabanata : null);
        } else {
            $kabanataId = null;
        }

        $kabanata = $kabanataId ? Kabanata::find($kabanataId) : null;

        Log::info('Decoded kabanata', [
            'original' => $kabanata,
            'decoded_id' => $kabanataId,
            'found_kabanata' => $kabanata ? $kabanata->toArray() : null
        ]);

        return Inertia::render('Challenge/GuessCharacter/page', [
            'characters' => $characters,
            'kabanata_id' => $kabanataId,
            'kabanataHash' => $kabanata ? HashIdHelper::encrypt($kabanataId) : null,
            'kabanata_number' => $kabanata->id ?? 1,
            'kabanata_title' => $kabanata->title ?? 'Unknown',
        ]);
    }

    public function guessW($characterId, $kabanata = null)
    {
        Log::info('guessW route accessed', [
            'characterId' => $characterId,
            'kabanata_parameter' => $kabanata,
            'full_url' => request()->fullUrl()
        ]);
        
        $character = GuessCharacter::findOrFail($characterId);
        $user = Auth::user();
        
        // Decode kabanata param (may be hashed)
        $decoded = null;
        if ($kabanata) {
            $decoded = HashIdHelper::decrypt($kabanata);
        }
        
        $kabanataId = $decoded ? (int) $decoded : (is_numeric($kabanata) ? (int) $kabanata : 1);
        
        // Get the kabanata details
        $kabanata = Kabanata::findOrFail($kabanataId);

        Log::info('Decoded values', [
            'kabanataId' => $kabanataId,
            'kabanata_title' => $kabanata->title
        ]);

        $questions = GuessWord::where('kabanata_id', $kabanataId)
            ->inRandomOrder()
            ->limit(5)
            ->get();

        // Get kabanata progress for this user and kabanata
        $kabanataProgress = UserKabanataProgress::firstOrCreate([
            'user_id' => auth()->id(),
            'kabanata_id' => $kabanataId,
        ]);

        // Get saved progress for this player using kabanata_progress_id
        $progress = GuessWordProgress::where('kabanata_progress_id', $kabanataProgress->id)
            ->where('character_id', $characterId)
            ->first();

        return Inertia::render('Challenge/GuessWord/page', [
            'character' => $character,
            'questions' => $questions,
            'kabanataId' => (int) $kabanataId,
            'kabanataHash' => HashIdHelper::encrypt($kabanataId),
            'kabanata_number' => $kabanata->id,
            'kabanata_title' => $kabanata->title,
            'savedProgress' => $progress ? $progress->current_index : 0,
            'music' => $user->music ?? 40, 
            'sound' => $user->sound ?? 70,
        ]);
    }

    public function saveProgress(Request $request)
    {
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
        
        $sessionKey = "guessword_progress_{$user->id}_{$request->kabanata_id}";
        $progressData = session()->get($sessionKey, []);
        
        $questionKey = $validated['question_id'];
        
        if (!isset($progressData[$questionKey]) || $progressData[$questionKey]['current_index'] !== $validated['current_index']) {
            $progressData[$questionKey] = [
                'character_id' => $validated['character_id'],
                'question_id' => $validated['question_id'],
                'current_index' => $validated['current_index'],
                'completed' => $validated['completed'] ?? false,
                'total_score' => $validated['total_score'],
                'perfect_score' => $validated['perfect_score'] ?? false,
                'is_correct' => $validated['is_correct'],
                'processed_at' => now()->timestamp,
            ];
            
            session()->put($sessionKey, $progressData);
        }
        
        return back();
    }

    private function calculateStars($score)
    {
        if ($score >= 5) return 3;
        if ($score === 4) return 2;
        if ($score === 3) return 1;
        return 0;
    }

    public function Quiz($kabanata)
    {
        Log::info('Quiz route accessed', ['kabanata_parameter' => $kabanata]);
        
        // Decode kabanata param (may be hashed)
        $decoded = HashIdHelper::decrypt($kabanata);
        $kabanataId = $decoded ? (int) $decoded : (is_numeric($kabanata) ? (int) $kabanata : 1);

        $quizzes = Quiz::where('kabanata_id', $kabanataId)->get();

        $kabanata = Kabanata::findOrFail($kabanataId);

        $kabanataProgress = UserKabanataProgress::firstOrCreate([
            'user_id' => auth()->id(),
            'kabanata_id' => $kabanataId,
        ]);
        
        return Inertia::render('Challenge/Quiz/page', [
            'kabanataId' => (int) $kabanataId,
            'kabanataHash' => HashIdHelper::encrypt($kabanataId),
            'quizzes' => $quizzes,
            'kabanata_number' => $kabanata->number ?? $kabanata->id, 
            'kabanata_title' => $kabanata->title,
        ]);
    }

    public function shows($kabanata)
    {
        Log::info('shows route accessed', ['kabanata_parameter' => $kabanata]);
        
        // Decode kabanata param (may be hashed)
        $decoded = HashIdHelper::decrypt($kabanata);
        $kabanataId = $decoded ? (int) $decoded : (is_numeric($kabanata) ? (int) $kabanata : 1);

        $quizzes = Quiz::where('kabanata_id', $kabanataId)->get();
        $kabanata = Kabanata::findOrFail($kabanataId);
        
        $userProgress = null;
        if (Auth::check()) {
            $userProgress = $this->getQuizProgress(Auth::id(), $kabanataId);
        }

        return Inertia::render('Challenge/Quiz/Page', [
            'kabanataId' => (int) $kabanataId,
            'kabanataHash' => HashIdHelper::encrypt($kabanataId),
            'kabanataTitle' => $kabanata->title,
            'quizzes' => $quizzes,
            'userProgress' => $userProgress,
        ]);
    }

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
    
        $kabanataProgress = UserKabanataProgress::firstOrCreate([
            'user_id' => $user->id,
            'kabanata_id' => $request->kabanata_id,
        ]);

        $quiz = Quiz::findOrFail($request->quiz_id);
        $isCorrect = $quiz->correct_answer === $request->selected_answer;
        
        $existingProgress = QuizProgress::where([
            'kabanata_progress_id' => $kabanataProgress->id,
            'quiz_id' => $request->quiz_id,
        ])->first();

        $shouldSave = false;
        $reason = '';

        if (!$existingProgress) {
            $shouldSave = true;
            $reason = 'first_attempt';
        } elseif ($request->score > $existingProgress->score) {
            $shouldSave = true;
            $reason = 'higher_score';
        } else {
            $shouldSave = false;
            $reason = 'score_not_higher';
        }

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

        return back();
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
        
        $kabanataProgress = UserKabanataProgress::firstOrCreate([
            'user_id' => $user->id,
            'kabanata_id' => $request->kabanata_id,
        ]);

        $quizSessionKey = "quiz_progress_{$user->id}_{$request->kabanata_id}";
        $guesswordSessionKey = "guessword_progress_{$user->id}_{$request->kabanata_id}";
        $videoSessionKey = "video_progress_{$user->id}_{$request->kabanata_id}";

        $quizProgressData = session()->get($quizSessionKey, []);
        $guesswordProgressData = session()->get($guesswordSessionKey, []);
        $videoProgressData = session()->get($videoSessionKey, []);

        foreach ($quizProgressData as $quizId => $data) {
            if ($data['should_save_to_db'] ?? false) {
                $existingRecord = QuizProgress::where([
                    'kabanata_progress_id' => $kabanataProgress->id,
                ])->first();

                if ($existingRecord) {
                    if ($data['score'] > $existingRecord->score) {
                        $existingRecord->update([
                            'quiz_id' => $quizId,
                            'selected_answer' => $data['selected_answer'],
                            'is_correct' => $data['is_correct'],
                            'score' => $data['score'],
                            'question_number' => $data['question_number'],
                            'total_questions' => $data['total_questions'],
                            'completed' => $data['completed'] ?? false,
                        ]);
                    }
                } else {
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

        if (!empty($guesswordProgressData)) {
            $highestScoreData = null;
            $highestScore = 0;
            
            foreach ($guesswordProgressData as $questionData) {
                if (isset($questionData['total_score']) && $questionData['total_score'] > $highestScore) {
                    $highestScore = $questionData['total_score'];
                    $highestScoreData = $questionData;
                }
            }
            
            if ($highestScoreData) {
                $existingGuesswordProgress = GuesswordProgress::where([
                    'kabanata_progress_id' => $kabanataProgress->id,
                ])->orderBy('total_score', 'desc')->first();

                if (!$existingGuesswordProgress || $highestScoreData['total_score'] > $existingGuesswordProgress->total_score) {
                    
                    $updateData = [
                        'question_id' => $highestScoreData['question_id'] ?? null,
                        'current_index' => $highestScoreData['current_index'] ?? 0,
                        'completed' => $highestScoreData['completed'] ?? false,
                        'total_score' => $highestScoreData['total_score'] ?? 0,
                    ];
                    
                    if (isset($highestScoreData['character_id'])) {
                        $updateData['character_id'] = $highestScoreData['character_id'];
                    }
                    
                    if ($existingGuesswordProgress) {
                        $existingGuesswordProgress->update($updateData);
                    } else {
                        $updateData['kabanata_progress_id'] = $kabanataProgress->id;
                        GuesswordProgress::create($updateData);
                    }
                }
            }
        }

        if (!empty($videoProgressData)) {
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

        session()->forget($quizSessionKey);
        session()->forget($guesswordSessionKey);
        session()->forget($videoSessionKey);

        $finalQuizScore = QuizProgress::where('kabanata_progress_id', $kabanataProgress->id)
            ->sum('score');
        
        $finalGuesswordScore = GuesswordProgress::where('kabanata_progress_id', $kabanataProgress->id)
            ->max('total_score') ?? 0;
        
        $totalScore = min($finalQuizScore + $finalGuesswordScore, 10);
        
        $kabanataProgress->progress = $totalScore;
        
        $stars = $this->calculateStars($finalGuesswordScore);
        
        if ($stars > $kabanataProgress->stars) {
            $kabanataProgress->stars = $stars;
        }

        $kabanataProgress->unlocked = true;
        $kabanataProgress->save();

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

        if ($finalGuesswordScore === 5) {
            $this->checkAndNotifyImageUnlocks($user, $request->kabanata_id);
        }

        return redirect()->route('challenge');
    }

    private function checkAndNotifyImageUnlocks($user, $kabanataId)
    {
        $images = ImageGallery::where('kabanata_id', $kabanataId)->get();
        
        foreach ($images as $image) {
            $alreadyNotified = Notification::where('user_id', $user->id)
                ->where('type', 'image_unlock')
                ->where('message', 'like', '%Kabanata ' . $kabanataId . '%')
                ->exists();

            if (!$alreadyNotified) {
                $notification = Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Na-unlock mo ang bagong larawan sa RizHub!',
                    'message' => 'Binabati kita! Nakapag-unlock ka ng bagong imahe mula sa Kabanata ' . $kabanataId . '. Suriin mo ang iyong gallery upang makita ito!!',
                    'type' => 'image_unlock',
                    'is_read' => false,
                ]);

                try {
                    Mail::to($user->email)->queue(new ImageUnlockMail($notification, $image));
                } catch (\Exception $e) {
                    Log::error('Failed to send image unlock email: ' . $e->getMessage());
                }
            }
        }
    }

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

    public function getProgress($kabanataHash)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Decode the hashed kabanata id
        $kabanataId = HashIdHelper::decrypt($kabanataHash);
        if (!$kabanataId) {
            return response()->json(['error' => 'Invalid ID'], 404);
        }

        $user = Auth::user();
        return response()->json($this->getQuizProgress($user->id, $kabanataId));
    }

    public function resetProgress($kabanataHash)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Decode the hashed kabanata id
        $kabanataId = HashIdHelper::decrypt($kabanataHash);
        if (!$kabanataId) {
            return response()->json(['error' => 'Invalid ID'], 404);
        }

        $kabanataProgress = UserKabanataProgress::where('user_id', Auth::id())
            ->where('kabanata_id', $kabanataId)
            ->first();

        if ($kabanataProgress) {
            QuizProgress::where('kabanata_progress_id', $kabanataProgress->id)->delete();
            GuessWordProgress::where('kabanata_progress_id', $kabanataProgress->id)->delete();

            $kabanataProgress->update([
                'progress' => 0,
                'stars' => 0,
                'unlocked' => false,
            ]);
        }

        return response()->json(['success' => true], 200);
    }

    public function sample(){
        return Inertia::render('sample');
    }

    public function gallery()
    {
        $user = Auth::user();
        
        $images = ImageGallery::with('kabanata')
            ->orderBy('kabanata_id')
            ->get();

        $images->each(function ($image) use ($user) {
            $kabanataProgress = UserKabanataProgress::where('user_id', $user->id)
                ->where('kabanata_id', $image->kabanata_id)
                ->first();
                
            $guesswordUnlocked = false;
            if ($kabanataProgress) {
                // Check if ANY guessword progress has total_score >= 5
                $guesswordUnlocked = GuesswordProgress::where('kabanata_progress_id', $kabanataProgress->id)
                    ->where('total_score', '>=', 5) // Changed to >= 5
                    ->exists();
            }
            
            $image->unlocked = $guesswordUnlocked;
            $image->image_url = asset($image->image_url);
            $image->kabanata_hash = HashIdHelper::encrypt($image->kabanata_id);
        });

        // Debug: Count unlocked images
        $unlockedCount = $images->where('unlocked', true)->count();
        \Log::info("Gallery: {$unlockedCount}/{$images->count()} images unlocked");

        return Inertia::render('Dashboard/ImageGallery/page', [
            'images' => $images,
            'music' => $user->music ?? 40,
            'sound' => $user->sound ?? 70,
        ]);
    }

    public function notifications()
    {
        $user = Auth::user();
        $notifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Notifications/page', [
            'notifications' => $notifications
        ]);
    }

    public function markAsRead()
    {
        $user = Auth::user();
        $user->notifications()->update(['is_read' => true]);

        return back();
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

        return back();
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

        return back();
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

        return back();
    }

    public function markAllAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->update(['is_read' => true]);

        return back();
    }

    public function destroy($id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $notification->delete();

        return back();
    }

    public function destroyAll()
    {
        Notification::where('user_id', Auth::id())->delete();

        return back();
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'music' => 'required|integer|between:0,100',
            'sound' => 'required|integer|between:0,100',
        ]);

        auth()->user()->update([
            'music' => $validated['music'],
            'sound' => $validated['sound'],
        ]);

        return back();
    }

    public function getSettings()
    {
        $user = Auth::user();
        return response()->json([
            'music' => $user->music ?? 40,
            'sound' => $user->sound ?? 70,
        ]);
    }
}