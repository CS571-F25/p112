import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

function TimerPanel({ focusMinutes, onComplete, onTick }) {
  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Sync seconds left if focusMinutes changes (only if timer hasn't started)
    if (!isActive && secondsLeft === focusMinutes * 60) {
      setSecondsLeft(focusMinutes * 60);
    }
  }, [focusMinutes, isActive, secondsLeft]);

  // Ensure time is sent to parent every time it updates
  useEffect(() => {
    if (onTick) {
      onTick(secondsLeft);
    }
  }, [secondsLeft, onTick]);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      if (onComplete) onComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const percent = ((focusMinutes * 60 - secondsLeft) / (focusMinutes * 60)) * 100;

  return (
    <div className="text-center py-3">
      <div 
        className="display-1 fw-bold mb-3" 
        style={{ 
          fontFamily: "monospace",
          color: isActive ? "#38bdf8" : "#9ca3af" // Cyan when active, Gray when paused
        }}
      >
        {formatTime(secondsLeft)}
      </div>
      
      {/* Progress Bar */}
      <div className="progress mb-4" style={{ height: "10px", backgroundColor: "#334155" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ 
            width: `${percent}%`,
            backgroundColor: "#38bdf8",
            transition: "width 1s linear"
          }}
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      <Button
        variant={isActive ? "outline-warning" : "primary"}
        size="lg"
        onClick={toggleTimer}
        className="px-5 fw-bold"
        style={!isActive ? { backgroundColor: "#38bdf8", color: "#000", border: "none" } : {}}
      >
        {isActive ? "Pause" : "Start Focus"}
      </Button>
    </div>
  );
}

export default TimerPanel;
