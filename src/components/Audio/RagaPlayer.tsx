
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface RagaPlayerProps {
  title: string;
  audioUrl?: string;
}

const RagaPlayer = ({ title, audioUrl }: RagaPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sample audio URLs for each raga (these would be replaced with actual URLs in production)
  const ragaAudioMap: Record<string, string> = {
    "Bageshree": "https://assets.mixkit.co/music/preview/mixkit-serene-view-432.mp3",
    "Marwa": "https://assets.mixkit.co/music/preview/mixkit-valley-sunset-127.mp3",
    "Shankara": "https://assets.mixkit.co/music/preview/mixkit-misty-forest-128.mp3",
    "Darbari Kanada": "https://assets.mixkit.co/music/preview/mixkit-relaxing-in-nature-522.mp3",
    "Yaman": "https://assets.mixkit.co/music/preview/mixkit-silent-meditation-561.mp3",
    "Bhairav": "https://assets.mixkit.co/music/preview/mixkit-deep-meditation-109.mp3",
    "Hamsadhwani": "https://assets.mixkit.co/music/preview/mixkit-serene-view-432.mp3",
    "Kedar": "https://assets.mixkit.co/music/preview/mixkit-valley-sunset-127.mp3",
    "Bihag": "https://assets.mixkit.co/music/preview/mixkit-misty-forest-128.mp3",
    "Kafi": "https://assets.mixkit.co/music/preview/mixkit-relaxing-in-nature-522.mp3",
    "Madhuvanti": "https://assets.mixkit.co/music/preview/mixkit-silent-meditation-561.mp3",
    "Desh": "https://assets.mixkit.co/music/preview/mixkit-deep-meditation-109.mp3"
  };

  // Determine the audio source
  const audioSource = audioUrl || ragaAudioMap[title] || "https://assets.mixkit.co/music/preview/mixkit-serene-view-432.mp3";

  useEffect(() => {
    const audio = new Audio(audioSource);
    audioRef.current = audio;
    
    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    // Events
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [audioSource]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
    if (isMuted && newVolume[0] > 0) {
      setIsMuted(false);
    }
  };

  const handleProgressChange = (newTime: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime[0];
      setCurrentTime(newTime[0]);
    }
  };

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="w-full bg-card rounded-md border p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="font-medium">
          {title} Raga
        </div>
        <div className="text-xs text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration || 0)}
        </div>
      </div>
      
      <div className="mb-3">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleProgressChange}
          aria-label="Audio progress"
          className="cursor-pointer"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Button 
            onClick={togglePlay} 
            size="sm" 
            variant="outline" 
            className="w-10 h-10 rounded-full p-0"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 max-w-[180px] w-full">
          <Button 
            onClick={toggleMute} 
            size="sm" 
            variant="ghost" 
            className="p-0 h-8 w-8"
          >
            {isMuted || volume === 0 ? 
              <VolumeX className="h-4 w-4" /> : 
              <Volume2 className="h-4 w-4" />
            }
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            aria-label="Volume"
            className={cn(
              "cursor-pointer",
              (isMuted || volume === 0) && "opacity-50"
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default RagaPlayer;
