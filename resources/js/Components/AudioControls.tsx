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
      {/* Music Control - Icon only by default */}
      <div 
        className="flex items-center transition-all duration-300 group/music"
        onMouseEnter={() => setHoveredControl("music")}
        onMouseLeave={() => setHoveredControl(null)}
      >
        <button 
          onClick={toggleMusic}
          className="relative w-12 h-12 flex items-center justify-center transition-all duration-300"
          title={isMusicMuted ? "Unmute music" : "Mute music"}
        >
          <img 
            src="/Img/Dashboard/music.png" 
            alt="Music" 
            className="w-full h-auto transition-transform duration-300 group-hover/music:scale-110" 
          />
          {isMusicMuted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-1 bg-red-500 rotate-45 transform origin-center"></div>
            </div>
          )}
        </button>
        
        {/* Volume slider - expands on hover */}
        <div className={`transition-all duration-300 overflow-hidden flex items-center ${
          hoveredControl === "music" ? "max-w-24 opacity-100 bg-white/80 rounded-full shadow-lg p-2" : "w-0 opacity-0"
        }`}>
          <input
            type="range"
            min="0"
            max="100"
            value={musicVolume}
            onChange={adjustMusic}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-xs text-center text-gray-600 ml-2 min-w-[30px]">
            {isMusicMuted ? "Muted" : `${musicVolume}%`}
          </div>
        </div>
      </div>

      {/* Sound Control - Icon only by default */}
      <div 
        className="flex items-center transition-all duration-300 group/sound"
        onMouseEnter={() => setHoveredControl("sound")}
        onMouseLeave={() => setHoveredControl(null)}
      >
        <button 
          onClick={toggleSound}
          className="relative w-12 h-12 flex items-center justify-center transition-all duration-300"
          title={isSoundMuted ? "Unmute sound" : "Mute sound"}
        >
          <img 
            src="/Img/Dashboard/volume.png" 
            alt="Volume" 
            className="w-full h-auto transition-transform duration-300 group-hover/sound:scale-110" 
          />
          {isSoundMuted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-1 bg-red-500 rotate-45 transform origin-center"></div>
            </div>
          )}
        </button>
        
        {/* Volume slider - expands on hover */}
        <div className={`transition-all duration-300 overflow-hidden flex items-center ${
          hoveredControl === "sound" ? "max-w-24 opacity-100 bg-white/80 rounded-full shadow-lg p-2" : "w-0 opacity-0"
        }`}>
          <input
            type="range"
            min="0"
            max="100"
            value={soundVolume}
            onChange={adjustSound}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-xs text-center text-gray-600 ml-2 min-w-[30px]">
            {isSoundMuted ? "Muted" : `${soundVolume}%`}
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