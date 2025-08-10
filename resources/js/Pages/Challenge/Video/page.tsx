import React, { useRef, useEffect } from "react";

interface VideoModalProps {
    videoSrc: string;
    onClose: () => void;
    onVideoEnd?: () => void; // new prop for callback
}

const VideoModal: React.FC<VideoModalProps> = ({ videoSrc, onClose, onVideoEnd }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play().catch(() => {});
        }
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div className="relative max-w-4xl w-full">
                <video
                    ref={videoRef}
                    src={videoSrc}
                    controls
                    className="w-full rounded-lg"
                    onEnded={onVideoEnd} // call when ended
                />
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white text-2xl"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default VideoModal;
