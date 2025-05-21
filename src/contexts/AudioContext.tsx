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

// Sound URLs - these will be replaced with local files
const SOUNDS: Record<SoundType, string> = {
  click: '/sounds/click.mp3',
  hover: '/sounds/hover.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  achievement: '/sounds/achievement.mp3',
  levelUp: '/sounds/levelUp.mp3',
  xp: '/sounds/xp.mp3',
  buttonClick: '/sounds/buttonClick.mp3',
  unlock: '/sounds/unlock.mp3',
  complete: '/sounds/complete.mp3',
  background: '/sounds/background.mp3',
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