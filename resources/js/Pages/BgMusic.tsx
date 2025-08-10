import React, { useEffect, useRef } from "react";

export default function BgMusic({
    volume = 100,
    pause = false
}: {
    volume?: number;
    pause?: boolean;
}) {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;

            if (pause) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(() => {
                    // Autoplay may be blocked
                });
            }
        }
    }, [volume, pause]);

    return (
        <audio
            ref={audioRef}
            id="bg-music"
            src="/Music/Music.mp3"
            autoPlay
            loop
            hidden
        />
    );
}
