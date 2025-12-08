import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  initialMusic: number;
  initialSound: number;
  onMusicChange: (volume: number) => void;
  onSoundChange: (volume: number) => void;
  onVolumeSettingsChange: (music: number, sound: number) => void;
}

const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onHome,
  initialMusic,
  initialSound,
  onMusicChange,
  onSoundChange,
  onVolumeSettingsChange,
}) => {
  const [musicVolume, setMusicVolume] = useState(initialMusic);
  const [soundVolume, setSoundVolume] = useState(initialSound);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  
  const musicRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<HTMLDivElement>(null);
  
  // Store previous volumes for unmuting
  const prevMusicVolume = useRef(initialMusic);
  const prevSoundVolume = useRef(initialSound);

  // Debounce timer for saving settings
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMusicVolume(initialMusic);
    setSoundVolume(initialSound);
  }, [initialMusic, initialSound]);

  // Function to save settings to backend with debouncing
  const saveSettingsToBackend = (music: number, sound: number) => {
    // Clear any existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    
    // Set new timer to save settings after 500ms of inactivity
    saveTimerRef.current = setTimeout(() => {
      router.post(route('student.saveSettings'), { 
        music, 
        sound 
      }, {
        preserveScroll: true,
        onSuccess: () => {
          console.log("Settings saved successfully");
        },
        onError: () => {
          console.error("Failed to save settings");
        }
      });
    }, 500);
  };

  const handleSliderDrag = (e: any, setVolume: (value: number) => void, ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    let position: number;
    
    if (e.type.includes("touch")) {
      position = e.touches[0].clientX - rect.left;
    } else {
      position = e.clientX - rect.left;
    }
    
    // Calculate percentage (0-100)
    let percentage = (position / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage)); // Clamp between 0-100
    
    const newVolume = Math.round(percentage);
    setVolume(newVolume);
    
    // Update parent component if needed
    if (setVolume === setMusicVolume) {
      onMusicChange(newVolume);
      if (newVolume > 0) {
        setIsMusicMuted(false);
        prevMusicVolume.current = newVolume;
      }
      // Save to backend and update parent
      onVolumeSettingsChange(newVolume, soundVolume);
      saveSettingsToBackend(newVolume, soundVolume);
    } else {
      onSoundChange(newVolume);
      if (newVolume > 0) {
        setIsSoundMuted(false);
        prevSoundVolume.current = newVolume;
      }
      // Save to backend and update parent
      onVolumeSettingsChange(musicVolume, newVolume);
      saveSettingsToBackend(musicVolume, newVolume);
    }
  };

  const toggleMusic = () => {
    if (isMusicMuted) {
      // Unmute - restore previous volume
      const newVolume = prevMusicVolume.current;
      setMusicVolume(newVolume);
      onMusicChange(newVolume);
      setIsMusicMuted(false);
      // Save to backend and update parent
      onVolumeSettingsChange(newVolume, soundVolume);
      saveSettingsToBackend(newVolume, soundVolume);
    } else {
      // Mute - store current volume and set to 0
      prevMusicVolume.current = musicVolume;
      setMusicVolume(0);
      onMusicChange(0);
      setIsMusicMuted(true);
      // Save to backend and update parent
      onVolumeSettingsChange(0, soundVolume);
      saveSettingsToBackend(0, soundVolume);
    }
  };

  const toggleSound = () => {
    if (isSoundMuted) {
      // Unmute - restore previous volume
      const newVolume = prevSoundVolume.current;
      setSoundVolume(newVolume);
      onSoundChange(newVolume);
      setIsSoundMuted(false);
      // Save to backend and update parent
      onVolumeSettingsChange(musicVolume, newVolume);
      saveSettingsToBackend(musicVolume, newVolume);
    } else {
      // Mute - store current volume and set to 0
      prevSoundVolume.current = soundVolume;
      setSoundVolume(0);
      onSoundChange(0);
      setIsSoundMuted(true);
      // Save to backend and update parent
      onVolumeSettingsChange(musicVolume, 0);
      saveSettingsToBackend(musicVolume, 0);
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="relative w-[700px] h-[600px] flex items-center justify-center p-16">
        {/* Wooden Frame Background */}
        <img
          src="/Img/Challenge/GuessWord/wooden_frame.png"
          alt="Wooden Frame"
          className="absolute inset-0 w-full h-full object-contain"
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 gap-4">
          {/* Title */}
          <h2 className="text-4xl font-bold text-amber-200 text-shadow-md shadow-amber-900 absolute top-4">
            GAME PAUSED
          </h2>
          
          {/* Audio Controls */}
          <div className="flex flex-col gap-8 mt-[160px] mb-5 w-full items-center">
            {/* Music Slider */}
            <div className="flex items-center gap-6 w-full">
              <div 
                className="rounded-full w-16 h-16 flex items-center justify-center shadow-lg cursor-pointer" 
                onClick={toggleMusic}
              >
                <img 
                  src={isMusicMuted ? "/Img/Dashboard/music-muted.png" : "/Img/Dashboard/music.png"} 
                  alt="Music" 
                  className="w-full h-[63px]" 
                />
              </div>
              <div className="flex-1 flex items-center">
                <div
                  ref={musicRef}
                  className="w-full h-6 bg-[#B97B4B] rounded-full relative flex items-center cursor-pointer"
                  onMouseDown={e => {
                    const move = (ev: any) => handleSliderDrag(ev, setMusicVolume, musicRef);
                    const up = () => {
                      window.removeEventListener("mousemove", move);
                      window.removeEventListener("mouseup", up);
                    };
                    window.addEventListener("mousemove", move);
                    window.addEventListener("mouseup", up);
                    handleSliderDrag(e, setMusicVolume, musicRef);
                  }}
                  onTouchStart={e => {
                    const move = (ev: any) => handleSliderDrag(ev, setMusicVolume, musicRef);
                    const end = () => {
                      window.removeEventListener("touchmove", move);
                      window.removeEventListener("touchend", end);
                    };
                    window.addEventListener("touchmove", move);
                    window.addEventListener("touchend", end);
                    handleSliderDrag(e, setMusicVolume, musicRef);
                  }}
                >
                  <div
                    className="absolute left-0 top-0 h-6 bg-gradient-to-r from-[#FFDE8A] to-[#FFB84C] rounded-full"
                    style={{ width: `${musicVolume}%` }}
                  ></div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
                    style={{ left: `calc(${musicVolume}% - 20px)` }}
                  >
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{
                        backgroundImage: 'url("/Img/Dashboard/wood-btn.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: 'none',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sound Slider */}
            <div className="flex items-center gap-6 w-full">
              <div 
                className="rounded-full w-16 h-16 flex items-center justify-center shadow-lg cursor-pointer" 
                onClick={toggleSound}
              >
                <img 
                  src={isSoundMuted ? "/Img/Dashboard/volume-muted.png" : "/Img/Dashboard/volume.png"} 
                  alt="Volume" 
                  className="w-full h-auto" 
                />
              </div>
              <div className="flex-1 flex items-center">
                <div
                  ref={soundRef}
                  className="w-full h-6 bg-[#B97B4B] rounded-full relative flex items-center cursor-pointer"
                  onMouseDown={e => {
                    const move = (ev: any) => handleSliderDrag(ev, setSoundVolume, soundRef);
                    const up = () => {
                      window.removeEventListener("mousemove", move);
                      window.removeEventListener("mouseup", up);
                    };
                    window.addEventListener("mousemove", move);
                    window.addEventListener("mouseup", up);
                    handleSliderDrag(e, setSoundVolume, soundRef);
                  }}
                  onTouchStart={e => {
                    const move = (ev: any) => handleSliderDrag(ev, setSoundVolume, soundRef);
                    const end = () => {
                      window.removeEventListener("touchmove", move);
                      window.removeEventListener("touchend", end);
                    };
                    window.addEventListener("touchmove", move);
                    window.addEventListener("touchend", end);
                    handleSliderDrag(e, setSoundVolume, soundRef);
                  }}
                >
                  <div
                    className="absolute left-0 top-0 h-6 bg-gradient-to-r from-[#FFDE8A] to-[#FFB84C] rounded-full border-10 border-[#9A4112]"
                    style={{ width: `${soundVolume}%` }}
                  ></div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
                    style={{ left: `calc(${soundVolume}% - 20px)` }}
                  >
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{
                        backgroundImage: 'url("/Img/Dashboard/wood-btn.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: 'none',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-6 mt-24">
            {/* Home Button */}
            <button
              onClick={onHome}
              className="flex flex-col items-center group"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                <img src="/Img/Challenge/GuessWord/home.png" alt="Home" className="w-[60px] h-[60px]" />
              </div>
              <span className="mt-2 text-amber-200 font-semibold">Home</span>
            </button>
            
            {/* Resume Button */}
            <button
              onClick={onResume}
              className="flex flex-col items-center group"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-green-800 rounded-full border-4 border-green-600 group-hover:scale-110 transition-transform">
                <svg 
                  className="w-8 h-8 text-green-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="mt-2 text-green-200 font-semibold">Resume</span>
            </button>
            
            {/* Restart Button */}
            <button
              onClick={onRestart}
              className="flex flex-col items-center group"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                <img src="/Img/Challenge/GuessWord/restart.png" alt="Restart" className="w-[60px] h-[60px]" />
              </div>
              <span className="mt-2 text-red-200 font-semibold">Restart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PauseModal;