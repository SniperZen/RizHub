import React, { useRef, useEffect, useState } from "react";

interface YouTubeVideoModalProps {
    youtubeId: string;
    onClose: () => void;
    onVideoEnd?: () => void;
    onSkip?: () => void;
    skippable?: boolean;
    showSkipOption?: boolean;
}

const YouTubeVideoModal: React.FC<YouTubeVideoModalProps> = ({
    youtubeId,
    onClose,
    onVideoEnd,
    skippable = false, // Default to false - user must watch first
    showSkipOption = false,
    onSkip,
}) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isPortrait, setIsPortrait] = useState<boolean>(false);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [player, setPlayer] = useState<any>(null);
    const [hasVideoEnded, setHasVideoEnded] = useState<boolean>(false);

    // Function to generate YouTube embed URL with specific parameters
    const getYouTubeEmbedUrl = (videoId: string) => {
        // Parameters explained:
        // ?autoplay=1 - Auto play when loaded
        // &controls=1 - Show player controls (play, pause, volume, settings, playback speed)
        // &disablekb=1 - Disable keyboard controls (prevents shortcuts for download)
        // &fs=1 - Allow fullscreen (can be toggled between 0 and 1 based on your needs)
        // &modestbranding=1 - Less YouTube branding
        // &rel=0 - Don't show related videos at the end
        // &showinfo=0 - Hide video title and uploader
        // &iv_load_policy=3 - Don't show annotations
        // &playsinline=1 - Play inline on mobile
        // &enablejsapi=1 - Enable JavaScript API for events
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&disablekb=1&fs=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1`;
    };

    useEffect(() => {
        // Load YouTube IFrame API if not already loaded
        if (!(window as any).YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        // Check initial orientation
        checkOrientation();
        
        // Add orientation change listener
        const handleOrientationChange = () => {
            checkOrientation();
        };

        window.addEventListener('resize', handleOrientationChange);
        screen.orientation?.addEventListener('change', handleOrientationChange);

        return () => {
            window.removeEventListener('resize', handleOrientationChange);
            screen.orientation?.removeEventListener('change', handleOrientationChange);
        };
    }, []);

    useEffect(() => {
        // Initialize YouTube player when API is ready
        const initializePlayer = () => {
            if ((window as any).YT && iframeRef.current) {
                const newPlayer = new (window as any).YT.Player(iframeRef.current, {
                    events: {
                        onReady: () => {
                            console.log("YouTube player ready");
                            setPlayer(newPlayer);
                        },
                        onStateChange: (event: any) => {
                            // Video ended
                            if (event.data === (window as any).YT.PlayerState.ENDED) {
                                setHasVideoEnded(true);
                                if (onVideoEnd) {
                                    onVideoEnd();
                                }
                            }
                        },
                        onError: (error: any) => {
                            console.error("YouTube player error:", error);
                        }
                    }
                });
            }
        };

        if ((window as any).YT) {
            initializePlayer();
        } else {
            (window as any).onYouTubeIframeAPIReady = initializePlayer;
        }

        return () => {
            if (player) {
                player.destroy();
            }
        };
    }, [youtubeId]);

    const checkOrientation = () => {
        // Check if device is mobile/tablet and in portrait mode
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        const isPortraitMode = window.innerHeight > window.innerWidth;
        
        setIsPortrait((isMobile || isTablet) && isPortraitMode);
    };

    const handleSkip = () => {
        if (onSkip) onSkip();
    };

    const handleCloseClick = () => {
        // Pause video when showing confirmation
        if (player && player.pauseVideo) {
            player.pauseVideo();
        }
        setShowConfirmation(true);
    };

    const handleCancelClose = () => {
        setShowConfirmation(false);
        // Resume video playback
        if (player && player.playVideo) {
            player.playVideo();
        }
    };

    const handleConfirmClose = () => {
        setShowConfirmation(false);
        onClose();
    };

    // Prevent right-click and keyboard shortcuts for download
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent common video download shortcuts
            if (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'v' || e.key === 'V')) {
                e.preventDefault();
            }
            // Prevent F12 (DevTools) and Ctrl+Shift+I
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <>
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                {/* Grayscale filter container */}
                <div className={`relative grayscale ${isPortrait ? 'w-full max-w-full' : 'w-full h-full'}`}>
                    {/* YouTube Iframe */}
                    <div className={`
                        ${isPortrait 
                            ? 'max-h-[85vh] w-auto mx-auto' 
                            : 'w-full h-full'
                        }
                        transition-all duration-300
                    `}>
                        <div className="relative" style={{ 
                            paddingTop: isPortrait ? '56.25%' : '100%',
                            width: isPortrait ? 'auto' : '100%',
                            height: isPortrait ? 'auto' : '100%'
                        }}>
                            <iframe
                                ref={iframeRef}
                                src={getYouTubeEmbedUrl(youtubeId)}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className={`
                                    absolute top-0 left-0 w-full h-full
                                    ${isPortrait ? 'object-contain' : 'object-cover'}
                                `}
                                style={{
                                    filter: "grayscale(100%) contrast(1.1) brightness(0.9)"
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Copyright watermark overlay */}
                <div className="absolute top-4 left-4 text-white/70 text-sm bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm z-20 pointer-events-none">
                    © Educational Use Only
                </div>

                {/* Close button */}
                <button
                    onClick={handleCloseClick}
                    className="absolute top-4 right-4 text-white text-2xl bg-black/70 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/90 z-30 transition-all duration-200 backdrop-blur-sm"
                >
                    ✕
                </button>

                {/* Skip button - Only show if skippable is true AND user has watched the video before */}
                {(showSkipOption || (skippable && hasVideoEnded)) && (
                    <button
                        onClick={handleSkip}
                        className="absolute bottom-6 right-6 text-white rounded-lg px-5 py-3 text-base font-semibold hover:bg-black/90 transition-all duration-200 z-30"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        Skip Video
                    </button>
                )}

                {/* Additional copyright protection overlay */}
                <div 
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                        background: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.02) 5px, rgba(255,255,255,0.02) 10px)'
                    }}
                />
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
                    {/* Backdrop with fade-in animation */}
                    <div 
                        className="absolute inset-0 bg-black/70"
                        style={{
                            animation: 'fadeIn 0.3s ease-out forwards'
                        }}
                    ></div>
                    
                    {/* Modal background image - appears first */}
                    <div 
                        className="relative w-full max-w-2xl opacity-0"
                        style={{
                            animation: 'scaleIn 0.4s ease-out forwards, fadeIn 0.4s ease-out forwards',
                            transformOrigin: 'center'
                        }}
                    >
                        <img
                            src="/Img/Challenge/vidModal.png"
                            alt="Wooden Modal"
                            className="w-full h-auto"
                        />
                    </div>
                    
                    {/* Text content container - appears after background image is fully visible */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="relative w-full max-w-2xl flex flex-col justify-center items-center text-center px-8 opacity-0"
                            style={{
                                animation: 'fadeIn 0.5s ease-out 0.4s both'
                            }}>
                            
                            {/* Text appears after background image */}
                            <p 
                                className="font-black-han-sans font-black text-2xl sm:text-2xl md:text-2xl lg:text-3xl leading-[30px] text-center text-[#95512C] relative top-[40px] lg:top-[40px] opacity-0"
                                style={{
                                animation: 'fadeIn 0.5s ease-out 0.6s both'
                                }}
                            >
                                Sigurado ka bang gusto mong isara ang video? Magsisimula itong muli kapag pinanood mo uli.
                            </p>

                            {/* Buttons appear after text */}
                            <div className="flex gap-6 mt-24 relative top-[40px] sm:top-[70px] md:top-[80px] lg:top-[60px] opacity-0"
                                style={{
                                animation: 'fadeIn 0.5s ease-out 0.8s both'
                                }}>
                                <button
                                    className="w-auto h-[50px] lg:h-[60px] px-6 rounded-[40px] bg-gradient-to-b from-gray-300 to-gray-500 shadow-[4px_8px_0_#888] border-4 border-gray-400 text-black text-xl lg:text-3xl font-extrabold relative transition hover:scale-105"
                                    onClick={handleCancelClose}
                                >
                                    Kanselahin
                                </button>
                                <button
                                    className="w-auto h-[50px] lg:h-[60px] px-6 rounded-[40px] bg-gradient-to-b from-[#FFA500] to-[#D76D00] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-xl lg:text-3xl font-extrabold relative transition hover:scale-105"
                                    onClick={handleConfirmClose}
                                >
                                    Magpatuloy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default YouTubeVideoModal;