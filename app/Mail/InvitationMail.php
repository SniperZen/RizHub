<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $shareLink;

    public function __construct($shareLink)
    {
        $this->shareLink = $shareLink;
    }

    public function build()
    {
        return $this->subject('Invitation to Join')
                    ->view('emails.invitation');
    }
}