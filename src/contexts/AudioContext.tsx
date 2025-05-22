import React, { createContext, useContext, useState, useEffect } from 'react';
import { Howl } from 'howler';
import click from '../components/music/click.mp3';
import hover from '../components/music/hover.mp3';
import success from '../components/music/success.mp3';
import error from '../components/music/error.mp3';
import achievement from '../components/music/achievement.mp3';
import levelUp from '../components/music/levelUp.mp3';
import xp from '../components/music/xp.mp3';
import buttonClick from '../components/music/buttonClick.mp3';
import unlock from '../components/music/unlock.mp3';
import complete from '../components/music/complete.mp3';
import background from '../components/music/background.mp3';

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
  playSound: (sound: SoundType) => void;
  stopSound: (sound: SoundType) => void;
  setVolume: (volume: number) => void;
  volume: number;
  isBackgroundPlaying: boolean;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Sound URLs
const SOUNDS: Record<SoundType, string> = {
  click: click,
  hover: hover,
  success: success,
  error: error,
  achievement: achievement,
  levelUp: levelUp,
  xp: xp,
  buttonClick: buttonClick,
  unlock: unlock,
  complete: complete,
  background: background,
};

interface SoundInstanceMap {
  [key: string]: Howl;
}

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [volume, setVolume] = useState<number>(Number(localStorage.getItem('volume') || 0.5));
  const [soundInstances, setSoundInstances] = useState<SoundInstanceMap>({});
  const [isBackgroundPlaying, setIsBackgroundPlaying] = useState<boolean>(false);

  // Initialize sounds
  useEffect(() => {
    const instances: SoundInstanceMap = {};
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const howl = new Howl({
        src: [url],
        volume: volume,
        mute: false,
        html5: true,
        preload: true,
        loop: key === 'background',
      });
      instances[key] = howl;
    });
    setSoundInstances(instances);
    // Pastikan semua sound effect tidak mute
    Object.entries(instances).forEach(([key, howl]) => {
      if (key !== 'background') {
        howl.mute(false);
      }
    });
    return () => {
      Object.values(instances).forEach(sound => sound.unload());
    };
  }, []);

  // Update volume when changed
  useEffect(() => {
    localStorage.setItem('volume', volume.toString());
    Object.values(soundInstances).forEach(sound => {
      sound.volume(volume);
    });
  }, [volume, soundInstances]);

  // Play/pause background music sesuai state
  useEffect(() => {
    if (soundInstances.background) {
      if (isBackgroundPlaying) {
        if (!soundInstances.background.playing()) {
          soundInstances.background.play();
        }
      } else {
        soundInstances.background.pause();
      }
    }
  }, [isBackgroundPlaying, soundInstances]);

  const playSound = (sound: SoundType) => {
    if (sound === 'background') {
      playBackgroundMusic();
      return;
    }
    if (soundInstances[sound]) {
      soundInstances[sound].stop();
      soundInstances[sound].play();
    }
  };

  const stopSound = (sound: SoundType) => {
    if (sound === 'background') {
      stopBackgroundMusic();
      return;
    }
    if (soundInstances[sound]) {
      soundInstances[sound].stop();
    }
  };

  const playBackgroundMusic = () => {
    if (soundInstances.background) {
      if (!soundInstances.background.playing()) {
        soundInstances.background.play();
      }
      setIsBackgroundPlaying(true);
      localStorage.setItem('isBackgroundPlaying', 'true');
    }
  };

  const stopBackgroundMusic = () => {
    if (soundInstances.background) {
      soundInstances.background.pause();
      setIsBackgroundPlaying(false);
      localStorage.setItem('isBackgroundPlaying', 'false');
    }
  };

  const updateVolume = (newVolume: number) => {
    setVolume(Math.min(Math.max(newVolume, 0), 1));
  };

  return (
    <AudioContext.Provider
      value={{
        playSound,
        stopSound,
        setVolume: updateVolume,
        volume,
        isBackgroundPlaying,
        playBackgroundMusic,
        stopBackgroundMusic,
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