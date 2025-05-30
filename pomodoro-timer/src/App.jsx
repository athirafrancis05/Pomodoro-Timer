import { useState, useEffect, useRef } from 'react';

function App() {
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(customMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [musicOption, setMusicOption] = useState('none');
  const [volume, setVolume] = useState(100);
  const iframeRef = useRef(null);

  useEffect(() => {
    setTimeLeft(customMinutes * 60);
  }, [customMinutes]);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartPause = () => {
    if (timeLeft === 0) setTimeLeft(customMinutes * 60);
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(customMinutes * 60);
  };

  const getYouTubeEmbedUrl = () => {
    switch (musicOption) {
      case 'lofi':
        return 'https://www.youtube.com/embed/videoseries?list=PLz7qJEc6I_pQKz7B0D1hzQeDEi4AOsTiM&autoplay=1&mute=0';
      case 'focus':
        return 'https://www.youtube.com/embed/videoseries?list=PLRbjoNhQ1PaFA3WmnTqg1zghOucqDkBFQ&autoplay=1&mute=0';
      case 'jazz':
        return 'https://www.youtube.com/embed/videoseries?list=PL8F6B0753B2CCA128&autoplay=1&mute=0';
      case 'nature':
        return 'https://www.youtube.com/embed/videoseries?list=PLQWzKIaERi4iF8UtYy2iClyWd9G27YECc&autoplay=1&mute=0';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-800">🎯 Pomodoro Timer</h1>

        {/* Duration Picker */}
        <div>
          <label className="text-lg font-medium block mb-1">Set Duration (in minutes)</label>
          <input
            type="number"
            min="1"
            max="120"
            value={customMinutes}
            disabled={isRunning}
            onChange={(e) => setCustomMinutes(Number(e.target.value))}
            className="w-24 px-4 py-2 text-center rounded-lg border border-gray-300 focus:outline-none"
          />
        </div>

        {/* Music Selector */}
        <div>
          <label className="text-lg font-medium block mb-1">Background Music</label>
          <select
            value={musicOption}
            disabled={isRunning}
            onChange={(e) => setMusicOption(e.target.value)}
            className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
          >
            <option value="none">None</option>
            <option value="lofi">🎧 Lofi Beats</option>
            <option value="focus">🧠 Focus Music</option>
            <option value="jazz">🎷 Jazz Vibes</option>
            <option value="nature">🌿 Nature Sounds</option>
          </select>
        </div>

        {/* Timer Display */}
        <div className="text-6xl font-mono tracking-wide text-gray-900">
          {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleStartPause}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl text-lg font-semibold transition"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl text-lg font-semibold transition"
          >
            Reset
          </button>
        </div>

        {/* Embedded Music Player */}
        {musicOption !== 'none' && (
          <div className="bg-gray-50 p-4 rounded-xl shadow-inner space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">🎵 Now Playing</h2>
            <iframe
              ref={iframeRef}
              width="100%"
              height="170"
              src={getYouTubeEmbedUrl()}
              title="YouTube Music Playlist"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-lg shadow"
            ></iframe>

            {/* Volume Slider - Informational */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-600">Volume (visual only)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 text-center">
                🔊 Adjust volume on your device or YouTube player directly
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
