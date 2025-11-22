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

  const saveAudioSettings = useCallback((immediate: boolean = false) => {
    const musicValue = isMusicMuted ? 0 : musicVolume;
    const soundValue = isSoundMuted ? 0 : soundVolume;
    
    // Immediate UI feedback
    if (onSettingsChange) {
      onSettingsChange(musicValue, soundValue);
    }
    
    // Clear any pending saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    if (immediate) {
      // Save immediately for important actions
      router.post(route("student.saveAudioSettings"), { 
        music: musicValue,
        sound: soundValue
      });
    } else {
      // Debounced save for frequent updates (shorter delay)
      saveTimeoutRef.current = setTimeout(() => {
        router.post(route("student.saveAudioSettings"), { 
          music: musicValue,
          sound: soundValue
        });
      }, 300);
    }
  }, [musicVolume, soundVolume, isMusicMuted, isSoundMuted, onSettingsChange]);

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
    
    // Save immediately for mute/unmute actions
    saveAudioSettings(true);
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
    
    // Save immediately for mute/unmute actions
    saveAudioSettings(true);
  };

  // Handle volume adjustment with immediate UI feedback
  const handleMusicVolumeChange = (newValue: number) => {
    // Update the previous volume reference if not muted
    if (!isMusicMuted) {
      previousMusicVolume.current = newValue;
    }
    
    setMusicVolume(newValue);
    
    // If adjusting volume while muted, automatically unmute
    if (newValue > 0 && isMusicMuted) {
      setIsMusicMuted(false);
    }
    
    // Provide immediate UI/audio feedback
    if (onSettingsChange) {
      const musicValue = isMusicMuted ? 0 : newValue;
      const soundValue = isSoundMuted ? 0 : soundVolume;
      onSettingsChange(musicValue, soundValue);
    }
    
    // Debounced server save (shorter delay)
    saveAudioSettings(false);
  };

  const handleSoundVolumeChange = (newValue: number) => {
    // Update the previous volume reference if not muted
    if (!isSoundMuted) {
      previousSoundVolume.current = newValue;
    }
    
    setSoundVolume(newValue);
    
    // If adjusting volume while muted, automatically unmute
    if (newValue > 0 && isSoundMuted) {
      setIsSoundMuted(false);
    }
    
    // Provide immediate UI/audio feedback
    if (onSettingsChange) {
      const musicValue = isMusicMuted ? 0 : musicVolume;
      const soundValue = isSoundMuted ? 0 : newValue;
      onSettingsChange(musicValue, soundValue);
    }
    
    // Debounced server save (shorter delay)
    saveAudioSettings(false);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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
          <img src="/Img/Dashboard/music.png" alt="Music" className="w-full h-full" />
          {isMusicMuted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-1 bg-red-500 rotate-45 rounded-full"></div>
            </div>
          )}
        </button>

        {/* Hover Panel */}
        <div
          className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-3 
          bg-orange-600 rounded-2xl p-4 z-50 min-w-[50px] transition-all duration-300 ${
            hoveredControl === "music"
              ? "opacity-100 visible scale-100"
              : "opacity-0 invisible scale-95"
          }`}
        >
          <div className="flex flex-col items-center space-y-3 text-white">
            <div className="text-xs font-bold tracking-wide">Music</div>
            <div className="text-xs text-white">
              {isMusicMuted ? "Muted" : `${musicVolume}%`}
            </div>

            {/* Clickable Vertical Slider */}
            <div
              className="relative w-4 h-32 bg-[white]/80 rounded-full cursor-pointer select-none"
              onMouseDown={(e) => {
                const slider = e.currentTarget;
                const rect = slider.getBoundingClientRect();

                const updateVolume = (clientY: number) => {
                  const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
                  const newValue = 100 - Math.round((y / rect.height) * 100);
                  handleMusicVolumeChange(newValue);
                };

                // Start drag immediately
                updateVolume(e.clientY);

                const handleMouseMove = (moveEvent: MouseEvent) => {
                  updateVolume(moveEvent.clientY);
                };

                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                  // Save immediately when user stops dragging
                  saveAudioSettings(true);
                };

                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              }}
            >
              <div
                className="absolute bottom-0 w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-full  transition-[height] duration-100 ease-linear"
                style={{ height: `${musicVolume}%` }}
              ></div>
              <div
                className="absolute left-1/2 w-4 h-4 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full transform -translate-x-1/2 transition-[bottom] duration-100 ease-linear"
                style={{ bottom: `calc(${musicVolume}% - 8px)` }}
              ></div>
            </div>
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
          bg-orange-600 rounded-2xl p-4 z-50 min-w-[50px] transition-all duration-300 ${
            hoveredControl === "sound"
              ? "opacity-100 visible scale-100"
              : "opacity-0 invisible scale-95"
          }`}
        >
          <div className="flex flex-col items-center space-y-3 text-white">
            <div className="text-xs font-bold tracking-wide">Sound</div>
            <div className="text-xs text-white">
              {isSoundMuted ? "Muted" : `${soundVolume}%`}
            </div>

            {/* Clickable Vertical Slider */}
            <div
              className="relative w-4 h-32 bg-[white]/80 rounded-full cursor-pointer select-none"
              onMouseDown={(e) => {
                const slider = e.currentTarget;
                const rect = slider.getBoundingClientRect();

                const updateVolume = (clientY: number) => {
                  const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
                  const newValue = 100 - Math.round((y / rect.height) * 100);
                  handleSoundVolumeChange(newValue);
                };

                // Start dragging immediately
                updateVolume(e.clientY);

                const handleMouseMove = (moveEvent: MouseEvent) => {
                  updateVolume(moveEvent.clientY);
                };

                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                  // Save immediately when user stops dragging
                  saveAudioSettings(true);
                };

                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              }}
            >
              <div
                className="absolute bottom-0 w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-full transition-[height] duration-100 ease-linear"
                style={{ height: `${soundVolume}%` }}
              ></div>
              <div
                className="absolute left-1/2 w-4 h-4 bg-gradient-to-b from-yellow-400 to-orange-600 rounded-full transform -translate-x-1/2 transition-[bottom] duration-100 ease-linear"
                style={{ bottom: `calc(${soundVolume}% - 8px)` }}
              ></div>
            </div>
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