    import React, { useRef, useEffect, useState, useCallback } from "react";
    import { router, Link } from "@inertiajs/react";
    import StudentLayout from "../../Layouts/StudentLayout";
    import VideoModal from "../Challenge/Video/page"; 
    import PreVideoModal from "./Video/Modal/page";
    import CertificateModal from "../../Components/CertificateModal"; 
    import Button from '@/Components/Button';
    import AudioControls from "../../Components/AudioControls";

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
        completedKabanatasCount?: number;
        studentName?: string;
    }

    const KabanataPage: React.FC<PageProps> = ({ 
        kabanatas, 
        music, 
        sound, 
        videoProgress, 
        showVideo = false, 
        kabanataId = null,
        completedKabanatasCount = 0, 
        studentName = "Student"
    }) => {
        const [currentPage] = useState(kabanatas.current_page);
        const [currentMusic, setCurrentMusic] = useState(music);
        const [currentSound, setCurrentSound] = useState(sound);
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
        const [itemsPerPage, setItemsPerPage] = useState(7);
        const [screenSize, setScreenSize] = useState<"desktop" | "tablet" | "mobile">("desktop");
        const [showCertificateModal, setShowCertificateModal] = useState(false);
        const [completedCount, setCompletedCount] = useState(completedKabanatasCount);

        // Filter kabanatas -based on development needs
        const filteredKabanatas = {
            ...kabanatas,
            data: kabanatas.data.filter(k => k.id <= 64)
        };

        //testing purposes only - remove this on production
        // const filteredKabanatas = {
        // ...kabanatas,
        // data: kabanatas.data
        //     .filter(k => k.id <= 64)
        //     .map(k => ({
        //     ...k,
        //     progress: 10,
        //     stars: 3,
        //     unlocked: true
        //     }))
        // };

        // Positions for different screen sizes
        const desktopPositions = [
            { top: "55%", left: "5%" },
            { top: "35%", left: "20%" },
            { top: "48%", left: "36%" },
            { top: "33%", left: "51%" },
            { top: "49%", left: "64%" },
            { top: "34%", left: "79%" },
            { top: "48%", left: "93%" },
        ];

        const tabletPositions = [
            { top: "55%", left: "10%" },
            { top: "35%", left: "30%" },
            { top: "48%", left: "50%" },
            { top: "35%", left: "70%" },
            { top: "55%", left: "90%" },
        ];

        const mobilePositions = [
            { top: "55%", left: "15%" },
            { top: "35%", left: "50%" },
            { top: "55%", left: "85%" },
        ];

        const buildingOffsets = [
            "-70px",  
            "-150px",
            "-100px",
            "-160px",
            "-100px",
            "-160px",
            "-100px",
        ];

        const getPositions = () => {
            if (itemsPerPage === 7) return desktopPositions;
            if (itemsPerPage === 5) return tabletPositions;
            return mobilePositions;
        };

        const positions = getPositions();

        const [debugInfo, setDebugInfo] = useState<string[]>([]);

        const addDebugLog = (message: string) => {
            console.log(`[DEBUG] ${message}`);
            setDebugInfo(prev => [...prev.slice(-10), message]); // Keep last 10 logs
        };

        useEffect(() => {
            addDebugLog("📘 Kabanata Page Mounted");
            addDebugLog(`Received ${videoProgress.length} video progress records`);
            
            console.log("📘 Kabanata Progress Status:");
            filteredKabanatas.data.forEach((k) => {
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
            filteredKabanatas.data.forEach(kabanata => {
                const videoCompleted = videoProgress.some(vp => vp.video_id === kabanata.id && vp.completed);
                
                kabanataCompletionMap[kabanata.id] = videoCompleted;
                addDebugLog(`Kabanata ${kabanata.id} completion: ${kabanataCompletionMap[kabanata.id]}`);
            });
            
            setVideoCompleted(kabanataCompletionMap);
            
            // Initialize retry counts
            const initialRetryCounts: Record<number, number> = {};
            filteredKabanatas.data.forEach(k => {
                initialRetryCounts[k.id] = 0;
            });
            setRetryCounts(initialRetryCounts);

            // Check if we need to show a video for a newly unlocked kabanata
            const urlParams = new URLSearchParams(window.location.search);
            const showVideoParam = urlParams.get('showVideo');
            const kabanataIdParam = urlParams.get('kabanataId');
            
            if (showVideoParam === 'true' && kabanataIdParam) {
                const kabanataId = parseInt(kabanataIdParam);
                const kabanata = filteredKabanatas.data.find(k => k.id === kabanataId);
                
                if (kabanata && kabanata.unlocked && !isVideoCompleted(kabanataId)) {
                setPendingKabanataId(kabanataId);
                setShowPreVideoModal(true);
                
                // Clean up the URL
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
                }
            }

            // Check if all kabanatas are completed
            const allCompleted = filteredKabanatas.data.every(k => isVideoCompleted(k.id));
            if (allCompleted && filteredKabanatas.data.length > 0) {
                setShowCertificateModal(true);
            }
        }, [ videoProgress]);

        useEffect(() => {
            if (showVideo && kabanataId) {
                setPendingKabanataId(kabanataId);
                setShowPreVideoModal(true);
            }
        }, [showVideo, kabanataId]);


        const handleAudioSettingsChange = (newMusic: number, newSound: number) => {
            setCurrentMusic(newMusic);
            setCurrentSound(newSound);
            
            // Update audio elements if needed
            const bgMusic = document.getElementById("bg-music") as HTMLAudioElement;
            if (bgMusic) {
                bgMusic.volume = newMusic / 100;
            }
        };

        const handleNextPage = () => {
            router.get(`/challenge?page=${currentPage + 1}`);
        };
        
        const handleProceed = () => {
            router.visit(route('guess-characters')); 
        };

        const handlePreviousPage = () => {
            router.get(`/challenge?page=${currentPage - 1}`);

        };

        const pauseBackgroundMusic = () => {
            if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
            }
        };

        const resumeBackgroundMusic = () => {
            if (audioRef.current && audioRef.current.paused) {
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
            
            // Update completed count
            const newCount = Object.values({...videoCompleted, [kabanataId]: true}).filter(v => v).length;
            setCompletedCount(newCount);
            
            // Check if all kabanatas are completed
            if (newCount === 64) {
                setShowCertificateModal(true);
            }
        }
    }, [videoCompleted]);

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

        useEffect(() => {
            const updateItemsPerPage = () => {
                if (window.innerWidth < 640) {
                    setItemsPerPage(3); // small screens (mobile)
                } else if (window.innerWidth < 1024) {
                    setItemsPerPage(5); // tablets
                } else {
                    setItemsPerPage(7); // desktops
                }
            };

            updateItemsPerPage();
            window.addEventListener("resize", updateItemsPerPage);

            return () => window.removeEventListener("resize", updateItemsPerPage);
        }, []);

        // Handle certificate claiming
        const handleClaimCertificate = () => {
            // Logic to claim certificate
            router.post(route("student.claimCertificate"));
            setShowCertificateModal(false);
        };

        const handleClaimLock = (kabanataId: number) => {
            router.post(route("student.claimLock"), { kabanata_id: kabanataId });
            console.log(`Claiming lock for kabanata ${kabanataId}`);
        };

        const getTotalProgress = () => {
            return filteredKabanatas.data.reduce((sum, kabanata) => sum + (kabanata.progress || 0), 0);
        };

        return (
            <StudentLayout 
                pauseMusic={isModalOpen}
                musicVolume={currentMusic}
                soundVolume={currentSound}
                onVolumeChange={handleAudioSettingsChange}
            >
                <div className="relative min-h-[100vh] bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/Img/Challenge/BG3.png')" }}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-4">
                        <div className="relative z-20 flex items-center">
                            <img src="/Img/LandingPage/Title.png" alt="RizHub Logo" className="h-[70px] w-auto" />
                        </div>
                        <AudioControls 
                            initialMusic={music}
                            initialSound={sound}
                            onSettingsChange={handleAudioSettingsChange}
                        />
                    </div>
                    <div className="absolute top-[18%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                        <div className="flex justify-center items-center gap-6">
                            {/* Navigation arrows */}
                            <button disabled={currentPage <= 1} onClick={handlePreviousPage}
                                className={` h-20 z-50 ${currentPage <= 1 ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transition"}`}>
                                <img src="/Img/Challenge/ALeft.png" alt="Previous" className="h-20" />
                            </button>
                            <div className="relative w-[800px] h-[150px]">
                                <img 
                                    src="/Img/Challenge/banner-bg.png" 
                                    alt="Banner background" 
                                    className="absolute w-full h-full object-contain"
                                />
                            </div>
                            <button disabled={currentPage >= filteredKabanatas.last_page} onClick={handleNextPage}
                                className={`h-20 z-50 ${currentPage >= filteredKabanatas.last_page ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transition"}`}>
                                <img src="/Img/Challenge/ARight.png" alt="Next" className="h-20" />
                            </button>
                        </div>
                    </div>

                    {/* Progress indicator
                    <div className="absolute top-28 right-8 bg-white/80 rounded-lg p-3 z-10">
                        <div className="text-center">
                            <p className="text-sm font-semibold text-gray-800">Progress: {completedCount}/64</p>
                            <div className="w-32 h-2 bg-gray-300 rounded-full mt-1">
                                <div 
                                    className="h-2 bg-green-500 rounded-full" 
                                    style={{ width: `${(completedCount / 64) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div> */}

                    {/* Kabanata Map */}
                    <div className="relative w-full h-[600px] flex justify-center items-center">
                        <svg className="absolute w-full h-full pointer-events-none">
                            {filteredKabanatas.data.slice(0, itemsPerPage - 1).map((k, i) => {
                                const pos = positions[i];
                                const nextPos = positions[i + 1];
                                
                                // Only draw if both positions exist
                                if (pos && nextPos) {
                                const x1 = parseFloat(pos.left);
                                const y1 = parseFloat(pos.top);
                                const x2 = parseFloat(nextPos.left);
                                const y2 = parseFloat(nextPos.top);

                                return [0.25, 0.44, 0.65].map((fraction, j) => {
                                    const cx = x1 + (x2 - x1) * fraction;
                                    const cy = y1 + (y2 - y1) * fraction;

                                    return (
                                    <circle
                                        key={`${i}-${j}`}
                                        cx={`${cx}%`}
                                        cy={`${cy}%`}
                                        r="11"
                                        fill="black"
                                    />
                                    );
                                });
                                }
                                
                                return null;
                            })}
                        </svg>
                        {/* Kabanata Nodes */}
                        {filteredKabanatas.data.slice(0, itemsPerPage).map((k, index) => (
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
                                    className="max-w-24 h-24 rounded-full flex items-center justify-center cursor-pointer"
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

                        {filteredKabanatas.data.some(k => k.id === 64) && (
                            <div
                                className="absolute flex flex-col items-center z-10 left-[400px] top-[150px]"
                            >
                                <div className="relative max-w-[500px] h-auto rounded-full flex items-center justify-center">
                                    <img src="/Img/Challenge/locked-door.png" alt="Locked Door" className="w-full h-auto" />
                                    
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {(filteredKabanatas.data.find(k => k.id === 64)?.progress || 0) > 0 ? (
                                            <div className="flex items-center justify-center">
                                                <div className="absolute w-[280px] h-[280px] rounded-full overflow-hidden">
                                                    <div className="absolute inset-0 
                                                                    bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.9)_20deg,transparent_40deg)]
                                                                    animate-spin-slower blur-xl opacity-70">
                                                    </div>
                                                </div>

                                                    {/* Background Glow */}
                                                <div className="absolute w-[250px] h-[250px] rounded-full 
                                                    bg-[radial-gradient(circle,rgba(255,200,100,0.6),rgba(255,106,0,0.25),transparent)]
                                                    blur-2xl animate-pulse">
                                                </div>

                                                    {/* Scroll */}
                                                <div className="flex flex-col items-center justify-center">
                                                    <img 
                                                        src="/Img/Challenge/scroll.png"
                                                        alt="Scroll"
                                                        className="absolute top-[150px] w-[120px] h-auto z-10"
                                                    />
                                                    <img src="/Img/Challenge/lightBG.png" alt="" 
                                                        className="absolute top-[100px] w-[250px] h-auto z-90 animate-pulse opacity-80"
                                                    />
                                                        {/* Claim Button */}
                                                    <div className="absolute bottom-[100px] flex items-center justify-center z-20">
                                                        <button
                                                            className="w-[150px] h-[50px] py-2 rounded-[25px] bg-gradient-to-b from-[#FF6A00] to-[#D5703A] shadow-[2px_4px_0_#B97B4B] border-2 border-[#E6B07B] text-white text-lg font-black relative transition hover:scale-105"
                                                            onClick={() => setShowCertificateModal(true)}
                                                        >
                                                            Claim
                                                            <span className="absolute top-1 right-4 w-3 h-3 bg-white/80 rounded-full"></span>
                                                            <span className="absolute top-3 right-8 w-1.5 h-1.5 bg-white/60 rounded-full"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 flex items-center justify-center">
                                                <div className="absolute bg-[rgba(52,27,7,0.5)] w-[220px] h-[240px] z-2 top-[60px]">

                                                </div>
                                                <svg className="z-0" width="82" height="95" viewBox="0 0 82 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M41.0684 0.91626C27.1104 0.91626 15.7546 11.3684 15.7546 24.2158V38.1955H10.6919C8.00645 38.1955 5.43099 39.1774 3.53209 40.9252C1.6332 42.673 0.566406 45.0435 0.566406 47.5153V84.7945C0.566406 87.2663 1.6332 89.6368 3.53209 91.3846C5.43099 93.1324 8.00645 94.1143 10.6919 94.1143H71.4448C74.1303 94.1143 76.7057 93.1324 78.6046 91.3846C80.5035 89.6368 81.5703 87.2663 81.5703 84.7945V47.5153C81.5703 45.0435 80.5035 42.673 78.6046 40.9252C76.7057 39.1774 74.1303 38.1955 71.4448 38.1955H66.3821V24.2158C66.3821 11.3684 55.0263 0.91626 41.0684 0.91626ZM25.8801 24.2158C25.8801 16.5083 32.6946 10.2361 41.0684 10.2361C49.4421 10.2361 56.2566 16.5083 56.2566 24.2158V38.1955H25.8801V24.2158ZM46.1311 74.1839V84.7945H36.0056V74.1839C34.2356 73.251 32.8143 71.8462 31.9292 70.1547C31.0441 68.4633 30.7367 66.5647 31.0476 64.7093C31.3584 62.8538 32.2729 61.1286 33.6705 59.7612C35.0681 58.3938 36.8831 57.4483 38.8762 57.0494C40.3566 56.7482 41.8917 56.7566 43.3681 57.0741C44.8445 57.3916 46.2247 58.0101 47.4068 58.8839C48.589 59.7578 49.5429 60.8647 50.1984 62.1232C50.8538 63.3816 51.194 64.7594 51.1938 66.1549C51.1909 67.7847 50.7214 69.3849 49.8326 70.7945C48.9438 72.2041 47.6671 73.3731 46.1311 74.1839Z" fill="white"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Certificate node at the end if all kabanatas are completed */}
                        {completedCount === 64 && (
                            <div
                                className="absolute flex flex-col items-center"
                                style={{
                                    top: positions[itemsPerPage - 1].top,
                                    left: positions[itemsPerPage - 1].left,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <p className="font-[Risque] text-[20px] text-black">certificate</p>
                                <div 
                                    className="max-w-24 h-24 rounded-full flex items-center justify-center cursor-pointer"
                                    onClick={() => setShowCertificateModal(true)}
                                >
                                    <img src="/Img/Challenge/Certificate.png" alt="Certificate" className="w-full h-auto" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full flex flex-row justify-center items-end mt-[-100px] relative z-0">
                        {filteredKabanatas.data.slice(0, itemsPerPage).map((k, index) => (
                            <div 
                                key={`building-${k.id}`}
                                className="flex w-full relative"
                            >
                                <img 
                                    src="/Img/Challenge/building2.png" 
                                    alt="Building" 
                                    className="w-full max-w-[300px] h-auto object-contain absolute"
                                    style={{ top: buildingOffsets[index] || "0px" }}
                                />
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

                    {/* Certificate Modal */}
                    <CertificateModal 
                        isOpen={showCertificateModal}
                        onClose={() => setShowCertificateModal(false)}
                        studentName={studentName}
                        totalProgress={getTotalProgress()}
                        totalKabanata={64} 
                    />
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