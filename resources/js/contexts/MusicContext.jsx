import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const MusicContext = createContext();

export const useMusic = () => {
  return useContext(MusicContext);
};

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(() => {
    const saved = localStorage.getItem('musicPlaying');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('musicVolume');
    return savedVolume ? parseInt(savedVolume) : 40;
  });

  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio('/Music/Music.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('musicPlaying', JSON.stringify(isPlaying));
    localStorage.setItem('musicVolume', volume.toString());
    
    // Control the audio element
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.log("Autoplay prevented:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  const value = {
    isPlaying,
    setIsPlaying,
    volume,
    setVolume
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};