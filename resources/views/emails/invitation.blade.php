<!DOCTYPE html>
<html>
<head>
    <title>Paanyaya para Sumali</title>
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
        <h2>Ikaw ay Inaanyayahan!</h2>
        <p>Inaanyayahan ka ng iyong kaibigan na sumali sa aming platform. I-click ang button sa ibaba upang tanggapin ang paanyaya:</p>
        
        <a href="{{ $shareLink }}" class="button">Tanggapin ang Paanyaya</a>
        
        <p>O kopyahin at i-paste ang link na ito sa iyong browser:</p>
        <div class="link">{{ $shareLink }}</div>
        
        <p>Kung hindi ikaw ang humiling ng paanyayang ito, maaari mo lamang balewalain ang email na ito.</p>
    </div>
</body>
</html>
