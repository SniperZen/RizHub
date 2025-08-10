<!DOCTYPE html>
<html>
<head>
    <title>Invitation to Join</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { 
            display: inline-block; 
            padding: 10px 20px; 
            background-color: #9A4112; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
        }
        .link { 
            word-break: break-all; 
            margin-top: 20px; 
            padding: 10px; 
            background: #f4f4f4; 
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>You've been invited!</h2>
        <p>Your friend has invited you to join our platform. Click the button below to accept the invitation:</p>
        
        <a href="{{ $shareLink }}" class="button">Accept Invitation</a>
        
        <p>Or copy and paste this link into your browser:</p>
        <div class="link">{{ $shareLink }}</div>
        
        <p>If you didn't request this invitation, you can safely ignore this email.</p>
    </div>
</body>
</html>