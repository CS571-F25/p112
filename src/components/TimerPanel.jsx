import { useState, useEffect } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

function TimerPanel({ focusMinutes }) {
  const totalSeconds = focusMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const handleReset = () => {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
  };

  return (
    <div className="timer-panel">
      <div className="timer-time">
        {minutes}:{seconds}
      </div>
      <ButtonGroup className="mt-2">
        <Button
          variant={isRunning ? "outline-light" : "light"}
          onClick={() => setIsRunning((prev) => !prev)}
        >
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button variant="outline-secondary" onClick={handleReset}>
          Reset
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default TimerPanel;
