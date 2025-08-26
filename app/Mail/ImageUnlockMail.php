<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Notification;
use App\Models\ImageGallery;

class ImageUnlockMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $notification;
    public $image;
    public $user;

    public function __construct(Notification $notification, ImageGallery $image)
    {
        $this->notification = $notification;
        $this->image = $image;
        $this->user = $notification->user;
    }

    public function build()
    {
        return $this->subject('🎉 New Image Unlocked in RizHub!')
                    ->view('emails.image-unlock')
                    ->with([
                        'user' => $this->user,
                        'notification' => $this->notification,
                        'image' => $this->image,
                    ]);
    }
}