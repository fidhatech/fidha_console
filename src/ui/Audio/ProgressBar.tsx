type ProgressBarProps = {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
};

const ProgressBar = ({ currentTime, duration, onSeek }: ProgressBarProps) => {
  return (
    <div className="w-full mt-2">
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-xs text-gray-400 text-right">
        {Math.floor(currentTime)} / {Math.floor(duration)} sec
      </div>
    </div>
  );
};

export default ProgressBar;
