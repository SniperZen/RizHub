import React, { useRef, useEffect, useState } from "react";

interface VideoModalProps {
    videoSrc: string;
    onClose: () => void;
    onVideoEnd?: () => void;
    skippable?: boolean;
}

const VideoModal: React.FC<VideoModalProps> = ({
    videoSrc,
    onClose,
    onVideoEnd,
    skippable = true,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoDuration, setVideoDuration] = useState<number>(0);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play().catch(() => {});
        }
    }, []);

    // Store duration when it's loaded
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setVideoDuration(videoRef.current.duration);
        }
    };

    const handleSkip = () => {
        if (onVideoEnd) onVideoEnd();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div className="relative max-w-4xl w-full">
                <video
                    ref={videoRef}
                    src={videoSrc}
                    controls
                    className="w-full rounded-lg"
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={onVideoEnd}
                />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-50 rounded-full px-3 py-1 hover:bg-opacity-75"
                >
                    ✕
                </button>

                {/* Skip button */}
                {skippable && (
                    <button
                        onClick={handleSkip}
                        className="absolute bottom-4 right-4 text-white bg-black bg-opacity-50 rounded-md px-4 py-2 text-lg font-semibold hover:bg-opacity-75 transition"
                    >
                        Skip
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoModal;
