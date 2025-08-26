<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Notification;

class NotificationsSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();
        
        foreach ($users as $user) {
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Welcome to RizHub!',
                'message' => 'Your journey starts here. Explore challenges, earn stars, and build your collection. We\'re excited to have you on board—let\'s get started!',
                'type' => 'welcome',
                'is_read' => false,
            ]);
        }
    }
}