import React, { useRef, useEffect, useState, useCallback } from "react";
import { router, Link } from "@inertiajs/react";
import StudentLayout from "../../Layouts/StudentLayout";
import VideoModal from "../Challenge/Video/page"; 
import PreVideoModal from "./Video/Modal/page";

interface Kabanata {
    id: number;
    kabanata: string;
    content: string;
    progress: number;
    stars: number;
    unlocked: boolean;
    music: number;
    sound: number;
}

interface VideoProgress {
    kabanata_progress_id: number;
    video_id: number;
    completed: boolean;
    seconds_watched: number;
    created_at: string;
    updated_at: string;
    kabanata_id?: number; 
}

interface KabanatasPaginated {
    current_page: number;
    last_page: number;
    data: Kabanata[];
}

interface PageProps {
    kabanatas: KabanatasPaginated;
    music: number;
    sound: number;
    videoProgress: VideoProgress[];
    showVideo?: boolean;
    kabanataId?: number;
}

const KabanataPage: React.FC<PageProps> = ({ kabanatas, music: initialMusic, sound: initialSound, videoProgress, showVideo = false, kabanataId = null}) => {
    const [currentPage] = useState(kabanatas.current_page);
    const [music, setMusic] = useState(initialMusic);
    const [volume, setVolume] = useState(initialSound);
    const [prevMusic, setPrevMusic] = useState(initialMusic);
    const [prevVolume, setPrevVolume] = useState(initialSound);
    const [isMusicMuted, setIsMusicMuted] = useState(initialMusic === 0);
    const [isVolumeMuted, setIsVolumeMuted] = useState(initialSound === 0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [showEndModal, setShowEndModal] = useState(false);
    const [lastPlayedVideo, setLastPlayedVideo] = useState<string>("");
    const [selectedKabanataId, setSelectedKabanataId] = useState<number | null>(null);
    const [showPreVideoModal, setShowPreVideoModal] = useState(false);
    const [pendingKabanataId, setPendingKabanataId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<string>("");
    const [hasVideoEnded, setHasVideoEnded] = useState(false);
    const [videoCompleted, setVideoCompleted] = useState<Record<number, boolean>>({});
    const [retryCounts, setRetryCounts] = useState<Record<number, number>>({});

    const positions = [
        { top: "55%", left: "9%" },
        { top: "35%", left: "22%" },
        { top: "48%", left: "36%" },
        { top: "33%", left: "51%" },
        { top: "49%", left: "64%" },
        { top: "34%", left: "79%" },
        { top: "48%", left: "93%" },
    ];

    const [debugInfo, setDebugInfo] = useState<string[]>([]);

    const addDebugLog = (message: string) => {
        console.log(`[DEBUG] ${message}`);
        setDebugInfo(prev => [...prev.slice(-10), message]); // Keep last 10 logs
    };

    useEffect(() => {
        addDebugLog("📘 Kabanata Page Mounted");
        addDebugLog(`Received ${videoProgress.length} video progress records`);
        
        console.log("📘 Kabanata Progress Status:");
        kabanatas.data.forEach((k) => {
            console.log({
                id: k.id,
                title: k.kabanata,
                unlocked: k.unlocked,
                stars: k.stars,
                progress: `${k.progress}/10`
            });
        });
        
        // Log all video progress data received from backend
        console.log("🎥 Video Progress Data:", videoProgress);
        videoProgress.forEach((progress, index) => {
            addDebugLog(`Video Progress ${index + 1}: Video ID ${progress.video_id}, Completed: ${progress.completed}, Kabanata Progress ID: ${progress.kabanata_progress_id}`);
        });

        const kabanataCompletionMap: Record<number, boolean> = {};
        kabanatas.data.forEach(kabanata => {
            const videoCompleted = videoProgress.some(vp => vp.video_id === kabanata.id && vp.completed);
            
            kabanataCompletionMap[kabanata.id] = videoCompleted;
            addDebugLog(`Kabanata ${kabanata.id} completion: ${kabanataCompletionMap[kabanata.id]}`);
        });
        
        setVideoCompleted(kabanataCompletionMap);
        
        // Initialize retry counts
        const initialRetryCounts: Record<number, number> = {};
        kabanatas.data.forEach(k => {
            initialRetryCounts[k.id] = 0;
        });
        setRetryCounts(initialRetryCounts);

        // Check if we need to show a video for a newly unlocked kabanata
        const urlParams = new URLSearchParams(window.location.search);
        const showVideoParam = urlParams.get('showVideo');
        const kabanataIdParam = urlParams.get('kabanataId');
        
        if (showVideoParam === 'true' && kabanataIdParam) {
            const kabanataId = parseInt(kabanataIdParam);
            const kabanata = kabanatas.data.find(k => k.id === kabanataId);
            
            if (kabanata && kabanata.unlocked && !isVideoCompleted(kabanataId)) {
            setPendingKabanataId(kabanataId);
            setShowPreVideoModal(true);
            
            // Clean up the URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
            }
        }
    }, [kabanatas, videoProgress, kabanatas.data]);

    useEffect(() => {
        if (showVideo && kabanataId) {
            setPendingKabanataId(kabanataId);
            setShowPreVideoModal(true);
        }
    }, [showVideo, kabanataId]);


    const saveAudioSettings = useCallback(() => {
        router.post(
            route("student.saveAudioSettings"),
            { music: isMusicMuted ? 0 : music, sound: isVolumeMuted ? 0 : volume },
            { preserveScroll: true, preserveState: true }
        );
    }, [music, volume, isMusicMuted, isVolumeMuted]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            saveAudioSettings();
        }, 500);
        return () => clearTimeout(timer);
    }, [music, volume, isMusicMuted, isVolumeMuted, saveAudioSettings]);

    useEffect(() => {
        const audio = document.getElementById("bg-music") as HTMLAudioElement | null;
        if (audio) {
            audioRef.current = audio;
            audio.volume = initialMusic / 100;
            const playMusic = () => {
                if (audio.paused) {
                    audio.play().catch(e => console.log("Audio play error:", e));
                }
                window.removeEventListener("click", playMusic);
            };
            window.addEventListener("click", playMusic);
            return () => {
                window.removeEventListener("click", playMusic);
            };
        }
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMusicMuted ? 0 : music / 100;
        }
    }, [music, isMusicMuted]);

    const toggleMusic = () => {
        if (isMusicMuted) {
            setMusic(prevMusic);
            setIsMusicMuted(false);
        } else {
            setPrevMusic(music);
            setMusic(0);
            setIsMusicMuted(true);
        }
    };

    const toggleVolume = () => {
        if (isVolumeMuted) {
            setVolume(prevVolume);
            setIsVolumeMuted(false);
        } else {
            setPrevVolume(volume);
            setVolume(0);
            setIsVolumeMuted(true);
        }
    };

    const handleNextPage = () => {
        window.location.href = `/challenge?page=${currentPage + 1}`;
    };

    const handleProceed = () => {
        router.visit(route('guess-characters')); 
    };

    const handlePreviousPage = () => {
        window.location.href = `/challenge?page=${currentPage - 1}`;
    };

    const pauseBackgroundMusic = () => {
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
        }
    };

    // Resume music
    const resumeBackgroundMusic = () => {
        if (audioRef.current && audioRef.current.paused && !isMusicMuted) {
            audioRef.current.play().catch(e => console.log("Music play error:", e));
        }
    };

    const saveVideoProgress = useCallback((kabanataId: number, completed: boolean, secondsWatched = 0) => {
        router.post(route("student.saveVideoProgress"), {
            kabanata_id: kabanataId,
            completed: completed,
            seconds_watched: secondsWatched
        });
        // local state update
        if (completed) {
        setVideoCompleted(prev => ({
            ...prev,
            [kabanataId]: true
        }));
        addDebugLog(`Marked kabanata ${kabanataId} as completed in local state`);
    }
}, []);

    const openVideoModal = (kabanataId: number) => {
        setPendingKabanataId(kabanataId);
        setShowPreVideoModal(true);
        setHasVideoEnded(false);
    };

    const handleProceedToVideo = () => {
        setShowPreVideoModal(false);
        if (pendingKabanataId !== null) {
            const src = `/Video/K${pendingKabanataId}.mp4`;
            setCurrentVideo(src);
            setLastPlayedVideo(src);
            setSelectedKabanataId(pendingKabanataId);
            setIsModalOpen(true);
            pauseBackgroundMusic();
        }
    };

    const handleLater = () => {
        setShowPreVideoModal(false);
        setPendingKabanataId(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentVideo("");
        resumeBackgroundMusic();
    };

    const handleVideoEnded = () => {
        if (selectedKabanataId !== null) {
            saveVideoProgress(selectedKabanataId, true);
            setVideoCompleted(prev => ({
                ...prev,
                [selectedKabanataId]: true
            }));
        }
        setIsModalOpen(false);
        setShowEndModal(true);
        setHasVideoEnded(true);
    };

    const retryVideo = () => {
        setShowEndModal(false);
        setCurrentVideo(lastPlayedVideo);
        setIsModalOpen(true);
        
        // Increment retry count for this kabanata
        if (selectedKabanataId !== null) {
            setRetryCounts(prev => ({
                ...prev,
                [selectedKabanataId]: (prev[selectedKabanataId] || 0) + 1
            }));
        }
    };

    const proceedNext = () => {
        setShowEndModal(false);
        resumeBackgroundMusic();

        if (selectedKabanataId !== null) {
            router.visit(route('guess-characters', { kabanata: selectedKabanataId }));
        }
    };

    // Check if video has been completed before for a specific kabanata
    const isVideoCompleted = (kabanataId: number) => {
        return videoCompleted[kabanataId] || false;
    };

    // Check if video should be skippable based on retry count
    const isVideoSkippable = (kabanataId: number) => {
        const retryCount = retryCounts[kabanataId] || 0;
        return retryCount > 0;
    };

    // Handle skip video action
    const handleSkipVideo = (kabanataId: number) => {
        setVideoCompleted(prev => ({
            ...prev,
            [kabanataId]: true
        }));
        router.visit(route('guess-characters', { kabanata: kabanataId }));
    };

    return (
        <StudentLayout pauseMusic={isModalOpen}>
            <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/Img/Challenge/BG.png')" }}>
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-4">
                    <div className="relative z-20 flex items-center mt-8 ml-8">
                        <img src="/Img/LandingPage/Title.png" alt="RizHub Logo" className="h-[70px] w-auto" />
                    </div>
                    <div className="flex space-x-4">
                        <button onClick={toggleMusic} className="rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                            <img src="/Img/Dashboard/music.png" alt="Music" className="w-full h-[63px]" />
                        </button>
                        <button onClick={toggleVolume} className="rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                            <img src="/Img/Dashboard/volume.png" alt="Volume" className="w-full h-auto" />
                        </button>
                        <Link href={route("dashboard")} className="rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                            <img src="/Img/Dashboard/back.png" alt="Back" className="w-full h-auto" />
                        </Link>
                    </div>
                </div>

                {/* Navigation arrows */}
                <button disabled={currentPage <= 1} onClick={handlePreviousPage}
                    className={`absolute left-[16%] top-[18%] h-20 z-50 ${currentPage <= 1 ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transition"}`}>
                    <img src="/Img/Challenge/ALeft.png" alt="Previous" className="h-20" />
                </button>

                <button disabled={currentPage >= kabanatas.last_page} onClick={handleNextPage}
                    className={`absolute left-[74%] top-[18%] h-20 z-50 ${currentPage >= kabanatas.last_page ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transition"}`}>
                    <img src="/Img/Challenge/ARight.png" alt="Next" className="h-20" />
                </button>

                {/* Kabanata Map */}
                <div className="relative w-full h-[600px]">
                    {kabanatas.data.slice(0, 7).map((k, index) => (
                        <div
                            key={k.id}
                            className="absolute flex flex-col items-center"
                            style={{
                                top: positions[index].top,
                                left: positions[index].left,
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <p className="font-[Risque] text-[20px] text-black">{k.kabanata.toLowerCase()}</p>

                            <div className="relative">
                                <div
                                    className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                                    onClick={() => k.unlocked && openVideoModal(k.id)}
                                >
                                    {k.unlocked ? (
                                        <img src="/Img/Challenge/Play.png" alt="Play" className="w-full h-auto" />
                                    ) : (
                                        <img src="/Img/Challenge/Locked.png" alt="Locked" className="w-full h-auto" />
                                    )}
                                </div>
                            </div>

                            {k.unlocked && (
                                <div className="mt-2 flex flex-col items-center">
                                    <div className="flex space-x-1">
                                        {[...Array(3)].map((_, i) => (
                                            <img 
                                                key={i} 
                                                src="/Img/Challenge/star.png" 
                                                alt="star" 
                                                className={`w-5 h-5 ${i < k.stars ? 'opacity-100' : 'opacity-30'}`} 
                                            />
                                        ))}
                                    </div>
                                    <div className="w-20 h-2 bg-gray-300 rounded-full mt-1 relative">
                                    <div
                                        className="absolute left-0 top-0 h-2 bg-orange-500 rounded-full"
                                        style={{ width: `${(k.progress / 10) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-700 mt-1">{k.progress}/10</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <VideoModal
                        videoSrc={currentVideo}
                        onClose={closeModal}
                        onVideoEnd={handleVideoEnded}
                        skippable={selectedKabanataId !== null && isVideoSkippable(selectedKabanataId)}
                        showSkipOption={pendingKabanataId !== null && isVideoCompleted(pendingKabanataId)}
                        onSkip={() => selectedKabanataId !== null && handleSkipVideo(selectedKabanataId)}
                    />
                )}

                {showEndModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
                        <div className="relative w-full max-w-2xl">
                        <img
                            src="/Img/Challenge/vidModal.png"
                            alt="Wooden Modal"
                            className="w-full h-auto"
                        />
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-10">
                                <p className="font-black-han-sans font-black text-3xl leading-[34px] text-[#95512C] mt-28">
                                    <span className="text-[#B26D42]">
                                        Would you like to{" "}
                                        <span className="underline decoration-wavy decoration-[#FF7E47]">
                                        retry the video
                                        </span>{" "}
                                        or{" "}
                                        <span className="underline decoration-wavy decoration-[#FFA500]">
                                        proceed to the challenge?
                                        </span>
                                    </span>
                                </p>

                                <div className="flex gap-6 mt-36 flex-wrap justify-center">
                                    <button
                                        onClick={retryVideo}
                                        className="w-auto h-[60px] px-8 rounded-[40px] bg-gradient-to-b from-[#FFD93D] to-[#FFB300] shadow-[4px_8px_0_#C48C00] border-4 border-[#E6C17B] text-white text-2xl font-extrabold relative transition hover:scale-105"
                                    >
                                        Retry
                                        <span className="absolute top-3 w-4 h-4 bg-white/80 rounded-full"></span>
                                        <span className="absolute top-7 right-8 w-[10px] h-[10px] bg-white/60 rounded-full"></span>
                                    </button>

                                    <button
                                        onClick={proceedNext}
                                        className="w-auto h-[60px] px-8 rounded-[40px] bg-gradient-to-b from-[#34D399] to-[#059669] shadow-[4px_8px_0_#047857] border-4 border-[#6EE7B7] text-white text-2xl font-extrabold relative transition hover:scale-105"
                                    >
                                        Proceed
                                        <span className="absolute top-3 w-4 h-4 bg-white/80 rounded-full"></span>
                                        <span className="absolute top-7 right-8 w-[10px] h-[10px] bg-white/60 rounded-full"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showPreVideoModal && (
                <PreVideoModal
                    isOpen={showPreVideoModal}
                    onClose={handleLater}
                    onProceed={handleProceedToVideo}
                    showSkipOption={pendingKabanataId !== null && isVideoCompleted(pendingKabanataId)}
                    onSkip={() => pendingKabanataId !== null && handleSkipVideo(pendingKabanataId)}
                />
            )}
        </StudentLayout>
    );
};

export default KabanataPage;