import React, { useState, useEffect, useRef } from "react";

const themes = {
  // ... keep your theme object unchanged
  default: { /* same as above */ },
  dark: { /* same as above */ },
  softPurple: { /* same as above */ },
  pastelGreen: { /* same as above */ }
};

const PomodoroTimer = () => {
  const defaultWorkDuration = 25 * 60;
  const defaultBreakDuration = 5 * 60;

  const [workDuration, setWorkDuration] = useState(defaultWorkDuration);
  const [breakDuration, setBreakDuration] = useState(defaultBreakDuration);
  const [timeLeft, setTimeLeft] = useState(defaultWorkDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [themeName, setThemeName] = useState("default");

  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const theme = themes[themeName];

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (audioRef.current) {
              audioRef.current.play().catch(() => {});
            }
            if (!isBreak) {
              setIsBreak(true);
              return breakDuration;
            } else {
              setIsBreak(false);
              return workDuration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isBreak, workDuration, breakDuration]);

  const handleStart = () => {
    if (timeLeft <= 0) {
      setTimeLeft(isBreak ? breakDuration : workDuration);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? breakDuration : workDuration);
  };

  const handleSkipBreak = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(workDuration);
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    const w = Math.min(60, Math.max(1, parseInt(e.target.work.value, 10) || 25));
    const b = Math.min(30, Math.max(1, parseInt(e.target.break.value, 10) || 5));
    setWorkDuration(w * 60);
    setBreakDuration(b * 60);
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(w * 60);
    setShowSettings(false);
  };

  const totalDuration = isBreak ? breakDuration : workDuration;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;
  const progressColor = isBreak ? theme.progressBreak : theme.progressWork;

  return (
    <div className={`${theme.bgColor} min-h-screen flex flex-col items-center justify-center p-4`}>
      <h1 className={`text-4xl font-bold mb-6 ${theme.textColor}`}>Pomodoro Timer</h1>

      <div className={`text-6xl font-mono mb-4 ${theme.textColor}`}>
        {formatTime(timeLeft)}
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={handleStart}
          className={`px-4 py-2 rounded ${theme.primaryColor} ${theme.primaryHover} ${theme.primaryActive} text-white`}
        >
          Start
        </button>
        <button
          onClick={handlePause}
          className={`px-4 py-2 rounded ${theme.secondaryColor} ${theme.secondaryHover} ${theme.secondaryActive} text-white`}
        >
          Pause
        </button>
        <button
          onClick={handleReset}
          className={`px-4 py-2 rounded ${theme.warningColor} ${theme.warningHover} ${theme.warningActive} text-white`}
        >
          Reset
        </button>
        {isBreak && (
          <button
            onClick={handleSkipBreak}
            className={`px-4 py-2 rounded ${theme.dangerColor} ${theme.dangerHover} ${theme.dangerActive} text-white`}
          >
            Skip Break
          </button>
        )}
      </div>

      <div className="w-full max-w-md h-4 bg-gray-300 rounded-full mt-4 overflow-hidden">
        <div
          className={`${progressColor} h-full transition-all duration-500`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-6">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`underline ${theme.toggleText}`}
        >
          {showSettings ? "Hide Settings" : "Show Settings"}
        </button>
      </div>

      {showSettings && (
        <form onSubmit={handleSettingsSubmit} className={`mt-4 p-4 rounded ${theme.settingsBg}`}>
          <label className={`${theme.bodyTextColor} block mb-2`}>
            Work (minutes):
            <input
              name="work"
              type="number"
              min="1"
              max="60"
              defaultValue={workDuration / 60}
              className="ml-2 p-1 border rounded"
            />
          </label>
          <label className={`${theme.bodyTextColor} block mb-2`}>
            Break (minutes):
            <input
              name="break"
              type="number"
              min="1"
              max="30"
              defaultValue={breakDuration / 60}
              className="ml-2 p-1 border rounded"
            />
          </label>
          <button
            type="submit"
            className={`mt-2 px-3 py-1 rounded ${theme.primaryColor} ${theme.primaryHover} text-white`}
          >
            Save
          </button>
        </form>
      )}

      <div className="mt-6">
        <label className={`${theme.bodyTextColor} mr-2`}>Theme:</label>
        <select
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
          className="p-2 rounded border"
        >
          {Object.keys(themes).map((key) => (
            <option key={key} value={key}>
              {themes[key].name}
            </option>
          ))}
        </select>
      </div>

      <audio ref={audioRef} src="https://www.soundjay.com/button/beep-07.wav" preload="auto" />
    </div>
  );
};

export default PomodoroTimer;
