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

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play().catch(() => {});
        }
    }, []);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setVideoDuration(videoRef.current.duration);
        }
    };

    const handleSkip = () => {
        if (onSkip) onSkip();
    };

    return (
        <div className="fixed inset-0 bg-black z-50">
            {/* Grayscale filter container */}
            <div className="relative w-full h-full grayscale">
                <video
                    ref={videoRef}
                    src={videoSrc}
                    controls
                    autoPlay
                    controlsList="nodownload" // ❌ hides the download button
                    disablePictureInPicture={false} // ✅ allows picture-in-picture
                    className="w-screen h-screen object-cover"
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={onVideoEnd}
                    onContextMenu={(e) => e.preventDefault()} // ❌ disables right-click → save as
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
                onClick={onClose}
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
    );
};

export default VideoModal;