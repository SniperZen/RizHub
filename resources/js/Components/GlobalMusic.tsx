import React, { useEffect, useRef } from 'react';
import { useMusic } from '../contexts/MusicContext';

export default function GlobalMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isPlaying, volume } = useMusic();

  useEffect(() => {
    if (audioRef.current) {
      // Restore playback position if available
      const savedPosition = localStorage.getItem('musicPosition');
      if (savedPosition) {
        audioRef.current.currentTime = parseFloat(savedPosition);
      }

      audioRef.current.volume = volume / 100;

      if (isPlaying) {
        audioRef.current.play().catch(() => {
          console.log('Autoplay was prevented');
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [volume, isPlaying]);

  // Save playback position periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        localStorage.setItem('musicPosition', audioRef.current.currentTime.toString());
      }
    }, 1000); // Save every second

    return () => clearInterval(interval);
  }, []);

  // Clear position when component unmounts (optional)
  useEffect(() => {
    return () => {
      localStorage.removeItem('musicPosition');
    };
  }, []);

  return (
    // <audio
    //   ref={audioRef}
    //   id="bg-music"
    //   src="/Music/Music.mp3"
    //   loop
    //   hidden
    // />
    <>
    </>
  );
}
