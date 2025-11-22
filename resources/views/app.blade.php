<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- ✅ App Favicon and Preview Image -->
    <link rel="icon" type="image/png" href="{{ asset('Img/LandingPage/jose.jpg') }}" />
    <link rel="apple-touch-icon" href="{{ asset('Img/LandingPage/jose.jpg') }}" />
    <meta name="theme-color" content="#faf8f7ff" />

    <!-- ✅ Open Graph / Meta Preview -->
    <meta property="og:title" content="{{ config('app.name', 'RizHub') }}" />
    <meta property="og:description" content="A Web-Based Game-Integrated Learning Tool for Noli Me Tangere." />
    <meta property="og:image" content="{{ asset('Img/logo.png') }}" />
    <meta property="og:url" content="{{ config('app.url') }}" />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Lavishly+Yours&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Erica+One&display=swap" rel="stylesheet">

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
  </head>

  <body class="font-sans antialiased">
    @inertia
  </body>
</html>
