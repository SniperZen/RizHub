<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to RizHub</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6A00, #D5703A); padding: 20px; text-align: center; color: white; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
        .button { display: inline-block; padding: 12px 24px; background: #FF6A00; color: white; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to RizHub!</h1>
        </div>
        <div class="content">
            <h2>Hello {{ $user->name }}!</h2>
            <p>{{ $notification->message }}</p>
            <p>We're excited to have you join our community and explore the world of Noli Me Tangere through our interactive challenges.</p>
            
            <h3>What you can do:</h3>
            <ul>
                <li>Play the Noli Me Tangere Challenge game</li>
                <li>Explore different kabanatas (chapters)</li>
                <li>Solve quizzes and guessword puzzles</li>
                <li>Unlock character images and collect stars</li>
                <li>Customize your audio settings</li>
            </ul>

            <p>Get started by clicking the button below:</p>
            
            <a href="{{ route('dashboard') }}" class="button">Start Playing</a>
            
            <p style="margin-top: 20px;">
                If you have any questions, feel free to reply to this email.
            </p>
            
            <p>Happy gaming!<br>The RizHub Team</p>
        </div>
    </div>
</body>
</html>