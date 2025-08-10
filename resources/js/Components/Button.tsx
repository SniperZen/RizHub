import React, { useRef, useEffect, useContext } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  soundHover?: string;
  soundClick?: string;
  children: React.ReactNode;
  soundVolume?: number; // Add soundVolume prop
}

const Button: React.FC<ButtonProps> = ({
  soundHover = '/sounds/hover.mp3',
  soundClick = '/sounds/click.mp3',
  children,
  className = '',
  soundVolume = 50, // Default to 50% if not provided
  ...props
}) => {
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  // Calculate actual volume (0-1) from percentage (0-100)
  const volume = soundVolume / 100;

  // Initialize audio elements
  useEffect(() => {
    if (soundHover) {
      hoverSoundRef.current = new Audio(soundHover);
      hoverSoundRef.current.volume = volume * 0.3; // Reduce hover volume to 30% of user setting
    }
    if (soundClick) {
      clickSoundRef.current = new Audio(soundClick);
      clickSoundRef.current.volume = volume * 0.5; // Reduce click volume to 50% of user setting
    }

    return () => {
      hoverSoundRef.current?.pause();
      clickSoundRef.current?.pause();
    };
  }, [soundHover, soundClick, volume]);

  const handleMouseEnter = () => {
    if (!props.disabled && hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(e => console.log("Hover sound error:", e));
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!props.disabled && clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(e => console.log("Click sound error:", e));
    }
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <button
      {...props}
      className={className}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;