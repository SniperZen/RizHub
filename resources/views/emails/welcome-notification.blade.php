<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Maligayang Pagdating sa RizHub</title>
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
            <h1>Maligayang Pagdating sa RizHub!</h1>
        </div>
        <div class="content">
            <h2>Kumusta, {{ $user->name }}!</h2>
            <p>{{ $notification->message }}</p>
            <p>Nalulugod kaming makasama ka sa aming komunidad at tuklasin ang mundo ng <em>Noli Me Tangere</em> sa pamamagitan ng aming mga interaktibong hamon.</p>
            
            <h3>Mga Magagawa Mo:</h3>
            <ul>
                <li>Maglaro ng Noli Me Tangere Challenge game</li>
                <li>Galugarin ang iba’t ibang kabanata</li>
                <li>Mag-unlock ng mga larawan ng karakter at mangolekta ng mga bituin</li>
                <li>Kumuha ng sertipiko sa iyong pagtatapos</li>
            </ul>

            <p>Simulan na sa pag-click ng button sa ibaba:</p>
            
            <a href="{{ route('dashboard') }}" class="button">Simulan ang Paglalaro</a>
            
            <p style="margin-top: 20px;">
                Kung mayroon kang mga katanungan, huwag mag-atubiling mag-reply sa email na ito.
            </p>
            
            <p>Masayang paglalaro!<br>The RizHub Team</p>
        </div>
    </div>
</body>
</html>
