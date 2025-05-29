import { useState, useEffect } from 'react';

function App() {
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(customMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

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

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
    <div className="flex flex-col items-center text-center p-4"> 
        <h1 className='text-4xl font-bold mb-6'>Pomodoro Timer 🍅</h1>

        <div className='mb-6'>
          <label className='block text-lg font-medium mb-2'>Set Duration (minutes)</label>
          <input
            type='number'
            min='1'
            max='120'
            value={customMinutes}
            disabled={isRunning}
            onChange={(e) => setCustomMinutes(Number(e.target.value))}
            className='px-4 py-2 border rounded-md text-center w-32'
          />
        </div>

        <div className='text-6xl font-mono mb-4'>{formatTime(timeLeft)}</div>

        <div className='flex gap-4'>
          <button
            className='px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600'
            onClick={handleStartPause}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            className='px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600'
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
