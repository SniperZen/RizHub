<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Models\User;
use App\Models\UserKabanataProgress;
use App\Models\Notification;
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

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $kabanatas = \App\Models\Kabanata::orderBy('id')->get();
        foreach ($kabanatas as $idx => $kabanata) {
            $kabanataProgress = UserKabanataProgress::create([
                'user_id' => $user->id,
                'kabanata_id' => $kabanata->id,
                'progress' => 0,
                'stars' => 0,
                'unlocked' => $idx === 0,
            ]);
        }

        // Create welcome notification
        $notification = Notification::create([
            'user_id' => $user->id,
            'title' => 'Welcome to RizHub!',
            'message' => 'Hello ' . $user->name . '! Welcome to RizHub. We\'re excited to have you on board. Start your journey with Noli Me Tangere Challenge!',
            'type' => 'welcome',
            'is_read' => false,
        ]);

        // Send welcome email
        try {
            Mail::to($user->email)->send(new WelcomeNotificationMail($notification));
        } catch (\Exception $e) {
            \Log::error('Failed to send welcome email: ' . $e->getMessage());
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }
}