<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Na-unlock mo ang bagong larawan sa RizHub!</title>
    <style>
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #3D2410; 
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container { 
            max-width: 640px; 
            margin: 0 auto; 
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }
        .header { 
            background: linear-gradient(135deg, #FF7E47, #D95D2D); 
            padding: 40px 20px; 
            text-align: center; 
            color: white; 
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content { 
            padding: 35px; 
        }
        .content h2 {
            font-size: 22px;
            margin-top: 0;
            color: #2C1810;
        }
        .content p {
            margin: 15px 0;
            font-size: 15px;
            color: #4B3A2A;
        }
        .button { 
            display: inline-block; 
            padding: 14px 28px; 
            background: linear-gradient(135deg, #FF7E47, #D95D2D);
            color: white; 
            text-decoration: none; 
            border-radius: 30px;
            font-size: 16px;
            font-weight: bold;
            margin: 25px 0;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            transition: background 0.3s ease;
        }
        .button:hover {
            background: linear-gradient(135deg, #FF8F5A, #E96D3D);
        }
        .image-preview {
            text-align: center;
            margin: 25px 0;
        }
        .image-preview img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            border: 3px solid #FFD180;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .image-caption {
            font-size: 14px;
            color: #6B5B4A;
            margin-top: 10px;
            font-style: italic;
        }
        .footer {
            text-align: center;
            padding: 25px;
            background: #2C1810;
            color: #e0d6cc;
            font-size: 13px;
        }
        .footer p {
            margin: 6px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        
        <!-- Header -->
        <div class="header">
            <h1>Na-unlock mo ang bagong larawan sa RizHub!</h1>
            <p>Binabati kita sa  iyong tagumpay</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <h2>Hello {{ $user->name }}</h2>
            
            <p>{{ $notification->message }}</p>
            
            <div class="image-preview">
                <img src="{{ $image->image_url }}" alt="Unlocked Image from Kabanata {{ $image->kabanata->number }}">
                <p class="image-caption">
                    Kabanata {{ $image->kabanata->number }} — {{ $image->kabanata->title }}
                </p>
            </div>

            <p>Ang larawang ito ay naidagdag na sa iyong personal na koleksiyon. Patuloy lang sa pag-complete ng mga hamon para makapag-unlock pa ng iba!</p>
            
            <div style="text-align: center;">
                <a href="{{ url('image.gallery') }}" class="button">View Your Gallery</a>
            </div>
            
            <p>Continue your journey through <em>Noli Me Tangere</em> and discover more hidden treasures!</p>
            
            <p>Happy exploring!<br>
            <strong>The RizHub Team</strong></p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>&copy; {{ date('Y') }} RizHub. All rights reserved.</p>
            <p>Experience Philippine literature in a whole new way</p>
        </div>
    </div>
</body>
</html>
