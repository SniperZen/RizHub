// resources/js/Pages/Challenge/Video/YouTubeVideoModal.tsx
import { div } from "framer-motion/client";
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
    skippable = true,
    showSkipOption = false,
    onSkip,
}) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [isVideoEnded, setIsVideoEnded] = useState<boolean>(false);
    const [hasCompletedOnce, setHasCompletedOnce] = useState<boolean>(false);
    const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [volume, setVolume] = useState<number>(80);
    const [playbackRate, setPlaybackRate] = useState<number>(1);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [availableQualities, setAvailableQualities] = useState<string[]>([]);
    const [currentQuality, setCurrentQuality] = useState<string>('auto');
    const [showQualityOptions, setShowQualityOptions] = useState<boolean>(false);
    const playerRef = useRef<any>(null);
    const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Function to generate YouTube embed URL WITHOUT controls
    const getYouTubeEmbedUrl = (videoId: string) => {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1&vq=hd1080`;
    };

    useEffect(() => {
        // Load YouTube IFrame API if not already loaded
        if (!(window as any).YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        // Initialize player when API is ready
        const initializePlayer = () => {
            if ((window as any).YT && iframeRef.current && youtubeId) {
                playerRef.current = new (window as any).YT.Player(iframeRef.current, {
                    events: {
                        onReady: () => {
                            console.log("YouTube player ready");
                            setIsPlayerReady(true);
                            
                            // Get initial duration
                            const playerDuration = playerRef.current.getDuration();
                            setDuration(playerDuration);
                            
                            // Set initial volume
                            playerRef.current.setVolume(volume);
                            
                            // Set playback rate
                            playerRef.current.setPlaybackRate(playbackRate);
                            
                            // Try to get available quality levels
                            getAvailableQualities();
                            
                            // Start update interval
                            startUpdateInterval();
                        },
                        onStateChange: (event: any) => {
                            // Video ended (state = 0)
                            if (event.data === (window as any).YT.PlayerState.ENDED) {
                                setIsVideoEnded(true);
                                setIsPlaying(false);
                                setHasCompletedOnce(true);
                                if (onVideoEnd) {
                                    onVideoEnd();
                                }
                            }
                            // Video is playing (state = 1)
                            else if (event.data === (window as any).YT.PlayerState.PLAYING) {
                                setIsPlaying(true);
                                // If video was previously ended and now playing again
                                if (isVideoEnded) {
                                    setIsVideoEnded(false);
                                }
                            }
                            // Video is paused (state = 2)
                            else if (event.data === (window as any).YT.PlayerState.PAUSED) {
                                setIsPlaying(false);
                            }
                        },
                        onError: (event: any) => {
                            console.error("YouTube player error:", event);
                        },
                        onPlaybackQualityChange: (event: any) => {
                            console.log("Playback quality changed:", event.data);
                            // Update current quality when it changes
                            if (event.data) {
                                setCurrentQuality(event.data);
                            }
                        }
                    },
                });
            }
        };

        // Function to get available video qualities
        const getAvailableQualities = () => {
            if (playerRef.current) {
                try {
                    // YouTube API doesn't provide a direct method to get available qualities
                    // We'll use common quality levels and check what's available
                    const qualities = [
                        'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny', 'auto'
                    ];
                    
                    // Note: YouTube doesn't expose available qualities via API in embed mode
                    // We'll just show common quality options
                    setAvailableQualities(['auto', 'hd1080', 'hd720', 'large', 'medium', 'small']);
                    
                    // Try to get current quality
                    setTimeout(() => {
                        if (playerRef.current && playerRef.current.getPlaybackQuality) {
                            const quality = playerRef.current.getPlaybackQuality();
                            if (quality && quality !== 'unknown') {
                                setCurrentQuality(quality);
                            }
                        }
                    }, 2000);
                } catch (error) {
                    console.error("Error getting qualities:", error);
                }
            }
        };

        // If API is already loaded, initialize immediately
        if ((window as any).YT) {
            initializePlayer();
        } else {
            // Set up callback for when API is ready
            (window as any).onYouTubeIframeAPIReady = initializePlayer;
        }

        // Handle fullscreen change
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            clearUpdateInterval();
            
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                } catch (e) {
                    console.log("Error destroying player:", e);
                }
            }
        };
    }, [youtubeId, onVideoEnd]);

    // Function to change video quality
    const handleQualityChange = (quality: string) => {
        if (playerRef.current && playerRef.current.setPlaybackQuality) {
            try {
                playerRef.current.setPlaybackQuality(quality);
                setCurrentQuality(quality);
                setShowQualityOptions(false);
                setShowSettings(false);
                
                // Provide feedback
                console.log(`Quality changed to: ${quality}`);
                
                // If quality is 'auto', use the suggested quality method
                if (quality === 'auto') {
                    if (playerRef.current.setPlaybackQuality) {
                        playerRef.current.setPlaybackQuality('default');
                    }
                }
            } catch (error) {
                console.error("Error changing quality:", error);
            }
        }
    };

    // Get quality label for display
    const getQualityLabel = (quality: string) => {
        const qualityLabels: { [key: string]: string } = {
            'hd2160': '4K (2160p)',
            'hd1440': '1440p',
            'hd1080': '1080p',
            'hd720': '720p',
            'large': '480p',
            'medium': '360p',
            'small': '240p',
            'tiny': '144p',
            'auto': 'Auto',
            'default': 'Auto',
            'highres': 'Highest',
            'highres1': 'Highest'
        };
        
        return qualityLabels[quality] || quality;
    };

    // Interval for updating current time
    const startUpdateInterval = () => {
        clearUpdateInterval();
        updateIntervalRef.current = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                try {
                    const time = playerRef.current.getCurrentTime();
                    setCurrentTime(time);
                } catch (e) {
                    console.log("Error getting current time:", e);
                }
            }
        }, 1000);
    };

    const clearUpdateInterval = () => {
        if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
            updateIntervalRef.current = null;
        }
    };

    // Control functions
    const togglePlay = () => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        if (playerRef.current) {
            playerRef.current.setVolume(newVolume);
            setVolume(newVolume);
        }
    };

    const handlePlaybackRateChange = (rate: number) => {
        if (playerRef.current) {
            playerRef.current.setPlaybackRate(rate);
            setPlaybackRate(rate);
            setShowSettings(false);
        }
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds === Infinity) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSkip = () => {
        if (hasCompletedOnce && onSkip) {
            onSkip();
        }
    };

    const handleCloseClick = () => {
        if (playerRef.current) {
            playerRef.current.pauseVideo();
        }
        setShowConfirmation(true);
    };

    const handleCancelClose = () => {
        setShowConfirmation(false);
        if (playerRef.current && !isPlaying) {
            playerRef.current.playVideo();
        }
    };

    const handleConfirmClose = () => {
        setShowConfirmation(false);
        onClose();
    };

    const toggleFullscreen = () => {
        if (modalRef.current) {
            if (!document.fullscreenElement) {
                modalRef.current.requestFullscreen().then(() => {
                    setIsFullscreen(true);
                }).catch(err => {
                    console.log(`Error attempting to enable fullscreen: ${err.message}`);
                });
            } else {
                document.exitFullscreen().then(() => {
                    setIsFullscreen(false);
                });
            }
        }
    };

    // Prevent right-click and keyboard shortcuts for downloading
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && (e.key === "s" || e.key === "S" || e.key === "v" || e.key === "V")) {
                e.preventDefault();
            }
            // Space bar to play/pause
            if (e.code === 'Space' && !showConfirmation) {
                e.preventDefault();
                togglePlay();
            }
            // Escape key to close
            if (e.code === 'Escape' && !showConfirmation) {
                handleCloseClick();
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isPlaying, showConfirmation]);

    return (
        <>
            <div ref={modalRef} className="fixed inset-0 bg-black z-50 flex flex-col">
                {/* Header - Fixed at top */}
                <div className="h-16 bg-black/90 backdrop-blur-sm flex-shrink-0 flex items-center justify-between px-4 border-gray-800">
                    <div className="text-white text-xs font-bold">
                         © Educational Use Only
                    </div>

                    <button
                        onClick={handleCloseClick}
                        className="text-white text-2xl bg-black/70 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/90 transition-all duration-200"
                    >
                        ✕
                    </button>
                </div>

                {/* Video Container - Takes remaining space */}
                <div className="flex-1 flex items-center justify-center p-4 min-h-0">
                    <div className="relative w-full max-w-6xl h-full max-h-[70vh]">
                        {/* Aspect Ratio Container (16:9) */}
                        <div className="relative w-full h-full">
                            <iframe
                                ref={iframeRef}
                                src={getYouTubeEmbedUrl(youtubeId)}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                referrerPolicy="strict-origin-when-cross-origin"
                                id={`youtube-player-${youtubeId}`}
                                style={{
                                    opacity: isPlayerReady ? 1 : 0,
                                    transition: 'opacity 0.3s ease-in-out',
                                    backgroundColor: '#000'
                                }}
                            />
                            
                            {/* Loading indicator */}
                            {!isPlayerReady && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black rounded-lg">
                                    <div className="text-white text-lg">Loading video...</div>
                                </div>
                            )}

                            {/* Play/Pause overlay button */}
                            {isPlayerReady && (
                                <button
                                    onClick={togglePlay}
                                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-transparent hover:bg-black/10 transition-all duration-200 rounded-lg"
                                >
                                    {!isPlaying && (
                                        <div className="w-20 h-20 bg-black/60 rounded-full flex items-center justify-center">
                                            <svg className="w-12 h-12 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            {/* Custom Controls Bar - Fixed at bottom */}
            <div className="h-20 bg-gradient-to-t from-black/95 to-black/80 backdrop-blur-sm border-gray-800 flex-shrink-0">
                <div className="h-full flex items-center justify-between px-6">
                    
                    {/* Left side: Pause/Play, Volume */}
                    <div className="flex items-center space-x-6">
                        {/* Play/Pause Button */}
                        <button
                            onClick={togglePlay}
                            className="text-white hover:text-gray-300 transition-colors duration-200"
                        >
                            {isPlaying ? (
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                </svg>
                            ) : (
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            )}
                        </button>

                            {/* Volume Control - matches your original design */}
                            <div className="flex items-center space-x-3">
                                <button className="text-white hover:text-gray-300 transition-colors duration-200">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        {volume === 0 ? (
                                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                                        ) : volume < 50 ? (
                                            <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                        ) : (
                                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                        )}
                                    </svg>
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                                    className="w-24 accent-gray-400"
                                />
                            </div>
                        </div>

                    {/* Progress Bar - Takes up most of the space */}
                    <div className="flex-1 mt-5 mx-8">
                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-gray-400 to-gray-300 transition-all duration-200"
                                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                            />
                        </div>
                        {/* Time Display */}
                        <div className="flex justify-between text-gray-300 text-xs mt-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Center: Skip Button (only shown after completion) */}
                    <div className="flex items-center">
                        {(showSkipOption || skippable) && hasCompletedOnce && (
                            <button
                                onClick={handleSkip}
                                className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium border border-gray-700 shadow-lg"
                            >
                                Skip Video
                            </button>
                        )}
                    </div>

                    {/* Right side: Settings and Fullscreen */}
                    <div className="flex items-center space-x-6">
                        {/* Settings Button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="text-white hover:text-gray-300 transition-colors duration-200"
                            >
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                                </svg>
                            </button>
                            
                            {/* Settings Dropdown */}
                            {showSettings && (
                                <div className="absolute bottom-full right-0 mb-3 bg-black/95 backdrop-blur-md rounded-lg shadow-2xl py-2 min-w-[180px] z-50 border border-gray-700">
                                    {/* Playback Speed Section */}
                                    <div className="text-gray-300 text-sm px-4 py-3 border-b border-gray-700 font-medium">
                                        Playback Speed
                                    </div>
                                    {[1, 1.25, 1.5, 1.75, 2].map((rate) => (
                                        <button
                                            key={rate}
                                            onClick={() => handlePlaybackRateChange(rate)}
                                            className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800/80 transition-colors ${
                                                playbackRate === rate ? 'text-gray-300 font-semibold bg-gray-800/50' : 'text-gray-400'
                                            }`}
                                        >
                                            {rate === 1 ? 'Normal' : `${rate}x`}
                                        </button>
                                    ))}
                                    
                                    {/* Divider */}
                                    <div className="border-t border-gray-700 my-1"></div>
                                    
                                    {/* Quality Section */}
                                    <div className="text-gray-300 text-sm px-4 py-3 font-medium">
                                        Quality
                                    </div>
                                    {availableQualities.map((quality) => (
                                        <button
                                            key={quality}
                                            onClick={() => handleQualityChange(quality)}
                                            className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800/80 transition-colors ${
                                                currentQuality === quality ? 'text-gray-300 font-semibold bg-gray-800/50' : 'text-gray-400'
                                            }`}
                                        >
                                            {getQualityLabel(quality)}
                                        </button>
                                    ))}
                                    
                                    {/* If no qualities are available yet */}
                                    {availableQualities.length === 0 && (
                                        <div className="px-4 py-2.5 text-gray-500 text-sm italic">
                                            Loading qualities...
                                        </div>
                                    )}
                                    
                                    {/* Quality Info Note */}
                                    <div className="border-t border-gray-700 mt-1 pt-2 px-4">
                                        <p className="text-gray-500 text-xs">
                                            Note: Quality changes might take a moment to apply.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Fullscreen Button */}
                        <button
                            onClick={toggleFullscreen}
                            className="text-white hover:text-gray-300 transition-colors duration-200"
                        >
                            {isFullscreen ? (
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                                </svg>
                            ) : (
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
                    <div className="absolute inset-0 bg-black/70"></div>
                    <div className="relative w-full max-w-2xl">
                        <img
                            src="/Img/Challenge/vidModal.png"
                            alt="Wooden Modal"
                            className="w-full h-auto"
                        />
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-full max-w-2xl flex flex-col justify-center items-center text-center px-8">
                                <p className="font-black-han-sans font-black text-2xl sm:text-2xl md:text-2xl lg:text-3xl leading-[30px] text-center text-[#95512C] relative top-[40px] lg:top-[40px]">
                                    Sigurado ka bang gusto mong isara ang video? Magsisimula itong muli kapag pinanood mo uli.
                                </p>

                                <div className="flex gap-6 mt-24 relative top-[40px] sm:top-[70px] md:top-[80px] lg:top-[60px]">
                                    <button
                                        className="w-auto h-[50px] lg:h-[60px] px-6 rounded-[40px] bg-gradient-to-b from-gray-300 to-gray-500 shadow-[4px_8px_0_#888] border-4 border-gray-400 text-black text-xl lg:text-3xl font-extrabold relative transition hover:scale-105"
                                        onClick={handleCancelClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="w-auto h-[50px] lg:h-[60px] px-6 rounded-[40px] bg-gradient-to-b from-[#FFA500] to-[#D76D00] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-xl lg:text-3xl font-extrabold relative transition hover:scale-105"
                                        onClick={handleConfirmClose}
                                    >
                                        Proceed
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default YouTubeVideoModal;