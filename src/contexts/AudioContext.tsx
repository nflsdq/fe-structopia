import React, { createContext, useContext, useState, useEffect } from 'react';
import { Howl } from 'howler';

type SoundType = 
  | 'click' 
  | 'hover' 
  | 'success' 
  | 'error' 
  | 'achievement' 
  | 'levelUp' 
  | 'xp' 
  | 'buttonClick' 
  | 'unlock' 
  | 'complete'
  | 'background';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (sound: SoundType) => void;
  stopSound: (sound: SoundType) => void;
  setVolume: (volume: number) => void;
  volume: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Sound URLs
const SOUNDS: Record<SoundType, string> = {
  click: 'https://assets.mixkit.co/sfx/preview/mixkit-simple-game-click-1114.mp3',
  hover: 'https://assets.mixkit.co/sfx/preview/mixkit-tech-click-1140.mp3',
  success: 'https://assets.mixkit.co/sfx/preview/mixkit-completion-of-a-level-2063.mp3',
  error: 'https://assets.mixkit.co/sfx/preview/mixkit-game-show-wrong-answer-buzz-950.mp3',
  achievement: 'https://assets.mixkit.co/sfx/preview/mixkit-fairy-arcade-sparkle-866.mp3',
  levelUp: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
  xp: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3',
  buttonClick: 'https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3',
  unlock: 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3',
  complete: 'https://assets.mixkit.co/sfx/preview/mixkit-game-level-completed-2059.mp3',
  background: 'https://assets.mixkit.co/sfx/preview/mixkit-game-level-music-689.mp3',
};

interface SoundInstanceMap {
  [key: string]: Howl;
}

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(localStorage.getItem('isMuted') === 'true');
  const [volume, setVolume] = useState<number>(Number(localStorage.getItem('volume') || 0.5));
  const [soundInstances, setSoundInstances] = useState<SoundInstanceMap>({});
  
  // Initialize sounds
  useEffect(() => {
    const instances: SoundInstanceMap = {};
    
    Object.entries(SOUNDS).forEach(([key, url]) => {
      instances[key] = new Howl({
        src: [url],
        volume: volume,
        mute: isMuted,
        html5: true,
        preload: key === 'background', // Only preload essential sounds
      });
    });
    
    setSoundInstances(instances);
    
    // Cleanup
    return () => {
      Object.values(instances).forEach(sound => sound.unload());
    };
  }, []);
  
  // Update mute state when changed
  useEffect(() => {
    localStorage.setItem('isMuted', isMuted.toString());
    Object.values(soundInstances).forEach(sound => {
      sound.mute(isMuted);
    });
  }, [isMuted, soundInstances]);
  
  // Update volume when changed
  useEffect(() => {
    localStorage.setItem('volume', volume.toString());
    Object.values(soundInstances).forEach(sound => {
      sound.volume(volume);
    });
  }, [volume, soundInstances]);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const playSound = (sound: SoundType) => {
    if (soundInstances[sound]) {
      // Stop the sound first to allow rapid re-triggering
      soundInstances[sound].stop();
      
      // For background music, loop it
      if (sound === 'background') {
        soundInstances[sound].loop(true);
      }
      
      soundInstances[sound].play();
    }
  };
  
  const stopSound = (sound: SoundType) => {
    if (soundInstances[sound]) {
      soundInstances[sound].stop();
    }
  };
  
  const updateVolume = (newVolume: number) => {
    setVolume(Math.min(Math.max(newVolume, 0), 1)); // Ensure volume is between 0 and 1
  };
  
  return (
    <AudioContext.Provider
      value={{
        isMuted,
        toggleMute,
        playSound,
        stopSound,
        setVolume: updateVolume,
        volume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export default useAudio;

export { AudioContext }