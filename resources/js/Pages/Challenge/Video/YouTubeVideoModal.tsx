// resources/js/Pages/Challenge/Video/YouTubeVideoModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";

interface YouTubeVideoModalProps {
    youtubeId: string;
    onClose: () => void;
    onVideoEnd?: () => void;
    onSkip?: () => void;
    skippable?: boolean;
    showSkipOption?: boolean;
    kabanataId?: number | null;
    isCompleted?: boolean; // track if video already completed from database
}

declare global {
    interface Window { YT: any; onYouTubeIframeAPIReady?: () => void; }
}

export default function YouTubeVideoModal({
    youtubeId,
    onClose,
    onVideoEnd,
    onSkip,
    skippable = false,
    showSkipOption = false,
    kabanataId = null,
    isCompleted = false,
}: YouTubeVideoModalProps) {
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [playerReady, setPlayerReady] = useState(false);
    const watchIntervalRef = useRef<number | null>(null);
    const secondsWatchedRef = useRef<number>(0);
    const [hasAlreadySaved, setHasAlreadySaved] = useState(false);
    const [hasVideoEnded, setHasVideoEnded] = useState(false);
    const [showSkipButton, setShowSkipButton] = useState(isCompleted);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [isRestrictedMode, setIsRestrictedMode] = useState(!isCompleted); // NEW: track if we should restrict seeking
    const [isPlaying, setIsPlaying] = useState(true); // Track if video is playing
    const lastCheckedTimeRef = useRef<number>(0); // Track last checked time
    const lastValidTimeRef = useRef<number>(0); // Track last valid time

    // Load YT API if needed and create player
    useEffect(() => {
        let mounted = true;

        const createPlayer = () => {
            if (!mounted) return;
            if (!window.YT) return;
            const YT = window.YT;
            if (!containerRef.current) return;

            // First-time watchers get different parameters
            const playerVars = isRestrictedMode 
                ? {
                    // For first-time viewers: hide controls but show play button
                    autoplay: 1,
                    controls: 1, // Keep controls visible
                    rel: 0,
                    modestbranding: 1,
                    enablejsapi: 1,
                    disablekb: 1,
                    fs: 1,
                    showinfo: 0,
                    iv_load_policy: 3,
                    playsinline: 1,
                    // Add these for better control
                    color: 'white',
                    hl: 'en',
                    cc_load_policy: 0,
                    widget_referrer: window.location.href,
                  }
                : {
                    // For rewatchers: full controls
                    autoplay: 1,
                    controls: 1,
                    rel: 0,
                    modestbranding: 1,
                    enablejsapi: 1,
                    disablekb: 0,
                    fs: 1,
                    showinfo: 0,
                    iv_load_policy: 3,
                    playsinline: 1,
                  };

            playerRef.current = new YT.Player(containerRef.current, {
                height: "390",
                width: "640",
                videoId: youtubeId,
                playerVars: playerVars,
                events: {
                    onReady: () => {
                        setPlayerReady(true);
                        if (watchIntervalRef.current) window.clearInterval(watchIntervalRef.current);
                        
                        // Start tracking watched time more frequently
                        watchIntervalRef.current = window.setInterval(() => {
                            try {
                                const currentTime = playerRef.current.getCurrentTime();
                                const state = playerRef.current.getPlayerState();
                                
                                if (state === YT.PlayerState.PLAYING) {
                                    secondsWatchedRef.current = Math.floor(currentTime);
                                    lastValidTimeRef.current = currentTime;
                                }
                            } catch (e) {
                                // ignore
                            }
                        }, 200); // Check every 200ms
                        
                        // For restricted mode, add a protective overlay
                        if (isRestrictedMode) {
                            addProtectiveOverlay();
                        }
                    },
                    onStateChange: (event: any) => {
                        const YT = window.YT;
                        
                        // Update playing state
                        if (event.data === YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                        } else if (event.data === YT.PlayerState.PAUSED) {
                            setIsPlaying(false);
                        }
                        
                        // Video ended
                        if (event.data === YT.PlayerState.ENDED) {
                            setHasVideoEnded(true);
                            setShowSkipButton(true);
                            setIsRestrictedMode(false); // Remove restrictions after video ends
                            
                            // Remove protective overlay if exists
                            removeProtectiveOverlay();
                            
                            if (onVideoEnd) onVideoEnd();
                            
                            if (!hasAlreadySaved) {
                                saveProgress(true);
                            }
                        }
                        
                        // Video paused
                        if (event.data === YT.PlayerState.PAUSED) {
                            if (!hasAlreadySaved && !hasVideoEnded) {
                                saveProgress(false);
                            }
                        }
                        
                        // For restricted mode, prevent seeking
                        if (isRestrictedMode) {
                            if (event.data === YT.PlayerState.PLAYING || 
                                event.data === YT.PlayerState.BUFFERING) {
                                
                                // Check if user tried to seek
                                const currentTime = playerRef.current.getCurrentTime();
                                const expectedTime = lastValidTimeRef.current + 0.5; // Allow small buffer
                                
                                if (Math.abs(currentTime - expectedTime) > 1.5) {
                                    // User tried to seek - reset to valid time
                                    playerRef.current.seekTo(lastValidTimeRef.current, true);
                                }
                            }
                        }
                    },
                    onError: (error: any) => {
                        console.error("YouTube player error:", error);
                    }
                },
            });
        };

        // Function to add protective overlay over progress bar
        const addProtectiveOverlay = () => {
            setTimeout(() => {
                const iframe = containerRef.current;
                if (iframe && iframe.parentNode) {
                    const overlay = document.createElement('div');
                    overlay.id = 'progress-bar-protector';
                    overlay.style.position = 'absolute';
                    overlay.style.bottom = '40px'; // Position over progress bar
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '30px'; // Cover progress bar area
                    overlay.style.zIndex = '9999';
                    overlay.style.cursor = 'not-allowed';
                    overlay.style.backgroundColor = 'transparent';
                    
                    // Add tooltip
                    overlay.title = 'You must watch the video completely before you can seek';
                    
                    // Add to iframe wrapper
                    const wrapper = iframe.parentNode as HTMLElement;
                    if (wrapper.style.position !== 'relative') {
                        wrapper.style.position = 'relative';
                    }
                    wrapper.appendChild(overlay);
                }
            }, 1000); // Wait for player to load
        };

        // Function to remove protective overlay
        const removeProtectiveOverlay = () => {
            const overlay = document.getElementById('progress-bar-protector');
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        };

        if (!window.YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
            window.onYouTubeIframeAPIReady = () => {
                createPlayer();
            };
        } else {
            createPlayer();
        }

        return () => {
            mounted = false;
            if (watchIntervalRef.current) {
                window.clearInterval(watchIntervalRef.current);
                watchIntervalRef.current = null;
            }
            if (playerRef.current && playerRef.current.destroy) {
                try { playerRef.current.destroy(); } catch (e) {}
            }
            removeProtectiveOverlay();
        };
    }, [youtubeId, isRestrictedMode]);

    // Effect to handle seeking prevention more aggressively
    useEffect(() => {
        if (!playerReady || !isRestrictedMode) return;

        const handleTimeUpdate = () => {
            if (!playerRef.current || !isRestrictedMode) return;
            
            try {
                const currentTime = playerRef.current.getCurrentTime();
                const playerState = playerRef.current.getPlayerState();
                const YT = window.YT;
                
                // Only check when playing or buffering
                if (playerState === YT.PlayerState.PLAYING || 
                    playerState === YT.PlayerState.BUFFERING) {
                    
                    const maxAllowedTime = lastValidTimeRef.current + 0.8; // 0.8 second buffer
                    
                    // If user tried to skip ahead, reset to allowed position
                    if (currentTime > maxAllowedTime) {
                        playerRef.current.seekTo(lastValidTimeRef.current, true);
                    } else {
                        // Update valid time if progressing normally
                        if (currentTime > lastValidTimeRef.current) {
                            lastValidTimeRef.current = currentTime;
                        }
                    }
                }
            } catch (e) {
                // ignore errors
            }
        };

        // Check very frequently to catch any seeking attempts
        const seekCheckInterval = setInterval(handleTimeUpdate, 50);

        return () => {
            clearInterval(seekCheckInterval);
        };
    }, [playerReady, isRestrictedMode]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && ["s", "S", "u", "U"].includes((e.key || "").toString())) {
                e.preventDefault();
            }
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
            }
            // Prevent space bar from pausing
            if (isRestrictedMode && e.key === ' ') {
                e.preventDefault();
            }
        };
        
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        // Prevent right-click on the entire document
        const preventRightClick = (e: MouseEvent) => {
            if (e.target && (e.target as HTMLElement).closest('iframe')) {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener("keydown", handler);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('mousedown', preventRightClick);
        
        return () => {
            document.removeEventListener("keydown", handler);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('mousedown', preventRightClick);
        };
    }, [isRestrictedMode]);

    const saveProgress = (completed: boolean) => {
        if (!kabanataId || hasAlreadySaved) {
            console.log('No kabanataId or already saved');
            return;
        }

        setHasAlreadySaved(true);

        const secondsWatched = Math.floor(secondsWatchedRef.current || 0);
        
        console.log('Saving progress:', {
            kabanataId,
            completed,
            secondsWatched,
            youtubeId
        });

        // Add error handling
        try {
            router.post(route("student.saveVideoProgress"), {
                kabanata_id: kabanataId,
                completed,
                seconds_watched: secondsWatched,
                youtube_id: youtubeId,
            }, {
                preserveState: true,
                onError: (errors) => {
                    console.error('Error saving video progress:', errors);
                    setHasAlreadySaved(false); // Reset flag so we can retry
                },
                onSuccess: (response) => {
                    console.log('Progress saved successfully:', response);
                }
            });
        } catch (error) {
            console.error('Failed to save progress:', error);
            setHasAlreadySaved(false);
        }
    };

    const handleCloseClick = () => {
        // Pause video when showing confirmation
        if (playerRef.current && playerRef.current.pauseVideo) {
            playerRef.current.pauseVideo();
        }
        setShowConfirmation(true);
    };

    const handleCancelClose = () => {
        setShowConfirmation(false);
        // Resume video playback
        if (playerRef.current && playerRef.current.playVideo) {
            playerRef.current.playVideo();
        }
    };

    const handleConfirmClose = () => {
        setShowConfirmation(false);
        // Save progress if not already completed
        if (!hasAlreadySaved && !hasVideoEnded) {
            saveProgress(false);
        }
        if (onClose) onClose();
    };

    const handleSkip = () => {
        if (onSkip) onSkip();
    };

    // Determine if skip button should be shown
    const shouldShowSkipButton = (showSkipOption || (skippable && (hasVideoEnded || isCompleted)));

    return (
        <>
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                {/* YouTube Iframe Container */}
                <div className={`relative w-full h-full`}>
                    {/* YouTube Iframe */}
                    <div className="w-full h-full transition-all duration-300">
                        <div className="relative w-full h-full">
                            <div 
                                id={`yt-player-${youtubeId}`} 
                                ref={containerRef} 
                                style={{ width: "100%", height: "100%" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={handleCloseClick}
                    className="absolute top-4 right-4 text-white text-2xl bg-black/70 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/90 z-30 transition-all duration-200 backdrop-blur-sm"
                >
                    ✕
                </button>

                {/* Skip button - Only show if video is completed/watched */}
                {shouldShowSkipButton && (
                    <button
                        onClick={handleSkip}
                        className="absolute bottom-12 right-6 text-white rounded-lg px-3 py-3 text-base font-semibold hover:bg-gray-800 transition-all duration-200 z-30"
                        style={{
                            background: 'linear-gradient(135deg, #374151 0%, #36373aff 50%)',
                        }}
                    >
                        Skip Video
                    </button>
                )}
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
}