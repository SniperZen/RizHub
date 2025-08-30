// contexts/SoundSettingsContext.tsx
import React from 'react';

interface SoundSettingsContextType {
  volume: number;
  setVolume: (volume: number) => void;
  music: number;
  setMusic: (music: number) => void;
  isVolumeMuted: boolean;
  setIsVolumeMuted: (muted: boolean) => void;
  isMusicMuted: boolean;
  setIsMusicMuted: (muted: boolean) => void;
  toggleVolume: () => void;
  toggleMusic: () => void;
  handleSliderDrag: (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    setter: (value: number) => void,
    ref: React.RefObject<HTMLDivElement>
  ) => void;
  handleSliderChangeEnd: () => void;
}

export const SoundSettingsContext = React.createContext<SoundSettingsContextType | undefined>(undefined);

export const useSoundSettings = () => {
  const context = React.useContext(SoundSettingsContext);
  if (context === undefined) {
    throw new Error('useSoundSettings must be used within a StudentLayout');
  }
  return context;
};