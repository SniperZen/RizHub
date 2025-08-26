<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Image Unlocked!</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #3D2410; 
            background-color: #f9f3e9;
            margin: 0;
            padding: 0;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #FF6A00, #D5703A); 
            padding: 30px; 
            text-align: center; 
            color: white; 
        }
        .logo {
            max-width: 120px;
            margin-bottom: 15px;
        }
        .content { 
            padding: 30px; 
        }
        .button { 
            display: inline-block; 
            padding: 15px 30px; 
            background: linear-gradient(135deg, #FF6A00, #D5703A);
            color: white; 
            text-decoration: none; 
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
            border: none;
            cursor: pointer;
        }
        .image-preview {
            text-align: center;
            margin: 20px 0;
        }
        .image-preview img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            border: 3px solid #FFB84C;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .footer {
            text-align: center;
            padding: 20px;
            background: #3D2410;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 New Image Unlocked!</h1>
            <p>Congratulations on your achievement!</p>
        </div>
        
        <div class="content">
            <h2>Hello {{ $user->name }}! 👋</h2>
            
            <p>{{ $notification->message }}</p>
            
            <div class="image-preview">
                <img src="{{ $image->image_url }}" alt="Unlocked Image from Kabanata {{ $image->kabanata->number }}" 
                     style="max-height: 300px; object-fit: contain;">
                <p class="text-sm text-gray-600 mt-2">
                    Kabanata {{ $image->kabanata->number }}: {{ $image->kabanata->title }}
                </p>
            </div>

            <p>This image has been added to your personal gallery collection. Keep completing challenges to unlock more images!</p>
            
            <div style="text-align: center;">
                <a href="{{ url('/image-gallery') }}" class="button">View Your Gallery</a>
            </div>
            
            <p>Continue your journey through Noli Me Tangere and discover more hidden treasures!</p>
            
            <p>Happy exploring!<br>
            <strong>The RizHub Team</strong></p>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} RizHub. All rights reserved.</p>
            <p>Experience Philippine literature in a whole new way</p>
        </div>
    </div>
</body>
</html>