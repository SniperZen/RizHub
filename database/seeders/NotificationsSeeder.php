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
            'title' => 'Maligayang Pagdating sa RizHub!',
            'message' => 'Dito nagsisimula ang iyong paglalakbay. Tuklasin ang mga hamon, kumita ng mga bituin, at buuin ang iyong koleksiyon. Nasasabik kaming makasama ka—tara, simulan na natin!',
            'type' => 'welcome',
            'is_read' => false,
        ]);

        }
    }
}