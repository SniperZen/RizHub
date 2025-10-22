<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        // Simple render without complex dependencies
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            Log::info('Login attempt started', ['email' => $request->email, 'ip' => $request->ip()]);

            // Use simple authentication without events
            $credentials = $request->only('email', 'password');
            
            if (Auth::attempt($credentials, $request->boolean('remember'))) {
                $request->session()->regenerate();
                
                $user = Auth::user();
                Log::info('Login successful', [
                    'user_id' => $user->id,
                    'email' => $user->email
                ]);

                return redirect()->intended(RouteServiceProvider::HOME);
            }

            Log::warning('Login failed - invalid credentials', ['email' => $request->email]);
            
            return back()->withErrors([
                'email' => __('auth.failed'),
            ])->withInput($request->only('email', 'remember'));

        } catch (\Exception $e) {
            Log::error('Login error', [
                'email' => $request->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'email' => 'Login failed. Please try again.',
            ]);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();
        
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Log::info('User logged out', ['user_id' => $user?->id]);

        return redirect('/');
    }
}