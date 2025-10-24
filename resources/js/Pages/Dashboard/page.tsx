import React, { useState, useRef, useEffect } from "react";
import { router } from '@inertiajs/react';
import StudentLayout from "../../Layouts/StudentLayout";
import Button from '@/Components/Button';
import { useForm, usePage } from '@inertiajs/react';
import Delete from '../../../js/Pages/Dashboard/Partial/Delete';
import LogoutModal from '../../../js/Pages/Dashboard/Partial/LogoutModal';
import ShareModal from '../../../js/Pages/Dashboard/Partial/ShareModal';
import { PageProps } from '@/types';
import MailModal from '../../../js/Pages/Dashboard/Partial/MailModal';
import { motion, AnimatePresence } from 'framer-motion';

export interface AppNotification {
    id: number;
    user_id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
}
interface DashboardProps {
    music: number;
    sound: number;
    name : string;
    unreadNotifications: number;
    notifications: AppNotification[];
}

// Custom hook for image loading
const useImageLoader = (src: string) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoaded(true);
        img.onerror = () => setIsLoaded(true); // Still show content even if image fails
    }, [src]);

    return isLoaded;
};

export default function Dashboard({ 
    music: initialMusic, 
    sound: initialSound, 
    name: initialName, 
    unreadNotifications: initialUnreadNotifications,
    notifications: initialNotifications
}: DashboardProps) {

    const [showSettings, setShowSettings] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const [showGeneral, setShowGeneral] = useState(true);
    const [volume, setVolume] = useState(initialSound);
    const [music, setMusic] = useState(initialMusic);
    const [prevVolume, setPrevVolume] = useState(initialSound);
    const [prevMusic, setPrevMusic] = useState(initialMusic);
    const [isMusicMuted, setIsMusicMuted] = useState(false);
    const [isVolumeMuted, setIsVolumeMuted] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showMail, setShowMail] = useState(false);
    const [unreadCount, setUnreadCount] = useState(initialUnreadNotifications);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        newUsername: '',
        newEmailAddress: ''
    });

    const user = usePage<PageProps>().props.auth.user;
    const volumeRef = useRef<HTMLDivElement>(null);
    const musicRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    // Use the custom hook for modal background images
    const isSettingsBgLoaded = useImageLoader('/Img/Dashboard/modalBG.png');
    const isAccountBgLoaded = useImageLoader('/Img/Dashboard/modalBG.png');

    const { data, setData, errors,patch,  put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
        name: user.name,
        email: user.email,
    });

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
            if (errors.password) {
                reset('password', 'password_confirmation');
                passwordInput.current?.focus();
            }
            if (errors.current_password) {
                reset('current_password');
                currentPasswordInput.current?.focus();
            }
            },
        });
    };

    useEffect(() => {
        console.log("Dashboard mounted with music:", initialMusic, "sound:", initialSound);
        }, []);
           

    // Initialize audio and set initial volume
    useEffect(() => {
        const audio = document.getElementById("bg-music") as HTMLAudioElement | null;
        if (audio) {
            audioRef.current = audio;
            // Set initial volume from props
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

    // Update music volume when it changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMusicMuted ? 0 : music / 100;
        }
    }, [music, isMusicMuted]);

    // Save settings to database with debounce
    const handleSliderChangeEnd = React.useCallback(() => {
        router.post(route('student.saveSettings'), { 
            music: isMusicMuted ? 0 : music, 
            sound: isVolumeMuted ? 0 : volume 
        }, {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Settings saved successfully. Music:", music, "Volume:", volume, "Muted:", isMusicMuted, isVolumeMuted);
            },
            onError: () => {
                console.error("Failed to save settings", "Music:", music, "Volume:", volume, "Muted:", isMusicMuted, isVolumeMuted);
            }
        });
    }, [music, volume, isMusicMuted, isVolumeMuted]);

    // Debounce the save function to prevent too many requests
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSliderChangeEnd();
        }, 500); // 500ms debounce
        
        return () => clearTimeout(timer);
    }, [music, volume, handleSliderChangeEnd]);

    const toggleVolume = () => {
        if (volume === 0) {
            setVolume(prevVolume);
            setIsVolumeMuted(false);
        } else {
            setPrevVolume(volume);
            setVolume(0);
            setIsVolumeMuted(true);
        }
    };

    const toggleMusic = () => {
        if (music === 0) {
            setMusic(prevMusic);
            setIsMusicMuted(false);
        } else {
            setPrevMusic(music);
            setMusic(0);
            setIsMusicMuted(true);
        }
    };

    // Drag logic for sliders
    const handleSliderDrag = (
        e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
        setter: (value: number) => void,
        ref: React.RefObject<HTMLDivElement>
    ) => {
        const slider = ref.current;
        if (!slider) return;
        
        const rect = slider.getBoundingClientRect();
        const x = "touches" in e ? e.touches[0].clientX : e.clientX;
        let percent = ((x - rect.left) / rect.width) * 100;
        percent = Math.max(0, Math.min(100, percent));
        
        const newValue = Math.round(percent);
        setter(newValue);
        
        // If we're unmuting by dragging
        if (setter === setMusic && newValue > 0) {
            setIsMusicMuted(false);
        }
        if (setter === setVolume && newValue > 0) {
            setIsVolumeMuted(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submitProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('dashboard.profile.update'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                console.log('Profile updated successfully');
            }
        });
    };

    const markAsRead = () => {
        router.post(route('notifications.markAsRead'), {}, {
            onSuccess: () => {
                setUnreadCount(0);
            }
        });
    };

    const handleVolumeChange = (newMusic: number, newSound: number) => {
        setMusic(newMusic);
        setVolume(newSound);
        
        // Save settings immediately when changed via external controls
        router.post(route('student.saveSettings'), { 
            music: isMusicMuted ? 0 : newMusic, 
            sound: isVolumeMuted ? 0 : newSound 
        }, {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Settings saved successfully");
            },
            onError: () => {
                console.error("Failed to save settings");
            }
        });
    };


   return (
    <StudentLayout
        musicVolume={music}
        soundVolume={volume}
        onVolumeChange={handleVolumeChange}
    >


<div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">

    {/* Background image full screen */}
    <img
        src="/Img/Dashboard/BG1.png"
        alt="Noli Me Tangere BG"
        className="absolute inset-0 w-full h-full object-cover z-10"
    />

    <img
        src="/Img/Dashboard/t-bg1.png"
        alt="Noli Me Tangere BG"
        className="absolute inset-0 top-10 w-full h-full object-cover z-10"
        style={{
            animation: 'gentleHeartbeat 3s ease-in-out infinite'
        }}
    />

    <style>
    {`
    @keyframes gentleHeartbeat {
      0% { transform: scale(1); }
      20% { transform: scale(1.05); }
      40% { transform: scale(1); }
      60% { transform: scale(1.05); }
      80% { transform: scale(1); }
      100% { transform: scale(1); }
    }
    `}
    </style>

    <img
        src="/Img/Dashboard/t-bg2.png"
        alt="Noli Me Tangere BG"
        className="absolute inset-0 top-3 w-full h-full object-cover z-10"
        style={{
            animation: 'floating 4s ease-in-out infinite'
        }}
    />

    <style>
    {`
    @keyframes floating {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0px); }
    }
    `}
    </style>
            
    {/* Buttons Container - Fixed Positioning */}
    <div className="relative z-50 flex flex-col items-center gap-6 mt-40 md:mt-42">
        {/* Play Button */}
        <Button
            className="w-[280px] h-[90px] py-4 rounded-[40px] bg-gradient-to-b from-[#FF6A00] to-[#D5703A] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-3xl font-black relative transition hover:scale-105 z-50"
            soundHover="/sounds/button-hover.mp3"
            soundClick="/Music/Sound.mp3"
            soundVolume={volume}
            onClick={() => router.get(route('challenge'))}
        >
            Play
            <span className="absolute top-2 right-6 w-5 h-5 bg-white/80 rounded-full"></span>
            <span className="absolute top-5 right-12 w-2 h-2 bg-white/60 rounded-full"></span>
        </Button>

        {/* Exit Button */}
        <Button
            className="w-[200px] py-4 rounded-[30px] bg-gradient-to-b from-[#FF7E47] to-[#B26D42] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-2xl font-extrabold relative transition hover:scale-105 z-50"
            onClick={() => router.post(route('student.exit'))}
            soundHover="/sounds/button-hover.mp3"
            soundClick="/Music/Sound.mp3"
            soundVolume={volume}
        >
            Exit
            <span className="absolute top-2 right-6 w-5 h-5 bg-white/80 rounded-full"></span>
            <span className="absolute top-5 right-12 w-2 h-2 bg-white/60 rounded-full"></span>
        </Button>
    </div>

{/* Bottom Icons */}
<div className="absolute bottom-8 flex gap-8 md:gap-20 justify-center items-center z-40 w-full px-4">
    <Button
        type="button"
        className="transition hover:scale-110 focus:outline-none relative"
        aria-label="Star Folder"
        soundHover="/sounds/button-hover.mp3"
        soundClick="/Music/Sound.mp3"
        soundVolume={volume}
        onClick={() => router.get(route('image.gallery'))}
    >
        <img src="/Img/Dashboard/star-folder.png" alt="Star Folder" className="w-16 md:w-20" />
        {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full w-5 h-5 md:w-6 md-h-6 flex items-center justify-center text-xs font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
            </span>
        )}
    </Button>
        <Button
            soundHover="/sounds/button-hover.mp3"
            soundClick="/Music/Sound.mp3"
            soundVolume={volume}
            type="button"
            className="transition hover:scale-110 focus:outline-none relative"
            aria-label="Mail"
            onClick={() => {
                setShowMail(true);
                markAsRead();
            }}
        >
            <img src="/Img/Dashboard/mail.png" alt="Mail" className="w-16 md:w-20 h-12 md:h-14" />
            {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </Button>
        <Button
            className="transition hover:scale-110 focus:outline-none"
            onClick={() => setShowSettings(true)}
            soundHover="/sounds/menu-hover.mp3"
            soundClick="/Music/Sound.mp3"
            soundVolume={volume}
        >
            <img src="/Img/Dashboard/gear.png" alt="Gear" className="w-16 md:w-20" />
        </Button>
    </div>

    {/* Help Button */}
    <div className="absolute left-4 md:left-10 top-5 w-12 h-12 md:w-[50px] md:h-[50px] flex justify-center items-center z-50">
        <Button
            className="transition hover:scale-110 focus:outline-none w-full h-full"
            onClick={() => router.get(route('help'))}
            soundHover="/sounds/menu-hover.mp3"
            soundClick="/Music/Sound.mp3"
            soundVolume={volume}
        >
            <img 
                src="/Img/Dashboard/ques.png" 
                alt="Help" 
                className="w-full h-full object-contain" 
            />
        </Button>
    </div>

                {/* Settings Modal */}
                {showSettings && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                        <div 
                            className="relative bg-gradient-to-b from-[#F9E3B0] to-[#E6C48B] rounded-[40px] px-12 pb-16 pt-5 flex flex-col items-center min-w-[700px] h-auto"
                            style={{ 
                                backgroundImage: isSettingsBgLoaded ? "url('/Img/Dashboard/modalBG.png')" : "none",
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat"
                            }}
                        >
                            {/* Loading Overlay - Only show when image is not loaded */}
                            {!isSettingsBgLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#F9E3B0] to-[#E6C48B] rounded-[40px] z-20">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 border-4 border-[#9A4112] border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-[#9A4112] font-bold">Loading...</p>
                                    </div>
                                </div>
                            )}
                            
                            <div className={`flex flex-col items-center w-full px-[80px] ${!isSettingsBgLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
                                
                                <span className="absolute text-white text-4xl font-black tracking-wide bottom-190">Settings</span>
                                <Button
                                    soundHover="/sounds/button-hover.mp3"
                                    soundClick="/Music/Sound.mp3"
                                    soundVolume={volume}
                                    className="absolute top-7 right-9 rounded-full w-[60px] h-[60px] flex items-center justify-center shadow-lg transition hover:scale-110"
                                    onClick={() => setShowSettings(false)}
                                    aria-label="Close"
                                >
                                   <img src="/Img/Dashboard/X.png" alt="X" className="w-full h-auto" />
                                </Button>
                                {/* Sliders */}
                                <div className="flex flex-col gap-8 mt-20 mb-5 w-full items-center w-[450px]">
                                    {/* Volume Slider */}
                                    <div className="flex items-center gap-6 w-full">
                                        <div className="rounded-full w-16 h-16 flex items-center justify-center shadow-lg" onClick={toggleVolume}>
                                            <img src="/Img/Dashboard/volume.png" alt="Volume" className="w-full h-auto" />
                                        </div>
                                        <div className="flex-1 flex items-center">
                                            <div
                                                ref={volumeRef}
                                                className="w-full h-6 bg-[#B97B4B] rounded-full relative flex items-center cursor-pointer"
                                                onMouseDown={e => {
                                                    const move = (ev: any) => handleSliderDrag(ev, setVolume, volumeRef);
                                                    const up = () => {
                                                        window.removeEventListener("mousemove", move);
                                                        window.removeEventListener("mouseup", up);
                                                        handleSliderChangeEnd();
                                                    };
                                                    window.addEventListener("mousemove", move);
                                                    window.addEventListener("mouseup", up);
                                                    handleSliderDrag(e, setVolume, volumeRef);
                                                }}
                                                onTouchStart={e => {
                                                    const move = (ev: any) => handleSliderDrag(ev, setVolume, volumeRef);
                                                    const end = () => {
                                                        window.removeEventListener("touchmove", move);
                                                        window.removeEventListener("touchend", end);
                                                        handleSliderChangeEnd();
                                                    };
                                                    window.addEventListener("touchmove", move);
                                                    window.addEventListener("touchend", end);
                                                    handleSliderDrag(e, setVolume, volumeRef);
                                                }}
                                            >
                                                <div
                                                    className="absolute left-0 top-0 h-6 bg-gradient-to-r from-[#FFDE8A] to-[#FFB84C] rounded-full border-10 border-[#9A4112]"
                                                    style={{ width: `${volume}%` }}
                                                ></div>
                                                <div
                                                    className="absolute top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
                                                    style={{ left: `calc(${volume}% - 20px)` }}
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-full"
                                                        style={{
                                                            backgroundImage: 'url("/Img/Dashboard/wood-btn.png")',
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            border: 'none',
                                                        }}
                                                    >
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Music Slider */}
                                    <div className="flex items-center gap-6 w-full">
                                        <div className="rounded-full w-16 h-16 flex items-center justify-center shadow-lg" onClick={toggleMusic}>
                                            <img src="/Img/Dashboard/music.png" alt="Music" className="w-full h-[63px]" />
                                        </div>
                                        <div className="flex-1 flex items-center">
                                            <div
                                                ref={musicRef}
                                                className="w-full h-6 bg-[#B97B4B] rounded-full relative flex items-center cursor-pointer"
                                                onMouseDown={e => {
                                                    const move = (ev: any) => handleSliderDrag(ev, setMusic, musicRef);
                                                    const up = () => {
                                                        window.removeEventListener("mousemove", move);
                                                        window.removeEventListener("mouseup", up);
                                                        handleSliderChangeEnd();
                                                    };
                                                    window.addEventListener("mousemove", move);
                                                    window.addEventListener("mouseup", up);
                                                    handleSliderDrag(e, setMusic, musicRef);
                                                }}
                                                onTouchStart={e => {
                                                    const move = (ev: any) => handleSliderDrag(ev, setMusic, musicRef);
                                                    const end = () => {
                                                        window.removeEventListener("touchmove", move);
                                                        window.removeEventListener("touchend", end);
                                                        handleSliderChangeEnd();
                                                    };
                                                    window.addEventListener("touchmove", move);
                                                    window.addEventListener("touchend", end);
                                                    handleSliderDrag(e, setMusic, musicRef);
                                                }}
                                            >
                                                <div
                                                    className="absolute left-0 top-0 h-6 bg-gradient-to-r from-[#FFDE8A] to-[#FFB84C] rounded-full"
                                                    style={{ width: `${music}%` }}
                                                ></div>
                                                <div
                                                    className="absolute top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
                                                    style={{ left: `calc(   ${music}% - 20px)` }}
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-full"
                                                        style={{
                                                            backgroundImage: 'url("/Img/Dashboard/wood-btn.png")',
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            border: 'none',
                                                        }}
                                                    >
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Action Buttons */}
                                <div className="flex gap-10">
                                    <Button className="rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition hover:scale-110 overflow-hidden"
                                    onClick={() => {
                                            setShowSettings(false);
                                            setShowShare(true);
                                        }}
                                        aria-label="Share"
                                        soundHover="/sounds/button-hover.mp3"
                                        soundClick="/Music/Sound.mp3"
                                        soundVolume={volume}
                                    >
                                        <img src="/Img/Dashboard/share.png" alt="Share" className="w-full h-full object-contain" />
                                    </Button>
                                    <Button 
                                        soundHover="/sounds/button-hover.mp3"
                                        soundClick="/Music/Sound.mp3"
                                        soundVolume={volume}
                                        type="button"
                                        className="transition hover:scale-110 focus:outline-none"
                                        aria-label="Profile"
                                        onClick={() => {
                                            setShowAccount(true);
                                            setShowSettings(false);
                                        }}

                                    >
                                        <img src="/Img/Dashboard/profile.png" alt="Profile" className="w-20" />
                                    </Button>
                                    <Button 
                                        soundHover="/sounds/button-hover.mp3"
                                        soundClick="/Music/Sound.mp3"
                                        soundVolume={volume}
                                        className="rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition hover:scale-110 overflow-hidden"
                                        onClick={() => setShowLogoutModal(true)}
                                    >
                                        <img src="/Img/Dashboard/logout.png" alt="Logout" className="w-full h-full object-contain" />
                                    </Button>

                                    {/* Logout Modal */}
                                    <LogoutModal
                                        isOpen={showLogoutModal}
                                        onClose={() => setShowLogoutModal(false)}
                                        onConfirm={() => router.post(route('logout'))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                </div>
                {showAccount && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                        <div 
                            className="relative bg-gradient-to-b from-[#F9E3B0] to-[#E6C48B] rounded-[40px] px-12 py-10 flex flex-col items-center min-w-[700px]"
                            style={{ 
                                backgroundImage: isAccountBgLoaded ? "url('/Img/Dashboard/modalBG.png')" : "none",
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat"
                            }}
                        >
                            {/* Loading Overlay - Only show when image is not loaded */}
                            {!isAccountBgLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#F9E3B0] to-[#E6C48B] rounded-[40px] z-20">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 border-4 border-[#9A4112] border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-[#9A4112] font-bold">Loading...</p>
                                    </div>
                                </div>
                            )}
                            
                            <div className={`flex flex-col items-center w-full ${!isAccountBgLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
                              <span className="absolute text-white text-4xl font-black tracking-wide top-12s">Account</span>
                                
                                {/* Close Button */}
                                <Button
                                    soundHover="/sounds/button-hover.mp3"
                                    soundClick="/Music/Sound.mp3"
                                    soundVolume={volume}
                                    className="absolute top-19 right-12 rounded-full w-[60px] h-[60px] flex items-center justify-center shadow-lg transition hover:scale-110"
                                    onClick={() => setShowAccount(false)}
                                    aria-label="Close"
                                >
                                    <img src="/Img/Dashboard/X.png" alt="X" className="w-full h-auto" />
                                </Button>

                                <div className="w-full max-w-md mt-16 mb-8 flex flex-row items-start justify-center gap-[10px]">
                                    {/* Nav Button */}

                                    <div className="flex flex-col gap-4 p-5">
                                        <Button 
                                            soundHover="/sounds/button-hover.mp3"
                                            soundClick="/Music/Sound.mp3"
                                            soundVolume={volume}
                                            className={`box-border flex items-center px-[11px] py-[4px] gap-[8px] border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] w-[150px] ${
                                                showGeneral 
                                                    ? 'bg-[#9A4112] text-white' 
                                                    : 'bg-[#F8E193] text-[#282725]'
                                            }`}
                                            onClick={() => setShowGeneral(true)}
                                        >
                                            General
                                        </Button>
                                        <Button 
                                            soundHover="/sounds/button-hover.mp3"
                                            soundClick="/Music/Sound.mp3"
                                            soundVolume={volume}
                                            className={`box-border flex items-center px-[11px] py-[4px] gap-[8px] border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] w-[150px] ${
                                                !showGeneral 
                                                    ? 'bg-[#9A4112] text-white' 
                                                    : 'bg-[#F8E193] text-[#282725]'
                                            }`}
                                            onClick={() => setShowGeneral(false)}
                                        >
                                            Password
                                        </Button>
                                    </div>
                                    {/* Password Form */}
                                    {!showGeneral ? (
                                        <form onSubmit={updatePassword} className="w-full pl-[50px] border-l-[1px] border-[#88643D]">
                                            <h3 className="text-[#000] text-3xl font-semibold mb-2">Password</h3>
                                            <div className="flex flex-col items-end">
                                                <div>
                                                <div>
                                                    <div className="mb-4">
                                                    <label className="block text-[#3D2410] text-[15px] font-extrabold">Previous Password</label>
                                                    <input
                                                        type="password"
                                                        name="current_password"
                                                        ref={currentPasswordInput}
                                                        value={data.current_password}
                                                        onChange={(e) => setData('current_password', e.target.value)}
                                                        className="w-[300px] px-4 py-3 bg-white/80 border-2 border-[#000] text-[#3D2410] text-[10px] focus:outline-none focus:ring-2 focus:ring-[#FFB84C] h-[35px]"
                                                        placeholder="Input Previous Password"
                                                    />
                                                    {errors.current_password && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.current_password}</p>
                                                    )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="mb-4">
                                                    <label className="block text-[#3D2410] text-[15px] font-extrabold">New Password</label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        ref={passwordInput}
                                                        value={data.password}
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        className="w-full px-4 py-3 bg-white/80 border-2 border-[#000] text-[#3D2410] text-[10px] focus:outline-none focus:ring-2 focus:ring-[#FFB84C] h-[35px]"
                                                        placeholder="Input New Password"
                                                    />
                                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                                    </div>

                                                    <div className="mb-4">
                                                    <label className="block text-[#3D2410] text-[15px] font-extrabold">Confirm Password</label>
                                                    <input
                                                        type="password"
                                                        name="password_confirmation"
                                                        value={data.password_confirmation}
                                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                                        className="w-full px-4 py-3 bg-white/80 border-2 border-[#000] text-[#3D2410] text-[10px] focus:outline-none focus:ring-2 focus:ring-[#FFB84C] h-[35px]"
                                                        placeholder="Confirm Password"
                                                    />
                                                    {errors.password_confirmation && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>
                                                    )}
                                                    </div>
                                                </div>
                                                </div>

                                                <Button
                                                soundHover="/sounds/button-hover.mp3"
                                                soundClick="/Music/Sound.mp3"
                                                soundVolume={volume}
                                                type="submit"
                                                disabled={processing}
                                                className="w-[100px] h-[30px] flex items-center px-4 py-2 bg-[#9A4112] text-[#000] text-[10px] font-extrabold border-[2px] border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105"
                                                >
                                                Save Changes
                                                </Button>
                                            </div>
                                        </form>
                                    ) :
                                    (
                                        <form onSubmit={submitProfileUpdate} className="w-full pl-[50px] border-l-[1px] border-[#88643D]">
                                            <h3 className="text-[#000] text-3xl font-semibold mb-2">General</h3>

                                            <div
                                                className="relative h-20 w-auto flex justify-center items-center text-white font-extrabold"
                                                style={{
                                                    backgroundImage: "url('/Img/Dashboard/name.png')",
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat',
                                                }}
                                            >
                                                <h1 className="text-center text-[20px]">{data.name}</h1>
                                            </div>

                                            <div className="flex flex-col items-end">
                                                <div>
                                                    <div>
                                                        <div className="mb-4">
                                                            <label className="block text-[#3D2410] text-[15px] font-extrabold">Username</label>
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                value={data.name}
                                                                onChange={(e) => setData('name', e.target.value)}
                                                                className="w-[300px] px-4 py-3 bg-white/80 border-2 border-[#000] text-[#3D2410] text-[10px] focus:outline-none focus:ring-2 focus:ring-[#FFB84C] h-[35px]"
                                                                placeholder="Input Username"
                                                            />
                                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="mb-4">
                                                            <label className="block text-[#3D2410] text-[15px] font-extrabold">Email Address</label>
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                value={data.email}
                                                                onChange={(e) => setData('email', e.target.value)}
                                                                className="w-full px-4 py-3 bg-white/80 border-2 border-[#000] text-[#3D2410] text-[10px] focus:outline-none focus:ring-2 focus:ring-[#FFB84C] h-[35px]"
                                                                placeholder="Input Email Address"
                                                            />
                                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-row gap-4">
                                                    <Button
                                                        soundHover="/sounds/button-hover.mp3"
                                                        soundClick="/Music/Sound.mp3"
                                                        soundVolume={volume}
                                                        type="button"
                                                        className="w-auto h-[30px] flex items-center px-4 py-2 bg-[#9A4112] text-[#000] text-[10px] font-extrabold border-[2px] border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105"
                                                        onClick={() => setShowDeleteModal(true)}
                                                    >
                                                        Delete Account
                                                    </Button>

                                                    <Button
                                                        soundHover="/sounds/button-hover.mp3"
                                                        soundClick="/Music/Sound.mp3"
                                                        soundVolume={volume}
                                                        type="submit"
                                                        disabled={processing}
                                                        className="w-auto h-[30px] flex items-center px-4 py-2 bg-[#9A4112] text-[#000] text-[10px] font-extrabold border-[2px] border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105"
                                                    >
                                                        Save Changes
                                                    </Button>
                                                </div>

                                                {recentlySuccessful && (
                                                    <p className="text-green-600 text-xs mt-2">Changes saved successfully.</p>
                                                )}
                                            </div>
                                        </form>
                                    )}
                                    <LogoutModal
                                        isOpen={showLogoutModal}
                                        onClose={() => setShowLogoutModal(false)}
                                        onConfirm={() => router.post(route('logout'))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                     <ShareModal 
                isOpen={showShare} 
                onClose={() => setShowShare(false)} 
            />
            <Delete
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onSuccess={() => {
                    setShowDeleteModal(false);
                    setShowAccount(false);
                }}
            />
            <MailModal 
                isOpen={showMail} 
                onClose={() => setShowMail(false)}
                notifications={initialNotifications as any}
            />
    </StudentLayout>
);
}