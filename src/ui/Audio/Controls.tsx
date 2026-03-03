import { Icons } from "../Icons/icon";

type ControlsProps = {
  isPlaying: boolean;
  onPlayPause: () => void;
};

const Controls = ({ isPlaying, onPlayPause }: ControlsProps) => {
  return (
    <div className="flex justify-center mt-1">
      <button
        onClick={onPlayPause}
        className="px-2 py-1 bg-gray-700 hover:bg-gray-800 rounded-lg"
      >
        {isPlaying ? <Icons.Pause /> : <Icons.Play />}
      </button>
    </div>
  );
};

export default Controls;
