# Code Changes Reference Guide

## Quick Code Reference for All Changes Made

### 1. Database Migration File
**File:** `database/migrations/2026_01_18_000001_add_tutorial_to_users_table.php`

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('tutorial_completed')->default(false)->after('sound');
            $table->timestamp('tutorial_started_at')->nullable()->after('tutorial_completed');
            $table->timestamp('tutorial_completed_at')->nullable()->after('tutorial_started_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['tutorial_completed', 'tutorial_started_at', 'tutorial_completed_at']);
        });
    }
};
```

---

### 2. StudentController Changes

#### Added Method: `completeTutorial()`
**File:** `app/Http/Controllers/StudentController.php`

```php
/**
 * Mark the onboarding tutorial as completed for the user
 */
public function completeTutorial()
{
    $user = Auth::user();
    
    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    try {
        $user->update([
            'tutorial_completed' => true,
            'tutorial_completed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tutorial marked as completed',
            'user' => $user
        ]);
    } catch (\Exception $e) {
        Log::error('Error completing tutorial: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to complete tutorial'], 500);
    }
}
```

#### Updated Method: `challenge()`
**File:** `app/Http/Controllers/StudentController.php` (Last 8 lines)

**BEFORE:**
```php
        return Inertia::render('Challenge/page', [
            'kabanatas' => $kabanatas,
            'videoProgress' => $videoProgress,
            'music' => $user->music ?? 40, 
            'sound' => $user->sound ?? 70,
            'studentName' => auth()->user()->name,
        ]);
    }
```

**AFTER:**
```php
        return Inertia::render('Challenge/page', [
            'kabanatas' => $kabanatas,
            'videoProgress' => $videoProgress,
            'music' => $user->music ?? 40, 
            'sound' => $user->sound ?? 70,
            'studentName' => auth()->user()->name,
            'tutorialCompleted' => $user->tutorial_completed ?? false,
            'userEmail' => $user->email,
        ]);
    }
