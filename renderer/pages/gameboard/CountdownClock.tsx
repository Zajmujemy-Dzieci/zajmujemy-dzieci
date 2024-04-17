import React, { useState, useEffect } from 'react';

interface CountdownClockProps {
  timeoutInSeconds: number;
  onTimeout: () => void;
}

const CountdownClock: React.FC<CountdownClockProps> = ({ timeoutInSeconds, onTimeout }) => {
  const [remainingTime, setRemainingTime] = useState<number>(timeoutInSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) {
      onTimeout();
    }
  }, [remainingTime, onTimeout]);

  const setTime = (newTime: number) => {
    // Validate newTime if needed (e.g., ensure it's positive)
    setRemainingTime(newTime);
  };

  return (
    <div>
      Pozostały czas: {remainingTime}
    </div>
  );
};

export default CountdownClock;
