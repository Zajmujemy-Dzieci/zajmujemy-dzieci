import React, { useState, useEffect } from 'react';
import styles from './CountdownClock.module.scss'

interface CountdownClockProps {
  timeoutInSeconds: number;
  onTimeout: () => void;
}

const CountdownClock: React.FC<CountdownClockProps> = ({ timeoutInSeconds, onTimeout }) => {
  const [remainingTime, setRemainingTime] = useState<number>(timeoutInSeconds);

  // Ten useEffect będzie reagował na zmiany wartości timeoutInSeconds
  useEffect(() => {
    setRemainingTime(timeoutInSeconds); // Resetowanie czasu odliczania
  }, [timeoutInSeconds]);

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


  return (
      <div className={styles['countdown-clock-container']}>
        <div className={styles['countdown-clock-oval']}>
          <div className={`${styles['countdown-clock-text']} ${remainingTime <= 5 && styles['red-text']}`}>
            Pozostały czas: {remainingTime}
          </div>
        </div>
      </div>
  );
};

export default CountdownClock;