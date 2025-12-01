import React, { useRef, useEffect, useState } from "react";

interface VideoModalProps {
    videoSrc: string;
    onClose: () => void;
    onVideoEnd?: () => void;
    onSkip?: () => void;
    skippable?: boolean;
    showSkipOption?: boolean;
}

const VideoModal: React.FC<VideoModalProps> = ({
    videoSrc,
    onClose,
    onVideoEnd,
    skippable = true,
    showSkipOption = false,
    onSkip,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const [isPortrait, setIsPortrait] = useState<boolean>(false);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play().catch(() => {});
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

    const checkOrientation = () => {
        // Check if device is mobile/tablet and in portrait mode
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        const isPortraitMode = window.innerHeight > window.innerWidth;
        
        setIsPortrait((isMobile || isTablet) && isPortraitMode);
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setVideoDuration(videoRef.current.duration);
        }
    };

    const handleSkip = () => {
        if (onSkip) onSkip();
    };

    const handleCloseClick = () => {
        // Pause video when showing confirmation
        if (videoRef.current) {
            videoRef.current.pause();
        }
        setShowConfirmation(true);
    };

    const handleCancelClose = () => {
        setShowConfirmation(false);
        // Resume video playback
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    };

    const handleConfirmClose = () => {
        setShowConfirmation(false);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                {/* Grayscale filter container */}
                <div className={`relative grayscale ${isPortrait ? 'w-full max-w-full' : 'w-full h-full'}`}>
                    <video
                        ref={videoRef}
                        src={videoSrc}
                        controls
                        autoPlay
                        controlsList="nodownload"
                        disablePictureInPicture={false}
                        className={`
                            ${isPortrait 
                                ? 'max-h-[85vh] w-auto mx-auto object-contain' 
                                : 'w-full h-full object-contain md:object-cover'
                            }
                            transition-all duration-300
                        `}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={onVideoEnd}
                        onContextMenu={(e) => e.preventDefault()}
                        style={{
                            filter: "grayscale(100%) contrast(1.1) brightness(0.9)"
                        }}
                    />
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

                {/* Skip button */}
                {(showSkipOption || skippable) && (
                    <button
                        onClick={handleSkip}
                        className="absolute bottom-6 right-6 text-white rounded-lg px-5 py-3 text-base font-semibold hover:bg-black/90 transition-all duration-200 z-30"
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
            )}
        </>
    );
};

export default VideoModal;