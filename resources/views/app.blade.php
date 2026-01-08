<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- ✅ App Favicon and Preview Image -->
    <link rel="icon" type="image/png" href="{{ asset('Img/LandingPage/logoapp1.jpg') }}" />
    <link rel="apple-touch-icon" href="{{ asset('Img/LandingPage/logoapp1.jpg') }}" />
    <meta name="theme-color" content="#faf8f7ff" />

    <!-- ✅ PWA Manifest & Meta Tags -->
    <link rel="manifest" href="{{ asset('manifest.json') }}">
    <meta name="theme-color" content="#faf8f7ff"/>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="{{ config('app.name', 'RizHub') }}">
    <link rel="apple-touch-icon" href="{{ asset('Img/LandingPage/logoapp1.jpg') }}">
    <meta name="msapplication-TileImage" content="{{ asset('Img/LandingPage/logoapp1.jpg') }}">
    <meta name="msapplication-TileColor" content="#faf8f7ff">

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

    <!-- ✅ Install Button (will be shown/hidden by JavaScript) -->
    <div id="installContainer" style="display: none; position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
      <button id="installButton" style="background: #faf8f7; color: #000; border: 2px solid #000; padding: 10px 15px; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        📱 Install RizHub
      </button>
      <button id="closeInstall" style="background: #ff4444; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; margin-left: 5px; cursor: pointer;">×</button>
    </div>

    <!-- ✅ PWA Installation Script -->
    <script>
      // Register service worker
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('{{ asset("sw.js") }}')
            .then(function(registration) {
              console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function(err) {
              console.log('ServiceWorker registration failed: ', err);
            });
        });
      }

      // Handle install prompt
      let deferredPrompt;
      const installContainer = document.getElementById('installContainer');
      const installButton = document.getElementById('installButton');
      const closeInstall = document.getElementById('closeInstall');

      window.addEventListener('beforeinstallprompt', function(e) {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        
        // Show install prompt container
        if (installContainer) {
          installContainer.style.display = 'flex';
          installContainer.style.alignItems = 'center';
        }

        // Update install button if it exists
        if (installButton) {
          installButton.addEventListener('click', function(e) {
            // Hide our install promotion
            if (installContainer) {
              installContainer.style.display = 'none';
            }
            
            // Show the install prompt
            if (deferredPrompt) {
              deferredPrompt.prompt();
              
              // Wait for the user to respond to the prompt
              deferredPrompt.userChoice.then(function(choiceResult) {
                if (choiceResult.outcome === 'accepted') {
                  console.log('User accepted the install prompt');
                  // You can send analytics here
                  if (window.ga) {
                    window.ga('send', 'event', 'PWA', 'install', 'accepted');
                  }
                } else {
                  console.log('User dismissed the install prompt');
                  // Optional: Show install button again after 1 week
                  setTimeout(function() {
                    if (installContainer && deferredPrompt) {
                      installContainer.style.display = 'flex';
                    }
                  }, 1000 * 60 * 60 * 24 * 7); // 1 week
                }
                deferredPrompt = null;
              });
            }
          });
        }

        // Close button handler
        if (closeInstall) {
          closeInstall.addEventListener('click', function() {
            if (installContainer) {
              installContainer.style.display = 'none';
            }
            // Show again after 1 week
            setTimeout(function() {
              if (installContainer && deferredPrompt) {
                installContainer.style.display = 'flex';
              }
            }, 1000 * 60 * 60 * 24 * 7); // 1 week
          });
        }
      });

      // Track successful installation
      window.addEventListener('appinstalled', function(evt) {
        console.log('RizHub was successfully installed');
        if (installContainer) {
          installContainer.style.display = 'none';
        }
        
        // Send analytics if available
        if (window.ga) {
          window.ga('send', 'event', 'PWA', 'install', 'success');
        }
      });

      // Check if app is already installed
      window.addEventListener('load', function() {
        if (window.matchMedia('(display-mode: standalone)').matches) {
          console.log('Running in standalone mode');
          // Hide install button if already installed
          if (installContainer) {
            installContainer.style.display = 'none';
          }
        }
      });
    </script>

    <style>
      #installButton:hover {
        background: #e8e6e4 !important;
        transform: translateY(-2px);
        transition: all 0.3s ease;
      }
      
      #closeInstall:hover {
        background: #cc0000 !important;
        transform: scale(1.1);
        transition: all 0.3s ease;
      }
    </style>
  </body>
</html>