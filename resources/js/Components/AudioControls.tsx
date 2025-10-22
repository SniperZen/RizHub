import React, { useState, useCallback, useRef, useEffect } from "react";
import { router, Link } from "@inertiajs/react";

interface AudioControlsProps {
  initialMusic: number;
  initialSound: number;
  onSettingsChange?: (music: number, sound: number) => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  initialMusic,
  initialSound,
  onSettingsChange
}) => {
  const [musicVolume, setMusicVolume] = useState(initialMusic ?? 50);
  const [soundVolume, setSoundVolume] = useState(initialSound ?? 70);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [hoveredControl, setHoveredControl] = useState<"music" | "sound" | null>(null);
  
  // Store previous volumes for unmuting
  const previousMusicVolume = useRef(musicVolume);
  const previousSoundVolume = useRef(soundVolume);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize mute states based on initial values
  useEffect(() => {
    setIsMusicMuted(initialMusic === 0);
    setIsSoundMuted(initialSound === 0);
  }, [initialMusic, initialSound]);

  const saveAudioSettings = useCallback(() => {
    const musicValue = isMusicMuted ? 0 : musicVolume;
    const soundValue = isSoundMuted ? 0 : soundVolume;
    
    router.post(route("student.saveAudioSettings"), { 
      music: musicValue,
      sound: soundValue
    });
    
    if (onSettingsChange) {
      onSettingsChange(musicValue, soundValue);
    }
  }, [musicVolume, soundVolume, isMusicMuted, isSoundMuted, onSettingsChange]);

  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveAudioSettings();
    }, 1000);
  }, [saveAudioSettings]);

  const toggleMusic = () => {
    if (isMusicMuted) {
      // Unmute - restore to previous volume or default
      setIsMusicMuted(false);
      setMusicVolume(previousMusicVolume.current > 0 ? previousMusicVolume.current : 50);
    } else {
      // Mute - store current volume and set to 0
      previousMusicVolume.current = musicVolume;
      setIsMusicMuted(true);
      setMusicVolume(0);
    }
    
    debouncedSave();
  };

  const toggleSound = () => {
    if (isSoundMuted) {
      // Unmute - restore to previous volume or default
      setIsSoundMuted(false);
      setSoundVolume(previousSoundVolume.current > 0 ? previousSoundVolume.current : 70);
    } else {
      // Mute - store current volume and set to 0
      previousSoundVolume.current = soundVolume;
      setIsSoundMuted(true);
      setSoundVolume(0);
    }
    
    debouncedSave();
  };

  const adjustMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    
    // Update the previous volume reference if not muted
    if (!isMusicMuted) {
      previousMusicVolume.current = value;
    }
    
    setMusicVolume(value);
    
    // If adjusting volume while muted, automatically unmute
    if (value > 0 && isMusicMuted) {
      setIsMusicMuted(false);
    }
    
    debouncedSave();
  };

  const adjustSound = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    
    // Update the previous volume reference if not muted
    if (!isSoundMuted) {
      previousSoundVolume.current = value;
    }
    
    setSoundVolume(value);
    
    // If adjusting volume while muted, automatically unmute
    if (value > 0 && isSoundMuted) {
      setIsSoundMuted(false);
    }
    
    debouncedSave();
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Music Control */}
      <div
        className="relative group"
        onMouseEnter={() => setHoveredControl("music")}
        onMouseLeave={() => setHoveredControl(null)}
      >
        <button
          onClick={toggleMusic}
          className="relative w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
          title={isMusicMuted ? "Unmute music" : "Mute music"}
        >
          <img src="/Img/Dashboard/music.png" alt="Music" className="w-full h-auto" />
          {isMusicMuted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-1 bg-red-500 rotate-45 rounded-full"></div>
            </div>
          )}
        </button>

        {/* Hover Panel */}
        <div
          className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-3 
          bg-gradient-to-b from-[#2a1d12]/95 to-[#1b120a]/95 border border-[#f5a623]/40 
          rounded-2xl p-4 shadow-[0_0_20px_rgba(255,140,0,0.4)] z-50 
          min-w-[90px] transition-all duration-300 ${
            hoveredControl === "music"
              ? "opacity-100 visible scale-100"
              : "opacity-0 invisible scale-95"
          }`}
        >
          <div className="flex flex-col items-center space-y-3 text-amber-200">
            <div className="text-xs font-bold tracking-wide">Music</div>
            <div className="text-xs text-amber-300">
              {isMusicMuted ? "Muted" : `${musicVolume}%`}
            </div>

            {/* Clickable Vertical Slider */}
            <div
              className="relative w-4 h-32 bg-[#3b2c1a]/80 rounded-full border border-[#f5a623]/30 cursor-pointer select-none"
              onMouseDown={(e) => {
                const slider = e.currentTarget;
                const rect = slider.getBoundingClientRect();

                const updateVolume = (clientY: number) => {
                  const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
                  const newValue = 100 - Math.round((y / rect.height) * 100);
                  setMusicVolume(newValue);
                  if (newValue > 0 && isMusicMuted) setIsMusicMuted(false);
                };

                // Start drag immediately
                updateVolume(e.clientY);

                const handleMouseMove = (moveEvent: MouseEvent) => {
                  updateVolume(moveEvent.clientY);
                };

                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                  debouncedSave();
                };

                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              }}
            >
              <div
                className="absolute bottom-0 w-full bg-gradient-to-t from-amber-500 to-yellow-400 rounded-full shadow-[0_0_8px_rgba(255,200,0,0.6)] transition-[height] duration-100 ease-linear"
                style={{ height: `${musicVolume}%` }}
              ></div>
              <div
                className="absolute left-1/2 w-4 h-4 bg-gradient-to-b from-yellow-400 to-orange-600 rounded-full border border-amber-300 shadow-[0_0_8px_rgba(255,180,0,0.8)] transform -translate-x-1/2 transition-[bottom] duration-100 ease-linear"
                style={{ bottom: `calc(${musicVolume}% - 8px)` }}
              ></div>
            </div>

            {/* Mute Button */}
            <button
              onClick={toggleMusic}
              className="w-8 h-8 flex items-center justify-center bg-gradient-to-b from-[#3a2b19] to-[#1f150d] border border-amber-400/40 rounded-full hover:shadow-[0_0_10px_rgba(255,180,0,0.6)] transition-all duration-200"
            >
              {isMusicMuted ? (
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1..."
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1..."
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sound Control */}
      <div
      className="relative group"
      onMouseEnter={() => setHoveredControl("sound")}
      onMouseLeave={() => setHoveredControl(null)}
    >
      <button
        onClick={toggleSound}
        className="relative w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
        title={isSoundMuted ? "Unmute sound" : "Mute sound"}
      >
        <img src="/Img/Dashboard/volume.png" alt="Volume" className="w-full h-auto" />
        {isSoundMuted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-1 bg-red-500 rotate-45 rounded-full"></div>
          </div>
        )}
      </button>

      {/* Hover Panel */}
      <div
        className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-3 
        bg-gradient-to-b from-[#122a1d]/95 to-[#0a1b12]/95 border border-[#2ff56a]/40 
        rounded-2xl p-4 shadow-[0_0_20px_rgba(0,255,150,0.3)] z-50 
        min-w-[90px] transition-all duration-300 ${
          hoveredControl === "sound"
            ? "opacity-100 visible scale-100"
            : "opacity-0 invisible scale-95"
        }`}
      >
        <div className="flex flex-col items-center space-y-3 text-green-200">
          <div className="text-xs font-bold tracking-wide">Sound</div>
          <div className="text-xs text-green-300">
            {isSoundMuted ? "Muted" : `${soundVolume}%`}
          </div>

          {/* Clickable Vertical Slider */}
          <div
            className="relative w-4 h-32 bg-[#1a3b2c]/80 rounded-full border border-[#2ff56a]/30 cursor-pointer select-none"
            onMouseDown={(e) => {
              const slider = e.currentTarget;
              const rect = slider.getBoundingClientRect();

              const updateVolume = (clientY: number) => {
                const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
                const newValue = 100 - Math.round((y / rect.height) * 100);
                setSoundVolume(newValue);
                if (newValue > 0 && isSoundMuted) setIsSoundMuted(false);
              };

              // Start dragging immediately
              updateVolume(e.clientY);

              const handleMouseMove = (moveEvent: MouseEvent) => {
                updateVolume(moveEvent.clientY);
              };

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                debouncedSave();
              };

              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }}
          >
            <div
              className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-emerald-300 rounded-full shadow-[0_0_8px_rgba(0,255,150,0.6)] transition-[height] duration-100 ease-linear"
              style={{ height: `${soundVolume}%` }}
            ></div>
            <div
              className="absolute left-1/2 w-4 h-4 bg-gradient-to-b from-emerald-400 to-green-600 rounded-full border border-green-300 shadow-[0_0_8px_rgba(0,255,150,0.8)] transform -translate-x-1/2 transition-[bottom] duration-100 ease-linear"
              style={{ bottom: `calc(${soundVolume}% - 8px)` }}
            ></div>
          </div>

          {/* Mute Button */}
          <button
            onClick={toggleSound}
            className="w-8 h-8 flex items-center justify-center bg-gradient-to-b from-[#1a3b2c] to-[#0d1f14] border border-green-400/40 rounded-full hover:shadow-[0_0_10px_rgba(0,255,150,0.6)] transition-all duration-200"
          >
            {isSoundMuted ? (
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1..."
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1..."
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>

      {/* Back Button */}
      <Link 
        href={route("dashboard")} 
        className="w-12 h-12 flex items-center justify-center hover:scale-105 transition-transform duration-300"
        title="Back to Dashboard"
      >
        <img 
          src="/Img/Dashboard/back.png" 
          alt="Back" 
          className="w-full h-auto" 
        />
      </Link>
    </div>
  );
};

export default AudioControls;