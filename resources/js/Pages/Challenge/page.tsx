import React, { useRef, useEffect, useState, useCallback } from "react";
import { router, Link } from "@inertiajs/react";
import StudentLayout from "../../Layouts/StudentLayout";
import YouTubeVideoModal from "../Challenge/Video/YouTubeVideoModal"; // NEW: Changed import
import PreVideoModal from "./Video/Modal/page";
import CertificateModal from "../../Components/CertificateModal"; 
import Button from '@/Components/Button';
import AudioControls from "../../Components/AudioControls";
import youtubeMappings from "./youtubeMappings";

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
    const [currentPage, setCurrentPage] = useState(kabanatas.current_page);
    const [currentMusic, setCurrentMusic] = useState(music);
    const [currentSound, setCurrentSound] = useState(sound);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const vibrationAudioRef = useRef<HTMLAudioElement | null>(null);
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
    const [isLoading, setIsLoading] = useState(false);
    const [percentageDisplayType, setPercentageDisplayType] = useState<"rounded" | "decimal">("decimal");
    const [vibratingLockedId, setVibratingLockedId] = useState<number | null>(null);

    // YouTube video mappings for kabanata 1-64
    const youtubeVideoMappings: Record<number, string> = {
        1: "Oy-HT0nlexQ",
        2: "g_zpQPmPnaI",
        3: "qP5Jgbtwq6k",
        4: "wUGE8RPJYRA",
        5: "aWFTGAqbhGs",
        6: "ouGjYr4Iy_Y",
        7: "jfVQNQBzuvg",
        8: "hMa-umoNn3A",
        9: "6zuX6knG6Hs",
        10: "yU1QoMcFHcU",
        11: "7ZEX2ji4pkQ",
        12: "um2loURFoow",
        13: "QBuwbn2gb6w",
        14: "CFowB5ttrcU",
        15: "mjhQz2RCif0",
        16: "rUU61BIziDQ",
        17: "OXdrq_ozh18",
        18: "TJmGROV6ub4",
        19: "3qcIIWmDoVc",
        20: "BOlIO_paMrM",
        21: "XW1hddWvAXc",
        22: "13g4jSBFdm0",
        23: "EB8lZ9EkRtI",
        24: "BeLmTk4oJ5I",
        25: "k1JymHlsOQ0",
        26: "7ejxJYRCiLk",
        27: "AM53CDpJEOs",
        28: "k1lKwp-UnOI",
        29: "X4A7pWQlDHU",
        30: "GED1AUodgyE",
        31: "jVrfEirfHc8",
        32: "Q-DZmU8D_Po",
        33: "ozVp2VtIDsI",
        34: "FgbxUUeEfgU",
        35: "P6wf4_xDyvQ",
        36: "q8zCzz0BEOU",
        37: "8Go-fOiAM3s",
        38: "MXmONRQjbbk",
        39: "nukaua5So6k",
        40: "r-EsHvjgZVE",
        41: "zZJjHxlIJns",
        42: "qyIlcWjT8o0",
        43: "cDMSJFb0NkY",
        44: "vyE_34q1aZ0",
        45: "w6QFrC9UMhQ",
        46: "ZmERBBCOXWs",
        47: "bECnFSQagZQ",
        48: "p1oxLiu4aeo",
        49: "iYr_s4D90oc",
        50: "vXYaQO8zDis",
        51: "FbPJsweasos",
        52: "BHSkK4dPalc",
        53: "aIgZG4hIF2o",
        54: "x07hHdtwFy8",
        55: "px8cdDIbvJE",
        56: "aBRinvmw9KQ",
        57: "Q5GNX4pnFdM",
        58: "RzxBtleI21Q",
        59: "mWL40dbwgNY",
        60: "KUMEn9ollSo",
        61: "06a60t0G5fg",
        62: "NMxd7MROBbU",
        63: "fx8J-zJ8OtE",
        64: "zLGcQ4FY9IE",
    };

    // Filter kabanatas -based on development needs
    const filteredKabanatas = {
        ...kabanatas,
        data: kabanatas.data.filter(k => k.id <= 64)
    };

    // Calculate total stars percentage with different display options
    const getTotalStarsPercentage = (displayType: "rounded" | "decimal" = percentageDisplayType) => {
        const totalPossibleStars = filteredKabanatas.data.length * 3; // 3 stars per kabanata
        const totalEarnedStars = filteredKabanatas.data.reduce((sum, kabanata) => sum + kabanata.stars, 0);
        
        if (totalPossibleStars === 0) return 0;
        
        const percentage = (totalEarnedStars / totalPossibleStars) * 100;
        
        if (displayType === "decimal") {
            // Return with 2 decimal places
            return Math.min(100, parseFloat(percentage.toFixed(2)));
        } else {
            // Return rounded to nearest integer
            return Math.min(100, Math.round(percentage));
        }
    };

    // Calculate completion percentage based on stars
    const getCompletionPercentage = () => {
        return getTotalStarsPercentage();
    };

    // Get percentage display text
    const getPercentageDisplayText = () => {
        const percentage = getTotalStarsPercentage();
        if (percentageDisplayType === "decimal") {
            return percentage.toFixed(2) + "%";
        } else {
            return Math.round(percentage) + "%";
        }
    };

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

    // Add vibration handler function with sound
    const handleLockedClick = (kabanataId: number) => {
        setVibratingLockedId(kabanataId);
        
        // Play vibration sound
        if (vibrationAudioRef.current) {
            vibrationAudioRef.current.volume = currentSound / 100; // Use sound volume setting
            vibrationAudioRef.current.currentTime = 0; // Reset to start
            vibrationAudioRef.current.play().catch(e => console.log("Vibration sound play error:", e));
        }
        
        setTimeout(() => setVibratingLockedId(null), 500); // Reset after animation
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
        if (currentPage < totalPages) {
            router.get(`/challenge?page=${currentPage + 1}&per_page=${itemsPerPage}`);
        }
    };
    
    const handleProceed = () => {
        router.visit(route('guess-characters')); 
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            router.get(`/challenge?page=${currentPage - 1}&per_page=${itemsPerPage}`);
        }
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
            seconds_watched: secondsWatched,
            youtube_id: currentVideo, // send current YouTube id so backend can create/update Video row
        }, {
            onSuccess: () => {
                if (completed) {
                    setVideoCompleted(prev => ({
                        ...prev,
                        [kabanataId]: true
                    }));
                    addDebugLog(`Marked kabanata ${kabanataId} as completed in local state`);
                    const newCount = Object.values({...videoCompleted, [kabanataId]: true}).filter(v => v).length;
                    setCompletedCount(newCount);
                }
            }
        });
    }, [currentVideo, videoCompleted, addDebugLog]);

    const openVideoModal = (kabanataId: number) => {
        setPendingKabanataId(kabanataId);
        setShowPreVideoModal(true);
        setHasVideoEnded(false);
    };

    // UPDATED: Now sets YouTube ID instead of file path
    const handleProceedToVideo = () => {
        setShowPreVideoModal(false);
        if (pendingKabanataId !== null) {
            const youtubeId = youtubeVideoMappings[pendingKabanataId];
            if (youtubeId) {
                setCurrentVideo(youtubeId);
                setLastPlayedVideo(youtubeId);
                setSelectedKabanataId(pendingKabanataId);
                setIsModalOpen(true);
                pauseBackgroundMusic();
            } else {
                console.error(`No YouTube ID found for kabanata ${pendingKabanataId}`);
                // Fallback or show error message
            }
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

    // UPDATED: Now works with YouTube IDs
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
            let newItemsPerPage;
            let newScreenSize: "desktop" | "tablet" | "mobile";

            if (window.innerWidth < 640) {
                newItemsPerPage = 3;
                newScreenSize = "mobile";
            } else if (window.innerWidth < 1024) {
                newItemsPerPage = 5;
                newScreenSize = "tablet";
            } else {
                newItemsPerPage = 7;
                newScreenSize = "desktop";
            }

            const newTotalPages = Math.ceil(64 / newItemsPerPage);
            const adjustedPage = currentPage > newTotalPages ? newTotalPages : currentPage;

            // Only update and reload if something changed
            if (newItemsPerPage !== itemsPerPage || adjustedPage !== currentPage) {
                setItemsPerPage(newItemsPerPage);
                setScreenSize(newScreenSize);
                setIsLoading(true);
                // Update currentPage state if needed
                if (adjustedPage !== currentPage) setCurrentPage(adjustedPage);
                router.get(
                    `/challenge?page=${adjustedPage}&per_page=${newItemsPerPage}`,
                    {},
                    {
                        preserveState: true,
                        onFinish: () => setIsLoading(false)
                    }
                );
            }
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);

        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, [itemsPerPage, currentPage]);

    const totalKabanatas = 64;
    const totalPages = Math.ceil(totalKabanatas / itemsPerPage);

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
            <div className="relative min-h-[100vh] bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/Img/Challenge/bg7.png')" }}>
                {/* Vibration Sound Effect */}
                <audio 
                    ref={vibrationAudioRef} 
                    preload="auto"
                    style={{ display: 'none' }}
                >
                    <source src="/Music/vibration.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>

                {/* Header */}
                <div className="flex items-center justify-end px-8 py-4">
                    {/* AudioControls is now justified to the right side of the remaining space */}
                    <AudioControls 
                        initialMusic={music}
                        initialSound={sound}
                        onSettingsChange={handleAudioSettingsChange}
                    />
                </div>
                
                {/* Banner Image Container Adjustment */}
                <div className="absolute top-[35%] md-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] px-0 z-100">
                    <div className="relative flex justify-center items-center w-full">
                        
                        {/* Left Arrow - Very Close to Banner */}
                        <button
                            disabled={currentPage <= 1}
                            onClick={handlePreviousPage}
                            className={`absolute -left-[-180px] top-[12%] z-[60] w-auto h-auto mt-10 ${
                                currentPage <= 1
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:scale-110 transition-transform"
                            }`}
                        >
                            <img
                                src="/Img/Challenge/ALeft.png"
                                alt="Previous"
                                className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 object-contain"
                            />
                        </button>

                        {/* Banner Image */}
                        <img
                            src="/Img/Dashboard/t-bg1.png"
                            alt="Banner background"
                            className="relative z-[20] w-full mt-10 max-w-[1000px] h-auto object-contain"
                            style={{
                                animation: "gentleHeartbeat 5s ease-in-out infinite"
                            }}
                        />

                        {/* Right Arrow - Very Close to Banner */}
                        <button
                            disabled={currentPage >= totalPages}
                            onClick={handleNextPage}
                            className={`absolute -right-[-185px] top-[12%] z-[60] w-auto h-auto mt-10 ${
                                currentPage >= totalPages
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:scale-110 transition-transform"
                            }`}
                        >
                            <img
                                src="/Img/Challenge/ARight.png"
                                alt="Next"
                                className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 object-contain"
                            />
                        </button>
                    </div>
                </div>

                {/* Kabanata Map */}
                <div className="w-full h-[600px] flex justify-center ml-4 items-center z-0">

                    {filteredKabanatas.data.some(k => k.id === 64) && (
                        <div
                            className="absolute flex flex-col items-center z-10 left-[530px] sm:left-[230px] md:left-[240px] lg:left-[560px] top-[205px] lg:top-[220px]"
                        >
                            <div className="relative max-w-[170px] sm:max-w-[300px] lg:max-w-[370px] md:max-w-[370px] h-auto rounded-full flex items-center justify-center">
                                {/* Conditionally render locked or unlocked door */}
                                {completedCount === 64 ? (
                                    <img src="/Img/Challenge/locked-door2.png" alt="Unlocked Door" className="w-full h-auto" />
                                ) : (
                                    <img src="/Img/Challenge/unlocked-door.png" alt="Locked Door" className="w-full h-auto" />
                                )}
                                
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {(filteredKabanatas.data.find(k => k.id === 64)?.progress || 0) > 0 ? (
                                        <div className="flex items-center justify-center">
                                            <div className="absolute w-[280px] h-[280px] rounded-full overflow-hidden">
                                                <div className="absolute inset-0 
                                                                bg-[conic-gradient(from_0deg,transparent_0deg,rgba(253, 212, 149, 0.76)_20deg,transparent_40deg)]
                                                                animate-spin-slower blur-xl opacity-70">
                                                </div>
                                            </div>

                                            {/* Background Glow */}
                                            <div className="absolute w-[250px] h-[250px] rounded-full 
                                                bg-[radial-gradient(circle,rgba(255,200,100,0.6),rgba(255,106,0,0.25),transparent)]
                                                blur-2xl animate-pulse">
                                            </div>

                                            <img 
                                                src="/Img/Challenge/lightBG2.png" 
                                                alt="Treasure Box" 
                                                className="absolute top-[110px] w-[300px] h-auto z-50 animate-pulse opacity-80 cursor-pointer transition hover:scale-105 pointer-events-auto"
                                                onClick={() => setShowCertificateModal(true)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 flex items-center justify-center">
                                            <div className="absolute w-[220px] h-[240px] z-2 top-[60px]">
                                            </div>
                                            <div className="group relative">
                                                <svg className="z-0" width="82" height="70" viewBox="0 0 82 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M41.0684 0.91626C27.1104 0.91626 15.7546 11.3684 15.7546 24.2158V38.1955H10.6919C8.00645 38.1955 5.43099 39.1774 3.53209 40.9252C1.6332 42.673 0.566406 45.0435 0.566406 47.5153V84.7945C0.566406 87.2663 1.6332 89.6368 3.53209 91.3846C5.43099 93.1324 8.00645 94.1143 10.6919 94.1143H71.4448C74.1303 94.1143 76.7057 93.1324 78.6046 91.3846C80.5035 89.6368 81.5703 87.2663 81.5703 84.7945V47.5153C81.5703 45.0435 80.5035 42.673 78.6046 40.9252C76.7057 39.1774 74.1303 38.1955 71.4448 38.1955H66.3821V24.2158C66.3821 11.3684 55.0263 0.91626 41.0684 0.91626ZM25.8801 24.2158C25.8801 16.5083 32.6946 10.2361 41.0684 10.2361C49.4421 10.2361 56.2566 16.5083 56.2566 24.2158V38.1955H25.8801V24.2158ZM46.1311 74.1839V84.7945H36.0056V74.1839C34.2356 73.251 32.8143 71.8462 31.9292 70.1547C31.0441 68.4633 30.7367 66.5647 31.0476 64.7093C31.3584 62.8538 32.2729 61.1286 33.6705 59.7612C35.0681 58.3938 36.8831 57.4483 38.8762 57.0494C40.3566 56.7482 41.8917 56.7566 43.3681 57.0741C44.8445 57.3916 46.2247 58.0101 47.4068 58.8839C48.589 59.7578 49.5429 60.8647 50.1984 62.1232C50.8538 63.3816 51.194 64.7594 51.1938 66.1549C51.1909 67.7847 50.7214 69.3849 49.8326 70.7945C48.9438 72.2041 47.6671 73.3731 46.1311 74.1839Z" fill="white"/>
                                                </svg>
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20">
                                                    Tapusin lahat ng kabanata at kumuha ng 80% na grado para ma-unlock!
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                                </div>
                                            </div>
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
                                <img src="/Img/Challenge/Certificate2.png" alt="Certificate" className="w-full h-auto" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Buildings with Kabanata Nodes and Stars */}
                <div className="w-full flex flex-row justify-center ml-2 items-end mt-[-100px] relative z-30 pointer-events-auto">
                    <style>
                        {`
                        @keyframes floatSmoothTogether {
                            0%, 100% { transform: translate(-50%, 0); }
                            50% { transform: translate(-50%, -12px); }
                        }

                        .floating-group {
                            animation: floatSmoothTogether 3.5s ease-in-out infinite;
                        }

                        @keyframes vibrate {
                            0% { transform: translate(0); }
                            20% { transform: translate(-2px, -2px); }
                            40% { transform: translate(2px, -2px); }
                            60% { transform: translate(-2px, 2px); }
                            80% { transform: translate(2px, 2px); }
                            100% { transform: translate(0); }
                        }

                        .vibrate {
                            animation: vibrate 0.5s ease-in-out;
                        }
                        `}
                    </style>
                    {filteredKabanatas.data.slice(0, itemsPerPage).map((k, index) => (
                    <div 
                        key={`building-${k.id}`}
                        className="flex w-full relative pointer-events-auto"
                    >
                        {/* Kabanata 64 Special Building */}
                        {k.id === 64 ? (
                        <div className="relative w-full flex justify-start pl-10">
                            <img 
                            src="/Img/Challenge/building(1).png" 
                            alt="Building" 
                            className="absolute pointer-events-none object-contain"
                            style={{ 
                                top: buildingOffsets[itemsPerPage - 1] || "0px",
                                left: "0",
                                width: "250px",
                                height: "auto",
                            }}
                            />

                            {/* Kabanata 64 Node (Unified Float Group) */}
                            <div
                            className="absolute flex flex-col items-center pointer-events-auto z-40 floating-group"
                            style={{
                                top: `calc(${buildingOffsets[itemsPerPage - 1] || "0px"} - 130px)`,
                                left: "125px",
                                transform: "translateX(-50%)",
                            }}
                            >
                            <p className="font-[Risque] text-[20px] text-orange-400 mb-3 pointer-events-auto
                                            drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]
                                            hover:drop-shadow-[0_0_15px_rgba(251,191,36,1)]
                                            transition-all duration-300 text-center"
                            >
                                {k.kabanata ? k.kabanata.charAt(0).toUpperCase() + k.kabanata.slice(1).toLowerCase() : ''}
                            </p>

                            <div className="relative">
                                <div
                                className="max-w-20 h-20 rounded-full flex items-center justify-center z-50 cursor-pointer"
                                onClick={() => { 
                                    if (k.unlocked) {
                                        openVideoModal(k.id); 
                                    } else {
                                        handleLockedClick(k.id);
                                    }
                                }}
                                >
                                {k.unlocked ? (
                                    <img src="/Img/Challenge/Play.png" alt="Play" className="w-full h-auto" />
                                ) : (
                                    <img 
                                        src="/Img/Challenge/Locked.png" 
                                        alt="Locked" 
                                        className={`w-full h-auto ${vibratingLockedId === k.id ? 'vibrate' : ''}`}
                                    />
                                )}
                                </div>
                            </div>
                            </div>

                            {/* Stars + Progress */}
                            {k.unlocked && (
                            <div 
                                className="absolute flex flex-col items-center"
                                style={{ 
                                top: `calc(${buildingOffsets[itemsPerPage - 1] || "0px"} + 45px)`,
                                left: "125px",
                                transform: "translateX(-50%)"
                                }}
                            >
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
                        ) : (
                        /* Regular Kabanatas */
                        <>
                            <img 
                            src="/Img/Challenge/building(1).png" 
                            alt="Building" 
                            className="w-full max-w-[250px] h-auto object-contain absolute pointer-events-none"
                            style={{ top: buildingOffsets[index] || "0px" }}
                            />

                            {/* Regular Kabanata Node (Unified Float Group) */}
                            <div
                            className="absolute flex flex-col items-center pointer-events-auto z-40 floating-group" 
                            style={{
                                top: `calc(${buildingOffsets[index] || "0px"} - 125px)`,
                                left: "50%",
                                transform: "translateX(-50%)",
                            }}
                            >
                            <p className="font-[Risque] text-[20px] text-orange-400 mb-3 pointer-events-auto
                                            drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]
                                            hover:drop-shadow-[0_0_15px_rgba(251,191,36,1)]
                                            transition-all duration-300 text-center"
                            >
                                {k.kabanata ? k.kabanata.charAt(0).toUpperCase() + k.kabanata.slice(1).toLowerCase() : ''}
                            </p>

                            <div className="relative">
                                <div
                                className="max-w-20 h-20 rounded-full flex items-center justify-center z-50 cursor-pointer"
                                onClick={() => { 
                                    if (k.unlocked) {
                                        openVideoModal(k.id); 
                                    } else {
                                        handleLockedClick(k.id);
                                    }
                                }}
                                >
                                {k.unlocked ? (
                                    <img src="/Img/Challenge/Play.png" alt="Play" className="w-full h-auto" />
                                ) : (
                                    <img 
                                        src="/Img/Challenge/Locked.png" 
                                        alt="Locked" 
                                        className={`w-full h-auto ${vibratingLockedId === k.id ? 'vibrate' : ''}`}
                                    />
                                )}
                                </div>
                            </div>
                            </div>

                            {/* Stars and Progress */}
                            {k.unlocked && (
                            <div 
                                className="absolute flex flex-col items-center"
                                style={{ 
                                top: `calc(${buildingOffsets[index] || "0px"} + 45px)`,
                                left: "50%",
                                transform: "translateX(-50%)"
                                }}
                            >
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
                        </>
                        )}
                    </div>
                    ))}
                    </div>

                {/* UPDATED: Changed VideoModal to YouTubeVideoModal */}
                {isModalOpen && currentVideo && (
                    <YouTubeVideoModal
                        youtubeId={currentVideo}
                        onClose={closeModal}
                        onVideoEnd={handleVideoEnded}
                        kabanataId={selectedKabanataId}
                        isCompleted={selectedKabanataId !== null && isVideoCompleted(selectedKabanataId)} // NEW
                        skippable={selectedKabanataId !== null && isVideoSkippable(selectedKabanataId)}
                        showSkipOption={pendingKabanataId !== null && isVideoCompleted(pendingKabanataId)}
                        onSkip={() => selectedKabanataId !== null && handleSkipVideo(selectedKabanataId)}
                    />
                )}

{showEndModal && (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
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
            <div className="relative w-full max-w-2xl flex flex-col justify-center items-center text-center px-10 opacity-0"
                 style={{
                     animation: 'fadeIn 0.5s ease-out 0.4s both'
                 }}>
                {/* Text */}
                <p 
                    className="font-black-han-sans font-black text-3xl leading-[34px] text-[#95512C] mt-28 opacity-0"
                    style={{
                        animation: 'fadeIn 0.5s ease-out 0.6s both'
                    }}
                >
                    <span className="text-[#B26D42]">
                        Gusto mo bang{" "}
                        <span className="decoration-[#FF7E47]">
                        ulitin ang panonood
                        </span>{" "}
                        o{" "}
                        <span className="decoration-[#FFA500]">
                        magpatuloy na lamang sa hamon?
                        </span>
                    </span>
                </p>

                                {/* Buttons appear after text */}
                                <div className="flex gap-6 mt-[155px] flex-wrap justify-center opacity-0"
                                    style={{
                                        animation: 'fadeIn 0.5s ease-out 0.8s both'
                                    }}>
                                    <button
                                        onClick={retryVideo}
                                        className="w-auto h-[60px] px-8 rounded-[40px] bg-gradient-to-b from-gray-300 to-gray-500 shadow-[4px_8px_0_#888] border-4 border-gray-400 text-black text-3xl font-extrabold relative transition hover:scale-105"
                                    >
                                        Retry
                                    </button>

                                    <button
                                        onClick={proceedNext}
                                        className="w-auto h-[60px] px-8 rounded-[40px] bg-gradient-to-b from-[#FF7E47] to-[#B26D42] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-3xl font-extrabold relative transition hover:scale-105"
                                    >
                                        Proceed
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
                    totalStarsPercentage={getTotalStarsPercentage()}
                    percentageDisplayType={percentageDisplayType}
                    totalKabanata={64} 
                />

                {/* Animation Styles */}
                <style>
                    {`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }

                    @keyframes scaleIn {
                        0% {
                            opacity: 0;
                            transform: scale(0.8);
                        }
                        70% {
                            transform: scale(1.05);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }

                    @keyframes fadeInUp {
                        0% {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes gentleBounce {
                        0% {
                            transform: scale(0.9);
                            opacity: 0;
                        }
                        60% {
                            transform: scale(1.02);
                            opacity: 1;
                        }
                        80% {
                            transform: scale(0.98);
                        }
                        100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }

                    @keyframes subtlePulse {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.02);
                        }
                    }

                    .animate-subtle-pulse {
                        animation: subtlePulse 2s ease-in-out infinite;
                    }
                    `}
                </style>
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