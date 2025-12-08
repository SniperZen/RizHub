import React from "react";
import { useMusic } from "../contexts/MusicContext";

interface StudentLayoutProps {
    children: React.ReactNode;
    pauseMusic?: boolean;
    musicVolume?: number;
    soundVolume?: number;
    onVolumeChange?: (music: number, sound: number) => void;
}

export default function StudentLayout({
    children,
    pauseMusic = false,
    musicVolume,
    soundVolume,
    onVolumeChange,
}: StudentLayoutProps) {
    const { setIsPlaying, setVolume, isPlaying } = useMusic();
    
    // Control the global music based on pauseMusic prop
    React.useEffect(() => {
        setIsPlaying(!pauseMusic);
    }, [pauseMusic, setIsPlaying]);

    React.useEffect(() => {
        if (musicVolume !== undefined) {
            setVolume(musicVolume);
        }
    }, [musicVolume, setVolume]);

    return (
        <div className="min-h-screen w-full relative">
            {children}
        </div>
    );
}