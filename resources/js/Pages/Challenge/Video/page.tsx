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
    onSkip
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
            <video
                ref={videoRef}
                src={videoSrc}
                controls
                autoPlay
                className="w-screen h-screen object-cover"
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={onVideoEnd}
                style={{
                    filter: "grayscale(100%)",
                }}
            />

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full px-3 py-1 hover:bg-opacity-75 z-10"
            >
                ✕
            </button>

            {/* Skip button */}
            {(showSkipOption || skippable) && (
                <button
                    onClick={handleSkip}
                    className="absolute bottom-6 right-6 text-white bg-black bg-opacity-50 rounded-md px-4 py-2 text-lg font-semibold hover:bg-opacity-75 transition z-10"
                >
                    Skip
                </button>
            )}
        </div>
    );
};

export default VideoModal;
