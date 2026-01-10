import React, { useRef, useEffect, useState, useCallback } from "react";
import { router, Link } from "@inertiajs/react";
import StudentLayout from "../../Layouts/StudentLayout";
import YouTubeVideoModal from "../Challenge/Video/YouTubeVideoModal";
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
    hash?: string;
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

    // Helper: map numeric id to hashed id provided in `kabanatas` prop
    const getKabanataHash = (id: number | null) => {
        if (id === null) return null;
        const found = filteredKabanatas.data.find(k => k.id === id) as any;
        return found?.hash ?? id;
    };

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

    // Filter kabanatas (keep only first 64)
    const filteredKabanatas = {
        ...kabanatas,
        data: kabanatas.data.filter(k => k.id <= 64)
    };

    // Function to check if all unlocked kabanatas have 80% or higher grade
    const areAllKabanatasAbove80Percent = () => {
        // Get all unlocked kabanatas
        const unlockedKabanatas = filteredKabanatas.data.filter(k => k.unlocked);
        
        // If no unlocked kabanatas, return false
        if (unlockedKabanatas.length === 0) return false;
        
        // Check if all unlocked kabanatas have progress >= 8/10 (80%)
        return unlockedKabanatas.every(k => {
            const percentage = (k.progress / 10) * 100;
            return percentage >= 80;
        });
    };

    // testing purposes only - remove this on production
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
        { top: "55%", left: "15%" },
        { top: "35%", left: "40%" },
        { top: "55%", left: "65%" },
        { top: "35%", left: "90%" },
    ];

    const mobilePositions = [
        { top: "55%", left: "15%" },
        { top: "35%", left: "50%" },
        { top: "55%", left: "85%" },
    ];

    // Responsive building offsets based on screen size
    const getBuildingOffsets = () => {
        // For mobile and tablet views (itemsPerPage = 3 or 4)
        if (itemsPerPage < 7) {
            // Mobile and tablet offsets as requested
            return [
                "-70px",  
                "-120px",
                "-70px",
                "-120px",
                "-70px",
                "-120px",
                "-70px",
            ];
        } 
        // For desktop view (itemsPerPage = 7)
        else {
            // Desktop offsets as requested
            return [
                "-70px",  
                "-150px",
                "-100px",
                "-160px",
                "-100px",
                "-160px",
                "-100px",
            ];
        }
    };

    const buildingOffsets = getBuildingOffsets();

    const getPositions = () => {
        if (itemsPerPage === 7) return desktopPositions;
        if (itemsPerPage === 4) return tabletPositions;
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
        addDebugLog("Kabanata Page Mounted");
        addDebugLog(`Received ${videoProgress.length} video progress records`);
        
        console.log("Kabanata Progress Status:");
        
        filteredKabanatas.data.forEach((k) => {
            console.log({
                id: k.id,
                title: k.kabanata,
                unlocked: k.unlocked,
                stars: k.stars,
                progress: `${k.progress}/10`,
                percentage: `${(k.progress / 10) * 100}%`
            });
        });
        
        // Log all video progress data received from backend
        console.log("Video Progress Data:", videoProgress);
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
        
        // Debug 80% check
        console.log("80% Check Results:");
        console.log("Are all unlocked kabanatas above 80%?", areAllKabanatasAbove80Percent());
        
        const unlockedKabanatas = filteredKabanatas.data.filter(k => k.unlocked);
        unlockedKabanatas.forEach(k => {
            const percentage = (k.progress / 10) * 100;
            console.log(`Kabanata ${k.id}: ${percentage}% - ${percentage >= 80 ? "✓" : "✗"}`);
        });
    }, [videoProgress]);

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

    const handleGoToDoorPage = () => {
        if (screenSize === "tablet") {
            setCurrentPage(17);
            // Door page has no data, so we don't need to make API call
            // Just update the state to trigger re-render
        }
    };

    // Update handleNextPage to handle door page
    const handleNextPage = () => {
        if (currentPage < displayTotalPages) {
            // If we're on page 16 and going to page 17 (door page) on tablet
            if (screenSize === "tablet" && currentPage === 16) {
                handleGoToDoorPage();
            } else {
                router.get(`/challenge?page=${currentPage + 1}&per_page=${itemsPerPage}`);
            }
        }
    };

    // Update handlePreviousPage
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            // If we're on door page (17) and going back to page 16 on tablet
            if (screenSize === "tablet" && currentPage === 17) {
                router.get(`/challenge?page=16&per_page=4`);
            } else {
                router.get(`/challenge?page=${currentPage - 1}&per_page=${itemsPerPage}`);
            }
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
            const hash = getKabanataHash(selectedKabanataId);
            router.visit(route('guess-characters', { kabanata: hash }));
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
        const hash = getKabanataHash(kabanataId);
        router.visit(route('guess-characters', { kabanata: hash }));
    };

    useEffect(() => {
        const updateItemsPerPage = () => {
            let newItemsPerPage;
            let newScreenSize: "desktop" | "tablet" | "mobile";

            if (window.innerWidth < 640) {
                newItemsPerPage = 3;
                newScreenSize = "mobile";
            } else if (window.innerWidth < 1024) {
                newItemsPerPage = 4; // Tablet: 4 items per page
                newScreenSize = "tablet";
            } else {
                newItemsPerPage = 7;
                newScreenSize = "desktop";
            }

            const kabanataPages = Math.ceil(64 / newItemsPerPage); // Pages with actual kabanatas
            let adjustedPage = currentPage;
            
            // For tablet, we have kabanatas on pages 1-16 and door on page 17
            if (newScreenSize === "tablet") {
                // If current page is 17 (door page), keep it
                if (currentPage === 17) {
                    adjustedPage = 17;
                }
                // If current page is beyond kabanata pages but not 17, adjust to last kabanata page
                else if (currentPage > kabanataPages && currentPage !== 17) {
                    adjustedPage = kabanataPages;
                }
                // If current page is 0 or negative, set to 1
                else if (currentPage < 1) {
                    adjustedPage = 1;
                }
            }
            // For other screens
            else {
                if (currentPage > kabanataPages) {
                    adjustedPage = kabanataPages;
                } else if (currentPage < 1) {
                    adjustedPage = 1;
                }
            }

            // Only update and reload if something changed
            if (newItemsPerPage !== itemsPerPage || adjustedPage !== currentPage) {
                setItemsPerPage(newItemsPerPage);
                setScreenSize(newScreenSize);
                setIsLoading(true);
                
                // For tablet on door page (17), we need to handle it specially
                if (newScreenSize === "tablet" && adjustedPage === 17) {
                    // Door page - should have empty data
                    setCurrentPage(17);
                    // We don't need to make an API call for door page since it has no data
                    // Just update local state
                    setIsLoading(false);
                } else {
                    // Normal page with kabanatas
                    if (adjustedPage !== currentPage) setCurrentPage(adjustedPage);
                    router.get(
                        `/challenge?page=${adjustedPage}&per_page=${newItemsPerPage}`,
                        {},
                        {
                            preserveState: true,
                            onFinish: () => setIsLoading(false),
                            onError: (error) => {
                                console.error('Page load error:', error);
                                setIsLoading(false);
                                // If there's an error, check if it's because we're requesting page 17
                                if (newScreenSize === "tablet" && adjustedPage === 17) {
                                    // For door page, just set empty data locally
                                    setCurrentPage(17);
                                } else if (newScreenSize === "tablet") {
                                    // For other tablet pages, try page 16 (last kabanata page)
                                    router.get(`/challenge?page=16&per_page=4`);
                                }
                            }
                        }
                    );
                }
            }
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);

        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, [itemsPerPage, currentPage]);

    const totalKabanatas = 64;
    const totalPages = Math.ceil(totalKabanatas / itemsPerPage);

    // Calculate which page should have the door
    const getDoorPage = () => {
        if (screenSize === "tablet") {
            return 17; // Door on separate page 17 for tablet (4 items/page)
        } else if (screenSize === "mobile") {
            return Math.ceil(64 / 3); // Last page for mobile (3 items/page)
        } else {
            return Math.ceil(64 / 7); // Last page for desktop (7 items/page)
        }
    };

    const doorPage = getDoorPage();

    // Check if we should show kabanatas (not on door page and has data)
    const shouldShowKabanatas = () => {
        if (screenSize === "tablet" && currentPage === 17) {
            return false; // Door page, no kabanatas
        }
        return filteredKabanatas.data.length > 0;
    };

    // Check if we should show the door
    const shouldShowDoor = () => {
        return currentPage === doorPage;
    };

    // Get adjusted total pages for display (including door page)
    const getDisplayTotalPages = () => {
        if (screenSize === "tablet") {
            return 17; // 16 pages of kabanatas + 1 door page
        }
        return totalPages;
    };

    const displayTotalPages = getDisplayTotalPages();

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
            <div className="relative min-h-[100vh] bg-cover bg-center overflow-hidden pointer-events-auto" style={{ backgroundImage: "url('/Img/Challenge/bg7.png')" }}>
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
                <div className="flex items-center justify-end px-8 py-4 pointer-events-auto">
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
                            className={`absolute right-[290px] md:right-[640px] lg:right-[735px] top-[12%] z-[60] w-auto h-auto mt-10 ${
                                currentPage <= 1
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:scale-110 transition-transform"
                            }`}
                        >
                            <img
                                src="/Img/Challenge/ALeft.png"
                                alt="Previous"
                                className="h-12 w-12 sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 object-contain"
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
                            disabled={currentPage >= displayTotalPages}
                            onClick={handleNextPage}
                            className={`absolute left-[280px] md:left-[620px] lg:left-[715px] top-[12%] z-[60] w-auto h-auto mt-10 ${
                                currentPage >= displayTotalPages
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:scale-110 transition-transform"
                            }`}
                        >
                            <img
                                src="/Img/Challenge/ARight.png"
                                alt="Next"
                                className="h-12 w-12 sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 object-contain"
                            />
                        </button>
                    </div>
                </div>

                {/* Kabanata Map */}
                <div className="w-full h-[600px] flex justify-center ml-4 items-center z-0">
                    {shouldShowDoor() ? (
                        /* Show only the door on the door page */
                        <div className="absolute flex flex-col items-center z-10 left-1/2 transform -translate-x-1/2 top-[180px] sm:top-[190px] md:top-[200px] lg:top-[220px]">
                            <div className="relative w-[300px] h-[300px] top-[100px] md:top-[60px] lg:top-[3px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[380px] lg:h-[380px] rounded-full flex items-center justify-center">
                                {/* FIXED: Show UNLOCKED door when all unlocked kabanatas have 80% or higher grade */}
                                {areAllKabanatasAbove80Percent() ? (
                                    // When all unlocked kabanatas have >= 80% grade, show UNLOCKED door
                                    <img 
                                        src="/Img/Challenge/unlocked-door.png" 
                                        alt="Unlocked Door" 
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    // Otherwise, show LOCKED door
                                    <img 
                                        src="/Img/Challenge/locked-door2.png" 
                                        alt="Locked Door" 
                                        className="w-full h-full object-contain"
                                    />
                                )}
                                
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {areAllKabanatasAbove80Percent() ? (
                                        // When door is unlocked, show treasure box that opens certificate modal
                                        <div className="flex items-center justify-center">
                                            <div className="absolute w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] lg:w-[160px] lg:h-[160px] rounded-full overflow-hidden">
                                                <div className="absolute inset-0 
                                                                bg-[conic-gradient(from_0deg,transparent_0deg,rgba(253, 212, 149, 0.76)_20deg,transparent_40deg)]
                                                                animate-spin-slower blur-xl opacity-70">
                                                </div>
                                            </div>

                                            {/* Background Glow */}
                                            <div className="absolute w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] md:w-[130px] md:h-[130px] lg:w-[150px] lg:h-[150px] rounded-full 
                                                bg-[radial-gradient(circle,rgba(255,200,100,0.6),rgba(255,106,0,0.25),transparent)]
                                                blur-2xl animate-pulse">
                                            </div>

                                            <img 
                                                src="/Img/Challenge/lightBG2.png" 
                                                alt="Treasure Box" 
                                                className="absolute top-[80px] sm:top-[50px] md:top-[80px] lg:top-[80px] w-[200px] sm:w-[150px] md:w-[270px] lg:w-[300px] h-auto z-50 animate-pulse opacity-80 cursor-pointer transition hover:scale-105 pointer-events-auto"
                                                onClick={() => setShowCertificateModal(true)}
                                            />
                                        </div>
                                    ) : (
                                        // When door is locked, show padlock with tooltip
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                                            <div className="absolute w-[80px] h-[100px] sm:w-[100px] sm:h-[120px] md:w-[110px] md:h-[130px] lg:w-[120px] lg:h-[140px] z-2 top-[20px] sm:top-[25px] md:top-[30px] lg:top-[35px]">
                                            </div>
                                            <div className="group relative">
                                                <svg className="z-0 w-12 h-12 sm:w-8 sm:h-8 md:w-14 md:h-14 lg:w-16 lg:h-16" viewBox="0 0 82 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M41.0684 0.91626C27.1104 0.91626 15.7546 11.3684 15.7546 24.2158V38.1955H10.6919C8.00645 38.1955 5.43099 39.1774 3.53209 40.9252C1.6332 42.673 0.566406 45.0435 0.566406 47.5153V84.7945C0.566406 87.2663 1.6332 89.6368 3.53209 91.3846C5.43099 93.1324 8.00645 94.1143 10.6919 94.1143H71.4448C74.1303 94.1143 76.7057 93.1324 78.6046 91.3846C80.5035 89.6368 81.5703 87.2663 81.5703 84.7945V47.5153C81.5703 45.0435 80.5035 42.673 78.6046 40.9252C76.7057 39.1774 74.1303 38.1955 71.4448 38.1955H66.3821V24.2158C66.3821 11.3684 55.0263 0.91626 41.0684 0.91626ZM25.8801 24.2158C25.8801 16.5083 32.6946 10.2361 41.0684 10.2361C49.4421 10.2361 56.2566 16.5083 56.2566 24.2158V38.1955H25.8801V24.2158ZM46.1311 74.1839V84.7945H36.0056V74.1839C34.2356 73.251 32.8143 71.8462 31.9292 70.1547C31.0441 68.4633 30.7367 66.5647 31.0476 64.7093C31.3584 62.8538 32.2729 61.1286 33.6705 59.7612C35.0681 58.3938 36.8831 57.4483 38.8762 57.0494C40.3566 56.7482 41.8917 56.7566 43.3681 57.0741C44.8445 57.3916 46.2247 58.0101 47.4068 58.8839C48.589 59.7578 49.5429 60.8647 50.1984 62.1232C50.8538 63.3816 51.194 64.7594 51.1938 66.1549C51.1909 67.7847 50.7214 69.3849 49.8326 70.7945C48.9438 72.2041 47.6671 73.3731 46.1311 74.1839Z" fill="white"/>
                                                </svg>
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 sm:px-3 sm:py-2 bg-gray-800 text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20">
                                                    Kailangan ma-unlock ang lahat ng kabanata at makakuha ng 80% para ma-unlock ang pinto!
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Show regular kabanatas on other pages */
                        <>
                            {/* Certificate node at the end if all kabanatas are completed and have 80% or higher */}
                            {areAllKabanatasAbove80Percent() && currentPage === totalPages && (
                                <div
                                    className="absolute flex flex-col items-center"
                                    style={{
                                        top: positions[itemsPerPage - 1].top,
                                        left: positions[itemsPerPage - 1].left,
                                        transform: "translate(-50%, -50%)",
                                    }}
                                >
                                    <p className="font-[Risque] text-[20px] lg:text-[20px] text-black">certificate</p>
                                    <div 
                                        className="max-w-24 h-24 rounded-full flex items-center justify-center cursor-pointer"
                                        onClick={() => setShowCertificateModal(true)}
                                    >
                                        <img src="/Img/Challenge/Certificate2.png" alt="Certificate" className="w-full h-auto" />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Buildings with Kabanata Nodes and Stars - Only show when not on door page */}
                {shouldShowKabanatas() && (
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
                            {/* Kabanata 64 Special Building - Made Responsive */}
                            {k.id === 64 ? (
                            <div className={`relative w-full flex justify-start ${
                                screenSize === "mobile" ? "pl-6" : 
                                screenSize === "tablet" ? "pl-10" : "pl-10"
                            }`}>
                                <img 
                                src="/Img/Challenge/building(1).png" 
                                alt="Building" 
                                className="absolute pointer-events-none object-contain"
                                style={{ 
                                    top: buildingOffsets[itemsPerPage - 1] || "0px",
                                    left: "0",
                                    // Responsive width for Kabanata 64
                                    width: screenSize === "mobile" ? "180px" : 
                                           screenSize === "tablet" ? "250px" : "250px",
                                    height: "auto", 
                                }}
                                />

                                {/* Kabanata 64 Node (Unified Float Group) */}
                                <div
                                className="absolute flex flex-col items-center pointer-events-auto z-40 floating-group"
                                style={{
                                    // Responsive positioning for Kabanata 64 node
                                    top: screenSize === "mobile" ? 
                                         `calc(${buildingOffsets[itemsPerPage - 1] || "0px"} - 130px)` :
                                         screenSize === "tablet" ? 
                                         `calc(${buildingOffsets[itemsPerPage - 1] || "0px"} - 130px)` :
                                         `calc(${buildingOffsets[itemsPerPage - 1] || "0px"} - 130px)`,
                                    left: screenSize === "mobile" ? "90px" :
                                          screenSize === "tablet" ? "115px" : "125px",
                                    transform: "translateX(-50%)",
                                }}
                                >
                                <p className="font-[Risque] text-orange-400 mb-3 pointer-events-auto
                                                drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]
                                                hover:drop-shadow-[0_0_15px_rgba(251,191,36,1)]
                                                transition-all duration-300 text-center
                                                text-lg md:text-lg lg:text-[20px]"
                                >
                                    {k.kabanata ? k.kabanata.charAt(0).toUpperCase() + k.kabanata.slice(1).toLowerCase() : ''}
                                </p>

                                <div className="relative">
                                    <div
                                    className={`rounded-full flex items-center justify-center z-50 cursor-pointer ${
                                        screenSize === "mobile" ? "w-20 h-20" : 
                                        screenSize === "tablet" ? "w-20 h-20" :
                                        "w-20 h-20"
                                    }`}
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

                                {/* Stars + Progress for Kabanata 64 */}
                                {k.unlocked && (
                                <div 
                                    className="absolute flex flex-col items-center"
                                    style={{ 
                                    top: screenSize === "mobile" ?
                                         `calc(${buildingOffsets[itemsPerPage - 1] || "0px"} + 35px)` :
                                         screenSize === "tablet" ?
                                         `calc(${buildingOffsets[itemsPerPage - 1] || "0px"} + 45px)` :
                                         `calc(${buildingOffsets[itemsPerPage - 1] || "0px"} + 55px)`,
                                    left: screenSize === "mobile" ? "85px" :
                                          screenSize === "tablet" ? "115px" : "125px",
                                    transform: "translateX(-50%)"
                                    }}
                                >
                                    <div className="flex space-x-1">
                                    {[...Array(3)].map((_, i) => (
                                        <img 
                                        key={i} 
                                        src="/Img/Challenge/star.png" 
                                        alt="star" 
                                        className={`${screenSize === "mobile" ? "w-5 h-5" :
                                                   screenSize === "tablet" ? "w-5 h-5" :
                                                   "w-5 h-5"} ${i < k.stars ? 'opacity-100' : 'opacity-30'}`} 
                                        />
                                    ))}
                                    </div>
                                    <div className={`bg-gray-300 rounded-full mt-1 relative ${
                                        screenSize === "mobile" ? "w-20 h-2" :
                                        screenSize === "tablet" ? "w-20 h-2" :
                                        "w-20 h-2"
                                    }`}>
                                    <div
                                        className="absolute left-0 top-0 h-full bg-orange-500 rounded-full"
                                        style={{ width: `${(k.progress / 10) * 100}%` }}
                                    ></div>
                                    </div>
                                    <span className={`text-gray-700 mt-0.5 ${
                                        screenSize === "mobile" ? "text-xs" :
                                        screenSize === "tablet" ? "text-xs" :
                                        "text-xs"
                                    }`}>{k.progress}/10</span>
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
                                <p className="font-[Risque] text-lg md:text-lg lg:text-[20px] text-orange-400 mb-3 pointer-events-auto
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
                )}

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
                                className="font-black-han-sans font-black text-base sm:text-lg md:text-2xl lg:text-3xl leading-[20px] lg:leading-[34px] text-[#95512C] mt-[55px] sm:mt-[55px] md:mt-[130px] lg:mt-[130px] opacity-0"
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
                            <div className="flex gap-4 md:gap-6 lg:gap-6 mt-[55px] sm:mt-[55px] md:mt-[150px] lg:mt-[150px] flex-wrap justify-center opacity-0"
                                style={{
                                    animation: 'fadeIn 0.5s ease-out 0.8s both'
                                }}>
                                <button
                                    onClick={retryVideo}
                                    className="w-auto h-[35px] sm:h-[50px] md:h-[50px] lg:h-[50px] px-4 md:px-8 lg:px-8  rounded-[40px] bg-gradient-to-b from-gray-300 to-gray-500 shadow-[4px_8px_0_#888] border-4 border-gray-400 text-black text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold relative transition hover:scale-105"
                                >
                                    Panoorin muli
                                </button>

                                <button
                                    onClick={proceedNext}
                                    className="w-auto h-[35px] sm:h-[50px] md:h-[50px] lg:h-[50px] px-4 md:px-8 lg:px-8 rounded-[40px] bg-gradient-to-b from-[#FF7E47] to-[#B26D42] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold relative transition hover:scale-105"
                                >
                                    Magpatuloy
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