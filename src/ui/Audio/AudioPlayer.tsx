import { useRef, useState } from "react";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";

type AudioPlayerProps = {
  src: string;
};

const AudioPlayer = ({ src }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <div className="w-full max-w-md p-2 rounded-lg bg-gray-900 text-white">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      />

      {/* Progress */}
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={seek}
      />

      {/* Controls */}
      <Controls isPlaying={isPlaying} onPlayPause={togglePlay} />
    </div>
  );
};

export default AudioPlayer;
