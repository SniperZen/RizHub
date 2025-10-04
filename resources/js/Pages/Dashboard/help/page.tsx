import React from "react";
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

// Sound playing function
const playSound = (soundPath: string, volume: number = 30) => {
  try {
    const audio = new Audio(soundPath);
    audio.volume = Math.min(Math.max(volume / 100, 0), 1); // Clamp between 0-1
    audio.play().catch(error => {
      console.log("Sound play failed:", error);
    });
  } catch (error) {
    console.log("Sound error:", error);
  }
};

const TypingText = ({ soundVolume = 30 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundCooldownRef = useRef(false);
  
  const fullText = `Watch the video animation carefully before proceeding to the challenge, <br />The questions from the challenge will consist of five number of items.<br /><br />Get a perfect score to unlock the next chapter and earn special award, <br />Complete all chapters to receive an unforgettable reward from the system.<br /><br />Good luck and enjoy the learning journey!`;

  // Typing sound effect
  const typingSound = "/Music/typewriter.mp3";  

  // Initialize audio with proper volume clamping
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(Math.max(soundVolume / 100, 0), 1);
    }
  }, [soundVolume]);

  // Improved typing sound effect with better pacing
  useEffect(() => {
    if (currentIndex < fullText.length && currentIndex > 0) {
      const playTypingSound = () => {
        // Only play if volume is above 0 and not in cooldown
        if (soundVolume > 0 && !soundCooldownRef.current) {
          const audio = new Audio(typingSound);
          // Set volume to 25% of the specified soundVolume for softer typing
          const adjustedVolume = (soundVolume / 100) * 0.25;
          audio.volume = Math.min(Math.max(adjustedVolume, 0), 0.25);
          
          // Set cooldown to prevent rapid sound playback
          soundCooldownRef.current = true;
          setTimeout(() => {
            soundCooldownRef.current = false;
          }, 150); // Sound cooldown of 150ms

          audio.play().catch(e => console.log("Audio play failed:", e));
        }
      };

      // Only play sound for visible characters (not HTML tags, spaces, or punctuation)
      const currentChar = fullText[currentIndex - 1];
      const shouldPlaySound = 
        currentChar !== '<' && 
        currentChar !== '>' && 
        currentChar !== '/' && 
        currentChar !== ' ' &&
        currentChar !== '.' && 
        currentChar !== ',' && 
        currentChar !== '!' &&
        currentChar !== '?' &&
        currentChar !== ';' &&
        currentChar !== ':';

      // Play sound only for every 2nd character to reduce frequency
      if (shouldPlaySound && currentIndex % 2 === 0) {
        playTypingSound();
      }
    }
  }, [currentIndex, fullText, soundVolume]);

  // Main typing effect - keeping the fast 50ms speed
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Fast typing speed (50ms per character)

      return () => clearTimeout(timer);
    } else {
      // Play completion sound when typing finishes with adjusted volume
      if (soundVolume > 0) {
        const completionSound = new Audio("/music/typing-complete.mp3");
        completionSound.volume = Math.min(Math.max(soundVolume / 100, 0), 1);
        completionSound.play().catch(e => console.log("Completion sound failed:", e));
      }
    }
  }, [currentIndex, fullText, soundVolume]);

  // Export sound function
  const exportSoundSettings = () => {
    const soundConfig = {
      typingSound: typingSound,
      soundVolume: soundVolume,
      soundClick: "/Music/typewriter.mp3",
      soundHover: "/sounds/button-hover.mp3"
    };
    
    // Create a downloadable JSON file
    const dataStr = JSON.stringify(soundConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'typing-sound-settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Hidden audio element for reference */}
      <audio ref={audioRef} src={typingSound} preload="auto" />
      
      <div className="flex flex-col items-center gap-4">
        <span 
          dangerouslySetInnerHTML={{ __html: displayText }} 
          className="whitespace-pre-wrap"
        />
      </div>
    </>
  );
};

// Define the types for your props with index signature
interface User {
  music?: number;
  sound?: number;
  name?: string;
}

interface Auth {
  user?: User;
}

interface PageProps {
  music?: number;
  sound?: number;
  name?: string;
  unreadNotifications?: number;
  notifications?: any[];
  auth?: Auth;
  [key: string]: any;
}

export default function HelpPage() {
  const { props } = usePage<PageProps>();
  const { music, sound, name, unreadNotifications, notifications, auth } = props;

  // Use auth.user if available, otherwise use props directly or defaults
  const userMusic = auth?.user?.music ?? music ?? 40;
  const userSound = auth?.user?.sound ?? sound ?? 30;
  const volume = userSound; // Define volume variable
  const userName = auth?.user?.name ?? name ?? 'User101';
  const userUnreadNotifications = auth?.user ? unreadNotifications : 0;

  // Background images
  const backgroundImage = '/Img/Dashboard/BG2.png';
  const illustrationImage = '/Img/Dashboard/Illustartion.png';
  const headerImage = '/Img/Dashboard/header-ins.png'; 
  const personImage = '/Img/Dashboard/bg-per.png'; 

  const handleBack = () => {
    // Go back to dashboard
    if (auth?.user) {
      router.visit('/dashboard');
    } else {
      window.history.back();
    }
  };

  // Handle back button with sound
  const handleBackWithSound = () => {
    playSound("/Music/Sound.mp3", volume);
    // Add a small delay to allow sound to play before navigation
    setTimeout(() => {
      handleBack();
    }, 100);
  };

  return (
    <>
      <Head title="Help" />
      
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed relative overflow-hidden"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0"></div>
        
        {/* Back button positioned at top right */}
        <div className="absolute top-6 right-6 z-40">
          <button
            onClick={handleBackWithSound}
            onMouseEnter={() => playSound("/sounds/button-hover.mp3", volume)}
            className="bg-transparent transition hover:scale-105 flex items-center gap-2"
          >
            <img 
              src="/Img/Dashboard/back.png" 
              alt="Back to Dashboard" 
              className="w-14 h-14 object-contain"
            />
          </button>
        </div>

        <div className="absolute z-10 min-h-screen">
          <div className="fix w-full max-w-5xl mb-2 overflow-hidden">
            <div className="flex w-full h-screen overflow-hidden relative">
              
              {/* Illustration wrapper */}
              <div className="relative inline-block overflow-hidden">
                <img 
                  src={illustrationImage} 
                  alt="Help Illustration" 
                  className="object-contain w-[110vw] h-[110vh] ml-20 z-20 scale-110"
                />
              </div>

            {/* Centered instructional text with typing effect */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-30 px-10">
              <p className="text-white text-[22px] font-semibold leading-relaxed drop-shadow-lg max-w-3xl space-y-2">
                <TypingText soundVolume={userSound} />
              </p>
            </div>

            {/* Header stays centered with smooth floating animation */}
            <div 
              className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 h-60 scale-150"
              style={{ animation: "smoothFloat 6s ease-in-out infinite" }}
            >
              <img 
                src={headerImage} 
                alt="Help Header" 
                className="h-55 w-auto"
              />
            </div>

            <style>
              {`
                @keyframes smoothFloat {
                  0% { transform: translate(-50%, 0); }
                  50% { transform: translate(-50%, -15px); }
                  100% { transform: translate(-50%, 0); }
                }
              `}
            </style>

            </div>
          </div>
        </div>
        
        {/* Person anchored to bottom-left of illustration */}
        <div className="absolute bottom-0 right-12 z-30 scale-110">
          <img 
            src={personImage} 
            alt="Person" 
            className="max-w-[90vw] max-h-[90vh] h-auto w-auto"
          />
        </div>
      </div>
    </>
  );
}