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
    isCompleted?: boolean; // NEW: track if video already completed
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
    isCompleted = false, // NEW: default false
}: YouTubeVideoModalProps) {
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [playerReady, setPlayerReady] = useState(false);
    const watchIntervalRef = useRef<number | null>(null);
    const secondsWatchedRef = useRef<number>(0);
    const [hasAlreadySaved, setHasAlreadySaved] = useState(isCompleted); // NEW

    // Load YT API if needed and create player
    useEffect(() => {
        let mounted = true;

        const createPlayer = () => {
            if (!mounted) return;
            if (!window.YT) return;
            const YT = window.YT;
            if (!containerRef.current) return;

            playerRef.current = new YT.Player(containerRef.current, {
                height: "390",
                width: "640",
                videoId: youtubeId,
                playerVars: {
                    autoplay: 1,
                    controls: 1,
                    rel: 0,
                    modestbranding: 1,
                    enablejsapi: 1,
                },
                events: {
                    onReady: () => {
                        setPlayerReady(true);
                        if (watchIntervalRef.current) window.clearInterval(watchIntervalRef.current);
                        watchIntervalRef.current = window.setInterval(() => {
                            try {
                                const sec = Math.floor(playerRef.current.getCurrentTime() || 0);
                                secondsWatchedRef.current = sec;
                            } catch (e) {
                                // ignore
                            }
                        }, 1000);
                    },
                    onStateChange: (event: any) => {
                        const YT = window.YT;
                        if (event.data === YT.PlayerState.ENDED) {
                            if (onVideoEnd) onVideoEnd();
                            // NEW: only save if not already completed
                            if (!hasAlreadySaved) {
                                saveProgress(true);
                            }
                        }
                        if (event.data === YT.PlayerState.PAUSED) {
                            // NEW: only save if not already completed
                            if (!hasAlreadySaved) {
                                saveProgress(false);
                            }
                        }
                    },
                },
            });
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
        };
    }, [youtubeId]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && ["s", "S", "u", "U"].includes((e.key || "").toString())) {
                e.preventDefault();
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    const saveProgress = (completed: boolean) => {
        if (!kabanataId || hasAlreadySaved) {
            return;
        }

        // Mark as saved to prevent duplicate submissions
        setHasAlreadySaved(true);

        router.post(route("student.saveVideoProgress"), {
            kabanata_id: kabanataId,
            completed,
            seconds_watched: secondsWatchedRef.current || 0,
            youtube_id: youtubeId,
        }, { preserveState: true });
    };

    const handleClose = () => {
        // NEW: only save if not already completed
        if (!hasAlreadySaved) {
            saveProgress(false);
        }
        if (onClose) onClose();
    };

    const handleSkip = () => {
        if (onSkip) onSkip();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={handleClose}></div>

            <div className="relative z-10 max-w-[90vw] w-full bg-white rounded-lg overflow-hidden shadow-lg p-4">
                <div className="flex justify-end mb-2">
                    <button onClick={handleClose} className="px-3 py-1 bg-gray-200 rounded">Close</button>
                </div>

                <div className="flex justify-center">
                    <div id={`yt-player-${youtubeId}`} ref={containerRef} style={{ width: "100%", maxWidth: 900 }} />
                </div>

                <div className="mt-4 flex justify-center gap-4">
                    {/* NEW: show skip button ONLY if video is already completed */}
                    {isCompleted && (
                        <button onClick={handleSkip} className="px-6 py-2 bg-orange-500 text-white rounded">Skip Video</button>
                    )}
                </div>
            </div>
        </div>
    );
}