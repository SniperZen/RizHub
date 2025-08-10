import React, { useState, useRef, useEffect } from "react";
import { router } from '@inertiajs/react';
import StudentLayout from "../../Layouts/StudentLayout";
import Button from '@/Components/Button';
import { useForm, usePage } from '@inertiajs/react';
import Delete from '../../../js/Pages/Dashboard/Partial/Delete';
import LogoutModal from '../../../js/Pages/Dashboard/Partial/LogoutModal';
import ShareModal from '../../../js/Pages/Dashboard/Partial/ShareModal';
import { PageProps } from '@/types';

interface DashboardProps {
    music: number;
    sound: number;
    name : string;
}

export default function Dashboard({ music: initialMusic, sound: initialSound, name: initialName }: DashboardProps) {


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
        patch(route('profile.update'));
    };


    return (
        <StudentLayout>
            <div className="min-h-screen w-full flex">
                <img
                    src="/Img/Dashboard/BG.png"
                    alt="Noli Me Tangere BG"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="w-1/2 h-screen relative flex flex-col">
                    <div className="absolute inset-0 z-10" />
                    <div className="relative z-20 flex items-center mt-8 ml-8">
                        <img src="/Img/LandingPage/Title.png" alt="RizHub Logo" className="h-[70px] w-auto" />
                    </div>
                </div>
                <div className="w-1/2 h-screen flex flex-col items-center justify-center relative">
                    {/* <div className="absolute top-16 right-16 text-right">
                        <div className="font-noli text-5xl text-[#3D2410] font-bold leading-none drop-shadow" style={{ textShadow: "2px 2px 0 #FA7C4C" }}>
                            Noli Me Tangere
                        </div>
                        <div className="font-challenge text-3xl text-[#3D2410] font-bold tracking-widest mt-2 ml-16">challenge</div>
                    </div> */}
                    <div className="flex flex-col items-center gap-10 mt-40">
                        <Button
                            className="w-[350px] h-[100px] py-5 rounded-[50px] bg-gradient-to-b from-[#FF6A00] to-[#D5703A] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-4xl font-black relative transition hover:scale-105"
                            soundHover="/sounds/button-hover.mp3"
                            soundClick="/Music/Sound.mp3"
                            soundVolume={volume}
                            onClick={() => router.get(route('challenge'))}
                            >
                            Play
                            <span className="absolute top-3 right-8 w-6 h-6 bg-white/80 rounded-full"></span>
                            <span className="absolute top-7 right-16 w-3 h-3 bg-white/60 rounded-full"></span>
                        </Button>
                        <Button
                            className="w-[250px] py-5 rounded-[40px] bg-gradient-to-b from-[#FF7E47] to-[#B26D42] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-4xl font-extrabold relative transition hover:scale-105"
                            onClick={() => router.post(route('student.exit'))}
                            soundHover="/sounds/button-hover.mp3"
                            soundClick="/Music/Sound.mp3"
                            soundVolume={volume}
                            >
                            Exit
                            <span className="absolute top-3 right-8 w-6 h-6 bg-white/80 rounded-full"></span>
                            <span className="absolute top-7 right-16 w-3 h-3 bg-white/60 rounded-full"></span>
                        </Button>
                    </div>
                    <div className="absolute bottom-16 flex gap-20 justify-center items-center">
                        <button
                            type="button"
                            className="transition hover:scale-110 focus:outline-none"
                            aria-label="Star Folder"
                        >
                            <img src="/Img/Dashboard/star-folder.png" alt="Star Folder" className="w-20" />
                        </button>
                        <button
                            type="button"
                            className="transition hover:scale-110 focus:outline-none"
                            aria-label="Mail"
                        >
                            <img src="/Img/Dashboard/mail.png" alt="Mail" className="w-20 h-14" />
                        </button>
                        <Button
                            className="transition hover:scale-110 focus:outline-none"
                            onClick={() => setShowSettings(true)}
                            soundHover="/sounds/menu-hover.mp3"
                            soundClick="/Music/Sound.mp3"
                            soundVolume={volume}
                            >
                            <img src="/Img/Dashboard/gear.png" alt="Gear" className="w-20" />
                        </Button>
                    </div>

                    {/* Settings Modal */}
                    {showSettings && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                            <div 
                                className="relative bg-gradient-to-b from-[#F9E3B0] to-[#E6C48B] rounded-[40px] px-12 pb-16 pt-5 flex flex-col items-center min-w-[700px] h-auto"
                                style={{ 
                                    backgroundImage: "url('/Img/Dashboard/modalBG.png')",
                                    backgroundSize: "contain",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat"
                                }}
                            >
                                <div className="flex flex-col items-center w-full px-[80px]">
                                    
                                    <span className="absolute text-white text-4xl font-black tracking-wide bottom-190">Settings</span>
                                    <button
                                        className="absolute top-7 right-9 rounded-full w-[60px] h-[60px] flex items-center justify-center shadow-lg transition hover:scale-110"
                                        onClick={() => setShowSettings(false)}
                                        aria-label="Close"
                                    >
                                       <img src="/Img/Dashboard/X.png" alt="X" className="w-full h-auto" />
                                    </button>
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
                                        <button className="rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition hover:scale-110 overflow-hidden"
                                        onClick={() => {
                                                setShowSettings(false);
                                                setShowShare(true);
                                            }}
                                            aria-label="Share"

                                        >
                                            <img src="/Img/Dashboard/share.png" alt="Share" className="w-full h-full object-contain" />
                                        </button>
                                        <button 
                                            type="button"
                                            className="transition hover:scale-110 focus:outline-none"
                                            aria-label="Profile"
                                            onClick={() => {
                                                setShowAccount(true);
                                                setShowSettings(false);
                                            }}

                                        >
                                            <img src="/Img/Dashboard/profile.png" alt="Profile" className="w-20" />
                                        </button>
                                        <button className="rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition hover:scale-110 overflow-hidden"
                                        onClick={() => {
                                            setShowSettings(false);
                                            setShowLogoutModal(true);
                                        }}

                                        >
                                            <img src="/Img/Dashboard/logout.png" alt="Logout" className="w-full h-full object-contain" />
                                        </button>
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
                                backgroundImage: "url('/Img/Dashboard/modalBG.png')",
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat"
                            }}
                        >
                            <div className="flex flex-col items-center w-full">
                              <span className="absolute text-white text-4xl font-black tracking-wide bottom-190">Account</span>
                                
                                {/* Close Button */}
                                <button
                                    className="absolute top-7 right-9 rounded-full w-[60px] h-[60px] flex items-center justify-center shadow-lg transition hover:scale-110"
                                    onClick={() => setShowAccount(false)}
                                    aria-label="Close"
                                >
                                    <img src="/Img/Dashboard/X.png" alt="X" className="w-full h-auto" />
                                </button>

                                <div className="w-full max-w-md mt-16 mb-8 flex flex-row items-start justify-center gap-[10px]">
                                    {/* Nav Button */}

                                    <div className="flex flex-col gap-4 p-5">
                                        <button 
                                            className={`box-border flex items-center px-[11px] py-[4px] gap-[8px] border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] w-[150px] ${
                                                showGeneral 
                                                    ? 'bg-[#9A4112] text-white' 
                                                    : 'bg-[#F8E193] text-[#282725]'
                                            }`}
                                            onClick={() => setShowGeneral(true)}
                                        >
                                            General
                                        </button>
                                        <button 
                                            className={`box-border flex items-center px-[11px] py-[4px] gap-[8px] border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] w-[150px] ${
                                                !showGeneral 
                                                    ? 'bg-[#9A4112] text-white' 
                                                    : 'bg-[#F8E193] text-[#282725]'
                                            }`}
                                            onClick={() => setShowGeneral(false)}
                                        >
                                            Password
                                        </button>
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

                                                <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-[100px] h-[30px] flex items-center px-4 py-2 bg-[#9A4112] text-[#000] text-[10px] font-extrabold border-[2px] border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105"
                                                >
                                                Save Changes
                                                </button>
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
                                                <h1 className="text-center">{data.name}</h1>
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
                                                    <button
                                                        type="button"
                                                        className="w-auto h-[30px] flex items-center px-4 py-2 bg-[#9A4112] text-[#000] text-[10px] font-extrabold border-[2px] border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105"
                                                        onClick={() => setShowDeleteModal(true)}
                                                    >
                                                        Delete Account
                                                    </button>

                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="w-auto h-[30px] flex items-center px-4 py-2 bg-[#9A4112] text-[#000] text-[10px] font-extrabold border-[2px] border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105"
                                                    >
                                                        Save Changes
                                                    </button>
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
            </div>
        </StudentLayout>
    );
}