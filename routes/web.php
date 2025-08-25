<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/sample', [StudentController::class, 'sample'])->name('sample');
Route::middleware(['auth', 'user.status', 'student', 'verified'])->group(function () {
    
    Route::get('/dashboard', [StudentController::class, 'dash'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // Route::get('/dashboard', [StudentController::class, 'dash'])->name('dashboard');
    Route::post('/student-exit', [StudentController::class, 'exit'])->name('student.exit');
    Route::post('/student/save-settings', [StudentController::class, 'saveSettings'])->name('student.saveSettings');
    Route::post('/student/send-invite', [StudentController::class, 'sendInvite'])->name('student.sendInvite');
    Route::get('/kabanatas', function () {
        $kabanatas = Kabanata::paginate(7);
        return response()->json($kabanatas);
    });
    Route::post('/student/save-audio-settings', [StudentController::class, 'updateAudioSettings'])->name('student.saveAudioSettings');
    Route::get('/challenge', [StudentController::class, 'challenge'])->name('challenge');
    // Route::get('/dashboard', [StudentController::class, 'dashh'])->name('student.dashhboard');
    Route::get('/videos/{id}', [StudentController::class, 'show']);
    Route::post('/save-video-progress', [StudentController::class, 'saveVideoProgress'])->name('student.saveVideoProgress');
    Route::get('/guess-characters/{kabanataId?}', [StudentController::class, 'guessCharacters'])->name('guess-characters');
    Route::get('/challenge/guessword/{characterId}/{kabanataId?}', [StudentController::class, 'guessW'])->name('challenge.guessW');
    Route::post('/guessword/save-progress', [StudentController::class, 'saveProgress'])->name('guessword.saveProgress');
    Route::get('/challenge/quiz/{kabanataId}', [StudentController::class, 'Quiz'])
    ->name('challenge.quiz');
    Route::get('/quiz/{kabanataId}', [StudentController::class, 'shows'])->name('quiz.show');
    Route::post('/api/quiz/save-progress', [StudentController::class, 'saveProgresss'])->name('quiz.saveProgress');
    Route::post('/api/quiz/complete', [StudentController::class, 'complete'])->name('quiz.complete');
    Route::get('/api/quiz/{kabanataId}/progress', [StudentController::class, 'getProgress'])->name('api.quiz.progress');
    Route::delete('/api/quiz/{kabanataId}/reset', [StudentController::class, 'resetProgress'])->name('api.quiz.reset');
    Route::get('/Dashboard/image-gallery', [StudentController::class, 'gallery'])->name('image.gallery');
});

// Route::get('/login', [LoginController::class, 'login'])->name('login');

require __DIR__.'/auth.php';
