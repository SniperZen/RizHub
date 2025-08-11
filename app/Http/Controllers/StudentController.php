<?php

namespace App\Http\Controllers;

use FFMpeg\FFProbe;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\InvitationMail;
use App\Models\Kabanata;

class StudentController extends Controller
{
    public function dash() {
        $user = Auth::user();
        return Inertia::render('Dashboard/page', [
        'music' => $user->music ?? 40, 
        'sound' => $user->sound ?? 70,
        'name'  => $user->name ?? User101,
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

        // Get kabanatas paginated
        $kabanatas = \App\Models\Kabanata::paginate(7, ['*'], 'page', $page);

        // Get progress for these kabanatas for the user
        $progress = \DB::table('user_kabanata_progress')
            ->where('user_id', $user->id)
            ->whereIn('kabanata_id', $kabanatas->pluck('id'))
            ->get()
            ->keyBy('kabanata_id');

        // Merge progress into kabanata data
        $kabanatas->getCollection()->transform(function ($kabanata) use ($progress) {
            $p = $progress[$kabanata->id] ?? null;
            $kabanata->progress = $p->progress ?? 0;
            $kabanata->stars = $p->stars ?? 0;
            $kabanata->unlocked = $p->unlocked ?? false;
            return $kabanata;
        });

        return Inertia::render('Challenge/page', [
            'kabanatas' => $kabanatas,
            'music' => $user->music ?? 40, 
            'sound' => $user->sound ?? 70,
        ]);
    }

    public function guessCharacters()
    {
        $characters = \App\Models\GuessCharacter::all(); // Example fetch
        return Inertia::render('Challenge/GuessCharacter/page', [
            'characters' => $characters
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
            'video' => 'required|mimes:mp4,mkv,avi,mov|max:500000', // 500MB
        ]);

        // Save file
        $file = $request->file('video');
        $path = $file->store('videos', 'public');

        // Get duration in seconds
        $duration = FFProbe::create()
            ->format(storage_path("app/public/" . $path))
            ->get('duration');

        // Insert into DB
        Video::create([
            'title' => $file->getClientOriginalName(),
            'file_path' => $path,
            'duration' => intval($duration)
        ]);

        return response()->json(['message' => 'Video added successfully!']);
    }

    public function show($id)
    {
        $video = Video::findOrFail($id);
        return view('video-player', compact('video'));
    }

    public function GuessCharacterPicker()
    {
        $characters = GuessCharacter::all();

        return Inertia::render('GuessCharacterPicker', [
            'characters' => $characters
        ]);
    }
}
