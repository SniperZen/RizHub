<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class VerifyEmailController extends Controller
{
    /**
     * Handle an email verification link. Works for guests (different browser).
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $id = $request->route('id');
        $user = User::findOrFail($id);

        // Verify the hash matches the user's email
        if (! hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            abort(403);
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('login', ['verified' => 1]);
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        // Do not auto-login the user here; redirect to login so they can sign in.
        return redirect()->route('login', ['verified' => 1]);
    }


}
