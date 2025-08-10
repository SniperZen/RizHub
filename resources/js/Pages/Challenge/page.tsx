import React, { useState, useRef, useEffect, useCallback } from "react";
import { router, Link } from "@inertiajs/react";
import StudentLayout from "../../Layouts/StudentLayout";
import VideoModal from "../Challenge/Video/page"; 

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

interface KabanatasPaginated {
    current_page: number;
    last_page: number;
    data: Kabanata[];
}

interface PageProps {
    kabanatas: KabanatasPaginated;
    music: number;
    sound: number;
}

const KabanataPage: React.FC<PageProps> = ({ kabanatas, music: initialMusic, sound: initialSound }) => {
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

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<string>("");

    const positions = [
        { top: "55%", left: "9%" },
        { top: "35%", left: "22%" },
        { top: "48%", left: "36%" },
        { top: "33%", left: "51%" },
        { top: "49%", left: "64%" },
        { top: "34%", left: "79%" },
        { top: "48%", left: "93%" },
    ];

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
    const openVideoModal = (kabanataId: number) => {
        const src = `/Video/K${kabanataId}.mp4`;
        setCurrentVideo(src);
        setLastPlayedVideo(src); 
        setIsModalOpen(true);
        pauseBackgroundMusic();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentVideo("");
        resumeBackgroundMusic(); 
    };

    const handleVideoEnded = () => {
        setIsModalOpen(false); 
        setShowEndModal(true); 
    };

    const retryVideo = () => {
        setShowEndModal(false);
        setCurrentVideo(lastPlayedVideo);
        setIsModalOpen(true);
    };

    const proceedNext = () => {
        setShowEndModal(false);
        resumeBackgroundMusic();
        handleNextPage();
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

                            {k.unlocked && (
                                <div className="mt-2 flex flex-col items-center">
                                    <div className="flex space-x-1">
                                        {[...Array(k.stars)].map((_, i) => (
                                            <span key={i} className="material-icons text-yellow-400 text-xl">star</span>
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
                        onVideoEnd={handleVideoEnded} // detect when ended
                    />
                )}

                {showEndModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <h2 className="text-xl font-bold mb-4">Video Finished</h2>
                            <p className="mb-6">Would you like to retry the video or proceed?</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={retryVideo}
                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                                >
                                    Retry
                                </button>
                                <button
                                    onClick={proceedNext}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                >
                                    Proceed
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default KabanataPage;
