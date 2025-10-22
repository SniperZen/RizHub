<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Models\User;
use App\Models\UserKabanataProgress;
use App\Models\Notification;
use App\Models\Kabanata;
use Illuminate\Support\Facades\DB;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Mail\WelcomeNotificationMail;
use Illuminate\Support\Facades\Log;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Use database transaction to ensure data consistency
        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // OPTIMIZED: Bulk insert kabanata progress
            $this->createKabanataProgress($user->id);

            // Create welcome notification
            $notification = Notification::create([
                'user_id' => $user->id,
                'title' => 'Welcome to RizHub!',
                'message' => 'Hello ' . $user->name . '! Welcome to RizHub. We\'re excited to have you on board. Start your journey with Noli Me Tangere Challenge!',
                'type' => 'welcome',
                'is_read' => false,
            ]);

            DB::commit();

            // Send email ASYNCHRONOUSLY using queue
            $this->sendWelcomeEmail($user, $notification);

            event(new Registered($user));

            Auth::login($user);

            return redirect(RouteServiceProvider::HOME);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Registration failed: ' . $e->getMessage());
            
            return back()->withErrors([
                'email' => 'Registration failed. Please try again.',
            ]);
        }
    }

    /**
     * Bulk create kabanata progress records
     */
    private function createKabanataProgress(int $userId): void
    {
        $kabanatas = Kabanata::orderBy('id')->get(['id']);
        
        $progressData = [];
        foreach ($kabanatas as $index => $kabanata) {
            $progressData[] = [
                'user_id' => $userId,
                'kabanata_id' => $kabanata->id,
                'progress' => 0,
                'stars' => 0,
                'unlocked' => $index === 0, // Only first kabanata unlocked
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Process in chunks to avoid memory issues
            if (count($progressData) >= 100) {
                UserKabanataProgress::insert($progressData);
                $progressData = [];
            }
        }

        // Insert remaining records
        if (!empty($progressData)) {
            UserKabanataProgress::insert($progressData);
        }
    }

    /**
     * Send welcome email using queue
     */
    private function sendWelcomeEmail(User $user, Notification $notification): void
    {
        try {
            // Queue the email instead of sending synchronously
            Mail::to($user->email)
                ->queue(new WelcomeNotificationMail($notification));
                
        } catch (\Exception $e) {
            Log::error('Failed to queue welcome email: ' . $e->getMessage());
            // Don't throw exception - email failure shouldn't block registration
        }
    }
}