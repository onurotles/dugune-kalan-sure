import React, { useEffect, useState } from "react";
import { subscribeUser } from "./push";

const Countdown: React.FC = () => {
  const targetDate = new Date("2026-07-04T00:00:00");
  const startDate = new Date("2025-07-04T00:00:00");

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const calculateProgress = () => {
    const now = new Date();
    const totalDuration = targetDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
    return progress;
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return "#ff4d4f";
    if (progress < 50) return "#faad14";
    if (progress < 75) return "#fadb14";
    return "#52c41a";
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [progress, setProgress] = useState(calculateProgress());
  const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; twinkle: number }[]>([]);

  useEffect(() => {
    // Push subscription al
    subscribeUser().catch(err => console.error(err));
    // 120 adet yıldız oluştur
    const tempStars = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      twinkle: Math.random() * 2 + 1, // animasyon hızı
    }));
    setStars(tempStars);

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      setProgress(calculateProgress());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles.container}>
      {/* Hilal Ay */}
      <svg style={styles.moon} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="30" fill="white" />
        <circle cx="60" cy="45" r="30" fill="#0a0a2a" />
      </svg>

      {/* Yıldızlar */}
      {stars.map((star, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: `${star.y}%`,
            left: `${star.x}%`,
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            backgroundColor: `rgba(255,255,255,${star.opacity})`,
            boxShadow: `0 0 ${star.size}px rgba(255,255,255,${star.opacity})`,
            animation: `twinkle ${star.twinkle}s infinite alternate`,
          }}
        />
      ))}

      <h1 style={styles.title}>COUNT DOWN TO LAUNCH</h1>
      <p style={styles.date}>{targetDate.toLocaleDateString()}</p>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div
          style={{
            ...styles.progressBar,
            width: `${progress}%`,
            backgroundColor: getProgressColor(progress),
          }}
        >
          <span style={styles.progressLabel}>{progress.toFixed(1)}%</span>
        </div>
      </div>

      <div style={styles.timer}>
        {["days", "hours", "minutes", "seconds"].map((unit) => (
          <div key={unit} style={styles.timeBox}>
            <div style={styles.number}>
              {timeLeft[unit as keyof typeof timeLeft]
                .toString()
                .padStart(2, "0")}
            </div>
            <div style={styles.label}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</div>
          </div>
        ))}
      </div>

      {/* Twinkle animasyonu */}
      <style>
        {`
          @keyframes twinkle {
            from { opacity: 0.2; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#0a0a2a",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    overflow: "hidden",
  },
  moon: {
    position: "absolute",
    top: "10%",
    left: "80%",
    width: "80px",
    height: "80px",
  },
  title: {
    fontSize: "2rem",
    margin: 0,
    zIndex: 1,
  },
  date: {
    margin: "0.5rem 0 2rem",
    fontSize: "1rem",
    zIndex: 1,
  },
  progressContainer: {
    width: "100%",
    maxWidth: "600px",
    height: "25px",
    backgroundColor: "#555",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "2rem",
    position: "relative",
    zIndex: 1,
  },
  progressBar: {
    height: "100%",
    transition: "width 0.5s ease, background-color 0.5s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  progressLabel: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  timer: {
    display: "flex",
    gap: "1rem",
    zIndex: 1,
  },
  timeBox: {
    backgroundColor: "#333",
    padding: "1rem 1.5rem",
    borderRadius: "0.5rem",
    boxShadow: "2px 2px 8px rgba(0,0,0,0.3)",
  },
  number: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
  label: {
    marginTop: "0.3rem",
    fontSize: "0.8rem",
  },
};

export default Countdown;
