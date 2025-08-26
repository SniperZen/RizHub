<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Notification;

class WelcomeNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $notification;

    public function __construct(Notification $notification)
    {
        $this->notification = $notification;
    }

    public function build()
    {
        return $this->subject('Welcome to RizHub!')
                    ->view('emails.welcome-notification')
                    ->with([
                        'user' => $this->notification->user,
                        'notification' => $this->notification,
                    ]);
    }
}