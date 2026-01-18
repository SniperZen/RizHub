<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\KabanataController; // Add if you have one
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/sample', [StudentController::class, 'sample'])->name('sample');

// Add HandleInertiaRequests middleware here
Route::middleware(['auth', 'user.status', 'student', 'verified', \App\Http\Middleware\HandleInertiaRequests::class])->group(function () {
    
    Route::get('/dashboard', [StudentController::class, 'dash'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/dashboard/profile-update', [ProfileController::class, 'dashboardUpdate'])->name('dashboard.profile.update'); 
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/student-exit', [StudentController::class, 'exit'])->name('student.exit');
    Route::post('/student/save-settings', [StudentController::class, 'saveSettings'])->name('student.saveSettings');
    Route::post('/student/send-invite', [StudentController::class, 'sendInvite'])->name('student.sendInvite');
    Route::post('/tutorial/complete', [StudentController::class, 'completeTutorial'])->name('tutorial.complete');
    
    // FIXED: Return Inertia response instead of JSON
    Route::get('/kabanatas', function () {
        $kabanatas = Kabanata::paginate(7);
        return inertia('Kabanatas/Index', ['kabanatas' => $kabanatas]); // ✅ Use inertia()
        // OR if you need an API endpoint, move it to api.php
    });
    
    Route::post('/student/save-audio-settings', [StudentController::class, 'updateAudioSettings'])->name('student.saveAudioSettings');
    Route::get('/challenge', [StudentController::class, 'challenge'])->name('challenge');
    Route::get('/videos/{id}', [StudentController::class, 'show']);
    Route::post('/save-video-progress', [StudentController::class, 'saveVideoProgress'])->name('student.saveVideoProgress');
    
    // Updated routes with pattern constraints for hashed parameters
    Route::get('/guess-characters/{kabanata?}', [StudentController::class, 'guessCharacters'])
        ->where('kabanata', '.*')
        ->name('guess-characters');
    
    Route::get('/challenge/guessword/{characterId}/{kabanata?}', [StudentController::class, 'guessW'])
        ->where('kabanata', '.*')
        ->name('challenge.guessW');
    
    Route::post('/guessword/save-progress', [StudentController::class, 'saveProgress'])->name('guessword.saveProgress');
    
    Route::get('/challenge/quiz/{kabanata}', [StudentController::class, 'Quiz'])
        ->where('kabanata', '.*')
        ->name('challenge.quiz');
    
    Route::get('/quiz/{kabanata}', [StudentController::class, 'shows'])
        ->where('kabanata', '.*')
        ->name('quiz.show');
    
    Route::post('/api/quiz/save-progress', [StudentController::class, 'saveProgresss'])->name('quiz.saveProgress');
    Route::post('/api/quiz/complete', [StudentController::class, 'complete'])->name('quiz.complete');
    Route::get('/api/quiz/{kabanata}/progress', [StudentController::class, 'getProgress'])
        ->where('kabanata', '.*')
        ->name('api.quiz.progress');
    
    Route::delete('/api/quiz/{kabanata}/reset', [StudentController::class, 'resetProgress'])
        ->where('kabanata', '.*')
        ->name('api.quiz.reset');
    
    Route::get('/Dashboard/image-gallery', [StudentController::class, 'gallery'])->name('image.gallery');
    Route::get('/notifications', [StudentController::class, 'notifications'])->name('notifications');
    Route::post('/notifications/mark-as-read', [StudentController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::post('/send-notification', [StudentController::class, 'sendNotification'])->name('send.notification');
    Route::post('/notifications/mark-as-read', [StudentController::class, 'markAsReads'])->name('notifications.markAsRead');
    Route::post('/notifications/mark-as-unread', [StudentController::class, 'markAsUnread'])->name('notifications.markAsUnread');
    Route::post('/notifications/mark-all-read', [StudentController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
    Route::delete('/notifications/{notification}', [StudentController::class, 'destroy'])->name('notifications.destroy');
    Route::delete('/notifications', [StudentController::class, 'destroyAll'])->name('notifications.destroyAll');
    Route::post('/user/update-settings', [StudentController::class, 'updateSettings'])->name('student.updateSettings');
    Route::post('/api/user/save-settings', [StudentController::class, 'saveSettings']);
    Route::get('/api/user/settings', [StudentController::class, 'getSettings']);
});

// Public routes that don't need auth but still need Inertia
Route::middleware([\App\Http\Middleware\HandleInertiaRequests::class])->group(function () {
    Route::get('/book/{kabanata?}', [StudentController::class, 'book'])
        ->where('kabanata', '.*')
        ->name('book.read');
    
    Route::get('/help', [StudentController::class, 'help'])->name('help');
});

require __DIR__.'/auth.php';