```

---

### 3. Route Configuration
**File:** `routes/web.php`

**ADD THIS LINE (after student.sendInvite route):**
```php
Route::post('/tutorial/complete', [StudentController::class, 'completeTutorial'])->name('tutorial.complete');
```

**Context (showing where to add):**
```php
Route::middleware(['auth', 'user.status', 'student', 'verified', \App\Http\Middleware\HandleInertiaRequests::class])->group(function () {
    
    Route::get('/dashboard', [StudentController::class, 'dash'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/dashboard/profile-update', [ProfileController::class, 'dashboardUpdate'])->name('dashboard.profile.update'); 
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/student-exit', [StudentController::class, 'exit'])->name('student.exit');
    Route::post('/student/save-settings', [StudentController::class, 'saveSettings'])->name('student.saveSettings');
    Route::post('/student/send-invite', [StudentController::class, 'sendInvite'])->name('student.sendInvite');
    Route::post('/tutorial/complete', [StudentController::class, 'completeTutorial'])->name('tutorial.complete');  // ← ADD THIS
    
    // ... rest of routes
```

---

### 4. Challenge Page Component Changes
**File:** `resources/js/Pages/Challenge/page.tsx`

#### Change 1: Add Import
**ADD AT TOP (after other imports):**
```tsx
import InteractiveTutorial from "../../Tutorial/InteractiveTutorial";
```

**Full context:**
```tsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import { router, Link } from "@inertiajs/react";
import StudentLayout from "../../Layouts/StudentLayout";
import YouTubeVideoModal from "../Challenge/Video/YouTubeVideoModal";
import PreVideoModal from "./Video/Modal/page";
import CertificateModal from "../../Components/CertificateModal"; 
import Button from '@/Components/Button';
import AudioControls from "../../Components/AudioControls";
import youtubeMappings from "./youtubeMappings";
import InteractiveTutorial from "../../Tutorial/InteractiveTutorial"; // ← ADD THIS
```

#### Change 2: Update PageProps Interface
**FIND:**
```tsx
interface PageProps {
    kabanatas: KabanatasPaginated;
    music: number;
    sound: number;
    videoProgress: VideoProgress[];
    showVideo?: boolean;
    kabanataId?: number;
    completedKabanatasCount?: number;
    studentName?: string;
}
```

**REPLACE WITH:**
```tsx
interface PageProps {
    kabanatas: KabanatasPaginated;
    music: number;
    sound: number;
    videoProgress: VideoProgress[];
    showVideo?: boolean;
    kabanataId?: number;
    completedKabanatasCount?: number;
    studentName?: string;
    tutorialCompleted?: boolean;
    userEmail?: string;
}
```

#### Change 3: Update Component Function Signature
**FIND:**
```tsx
const KabanataPage: React.FC<PageProps> = ({ 
    kabanatas, 
    music, 
    sound, 
    videoProgress, 
    showVideo = false, 
    kabanataId = null,
    completedKabanatasCount = 0, 
    studentName = "Student"
}) => {
```

**REPLACE WITH:**
```tsx
const KabanataPage: React.FC<PageProps> = ({ 
    kabanatas, 
    music, 
    sound, 
    videoProgress, 
    showVideo = false, 
    kabanataId = null,
    completedKabanatasCount = 0, 
    studentName = "Student",
    tutorialCompleted = false,
    userEmail = ""
}) => {
```

#### Change 4: Add Tutorial State
**FIND:**
```tsx
    const [isLoading, setIsLoading] = useState(false);
    const [percentageDisplayType, setPercentageDisplayType] = useState<"rounded" | "decimal">("decimal");
    const [vibratingLockedId, setVibratingLockedId] = useState<number | null>(null);
```

**REPLACE WITH:**
```tsx
    const [isLoading, setIsLoading] = useState(false);
    const [percentageDisplayType, setPercentageDisplayType] = useState<"rounded" | "decimal">("decimal");
    const [vibratingLockedId, setVibratingLockedId] = useState<number | null>(null);
    const [showTutorial, setShowTutorial] = useState(!tutorialCompleted);
    const [tutorialStep, setTutorialStep] = useState(0);
```

#### Change 5: Add Tutorial Handlers
**ADD AFTER getDisplayTotalPages() function (around line 760):**
```tsx
    // Tutorial handlers
    const handleTutorialComplete = () => {
        setShowTutorial(false);
        // Mark tutorial as completed in database
        router.post(route('tutorial.complete'), {}, {
            preserveState: true,
            preserveScroll: true,
            onError: (errors) => {
                console.error('Failed to save tutorial completion:', errors);
            }
        });
    };

    const handleTutorialSkip = () => {
        setShowTutorial(false);
        // Still mark it as completed even if skipped
        router.post(route('tutorial.complete'), {}, {
            preserveState: true,
            preserveScroll: true,
            onError: (errors) => {
                console.error('Failed to save tutorial completion:', errors);
            }
        });
    };
```

#### Change 6: Add Tutorial Component to JSX
**FIND (in the return statement):**
```tsx
            <div className="relative min-h-[100vh] bg-cover bg-center overflow-hidden pointer-events-auto" style={{ backgroundImage: "url('/Img/Challenge/bg7.png')" }}>
                {/* Vibration Sound Effect */}
```

**REPLACE WITH:**
```tsx
            <div className="relative min-h-[100vh] bg-cover bg-center overflow-hidden pointer-events-auto" style={{ backgroundImage: "url('/Img/Challenge/bg7.png')" }}>
                {/* Interactive Tutorial */}
                <InteractiveTutorial 
                    isVisible={showTutorial}
                    onComplete={handleTutorialComplete}
                    onSkip={handleTutorialSkip}
                    startStep={tutorialStep}
                />

                {/* Vibration Sound Effect */}
```

#### Change 7: Update AudioControls Component
**FIND:**
```tsx
                    <AudioControls 
                        initialMusic={music}
                        initialSound={sound}
                        onSettingsChange={handleAudioSettingsChange}
                    />
```

**REPLACE WITH:**
```tsx
                    <AudioControls 
                        initialMusic={music}
                        initialSound={sound}
                        onSettingsChange={handleAudioSettingsChange}
                        data-tutorial="audio-controls"
                    />
```

#### Change 8: Add Dashboard Class
**FIND:**
```tsx
                <div className="absolute top-[35%] md-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] px-0 z-100">
```

**REPLACE WITH:**
```tsx
                <div className="absolute top-[35%] md-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] px-0 z-100 dashboard-container">
```

#### Change 9: Add Kabanata List Class and Attribute
**FIND (around line 1003):**
```tsx
                        {filteredKabanatas.data.slice(0, itemsPerPage).map((k, index) => (
                        <div 
                            key={`building-${k.id}`}
                            className="flex w-full relative pointer-events-auto"
                        >
```

**REPLACE WITH:**
```tsx
                        {filteredKabanatas.data.slice(0, itemsPerPage).map((k, index) => (
                        <div 
                            key={`building-${k.id}`}
                            className="flex w-full relative pointer-events-auto kabanata-list"
                            data-tutorial={index === 0 ? "kabanata-list" : undefined}
                        >
```

#### Change 10: Add Challenge Button Class and Attribute
**FIND (around line 1050):**
```tsx
                                <div className="relative">
                                    <div
                                    className={`rounded-full flex items-center justify-center z-50 cursor-pointer ${
                                        screenSize === "mobile" ? "w-[75px] h-auto" : 
                                        screenSize === "tablet" ? "w-20 h-20" :
                                        "w-20 h-20"
                                    }`}
                                    onClick={() => {
```

**REPLACE WITH:**
```tsx
                                <div className="relative">
                                    <div
                                    className={`rounded-full flex items-center justify-center z-50 cursor-pointer challenge-button ${
                                        screenSize === "mobile" ? "w-[75px] h-auto" : 
                                        screenSize === "tablet" ? "w-20 h-20" :
                                        "w-20 h-20"
                                    }`}
                                    data-tutorial="challenge-button"
                                    onClick={() => {
```

---

## 5. New Component Files (Copy These Completely)

### File 1: `resources/js/Tutorial/InteractiveTutorial.tsx`
See [InteractiveTutorial.tsx](resources/js/Tutorial/InteractiveTutorial.tsx)
*This is a large React component file - copy it completely as-is*

### File 2: `resources/js/Tutorial/tutorialSteps.ts`
See [tutorialSteps.ts](resources/js/Tutorial/tutorialSteps.ts)
*This is a TypeScript configuration file - copy it completely as-is*

---

## Summary of All Changes

| File | Type | Change |
|------|------|--------|
| `StudentController.php` | Modified | Added `completeTutorial()` method + updated `challenge()` |
| `web.php` | Modified | Added `/tutorial/complete` route |
| `page.tsx` | Modified | Added tutorial component + state + handlers + attributes |
| `InteractiveTutorial.tsx` | New | Main tutorial component |
| `tutorialSteps.ts` | New | Tutorial configuration |
| Migration file | New | Added tutorial columns to users table |

---

## Testing Commands

```bash
# Run migration
php artisan migrate

# Test new route exists
php artisan route:list | grep tutorial

# Check database changes
php artisan tinker
> Schema::getColumns('users')

# Build assets
npm run build

# Clear cache
php artisan cache:clear
```

---

## Rollback Instructions

If you need to undo these changes:

```bash
# Rollback migration
php artisan migrate:rollback

# Remove new files
rm -rf resources/js/Tutorial/

# Undo code changes in PHP/React files
# (git revert if using version control)
```

---

**All code changes are backward compatible and non-breaking!**
