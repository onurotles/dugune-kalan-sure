import React, { useEffect, useState } from "react";

const Countdown: React.FC = () => {
  const startDate = new Date("2025-07-04T00:00:00");
  const targetDate = new Date("2026-07-04T00:00:00");

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [progress, setProgress] = useState(calculateProgress());

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  function calculateProgress() {
    const now = new Date().getTime();
    const total = targetDate.getTime() - startDate.getTime();
    const done = now - startDate.getTime();
    return Math.min(100, Math.max(0, (done / total) * 100));
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      setProgress(calculateProgress());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function getBackgroundStyle() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { background: "linear-gradient(to bottom, #87ceeb, #f0e68c)" };
    if (hour >= 12 && hour < 15) return { background: "linear-gradient(to bottom, #00bfff, #ffff66)" };
    if (hour >= 15 && hour < 18) return { background: "linear-gradient(to bottom, #ffcc66, #ff9966)" };
    if (hour >= 18 && hour < 21) return { background: "linear-gradient(to bottom, #ff6600, #990000)" };
    return { background: "#0a0a2a" };
  }

  function renderNightSky() {
    const hour = new Date().getHours();
    if (hour >= 21 || hour < 5) {
      const stars = Array.from({ length: 100 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
      }));
      return (
        <>
          {stars.map((star, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${star.y}%`,
                left: `${star.x}%`,
                width: star.size,
                height: star.size,
                borderRadius: "50%",
                backgroundColor: `rgba(255,255,255,${star.opacity})`,
                boxShadow: `0 0 ${star.size}px rgba(255,255,255,${star.opacity})`,
              }}
            />
          ))}
          <svg style={styles.moon} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" fill="white" />
            <circle cx="60" cy="45" r="30" fill="#0a0a2a" />
          </svg>
        </>
      );
    }
    return null;
  }

  const labels: { [key: string]: string } = {
    days: "Gün",
    hours: "Saat",
    minutes: "Dakika",
    seconds: "Saniye",
  };

  return (
    <div style={{ ...styles.container, ...getBackgroundStyle() }}>
      {renderNightSky()}
      <div style={styles.content}>
        <h1 style={styles.title}>4 TEMMUZ 2026 GERİ SAYIM</h1>

        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }}>
            <span style={styles.progressLabel}>{progress.toFixed(1)}%</span>
          </div>
        </div>

        <div style={styles.timer}>
          {["days", "hours", "minutes", "seconds"].map((unit) => (
            <div key={unit} style={styles.timeBox}>
              <div style={styles.number}>
                {(timeLeft[unit as keyof typeof timeLeft] ?? 0)
                  .toString()
                  .padStart(2, "0")}
              </div>
              <div style={styles.label}>{labels[unit]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Countdown;

const styles: { [key: string]: React.CSSProperties } = {
  container: { width: "100vw", height: "100vh", backgroundSize: "cover", position: "relative", overflow: "hidden", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" },
  content: { position: "relative", zIndex: 1, textAlign: "center", maxWidth: "90%" },
  title: { fontSize: "2.5rem", marginBottom: "0.5rem" },
  progressContainer: { width: "80%", maxWidth: "600px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "10px", overflow: "hidden", margin: "0 auto 2rem" },
  progressBar: { height: "25px", backgroundColor: "#4cafef", display: "flex", justifyContent: "center", alignItems: "center", transition: "width 0.5s ease" },
  progressLabel: { fontSize: "0.9rem", color: "#fff", fontWeight: "bold" },
  timer: { display: "flex", justifyContent: "center", gap: "1.5rem" },
  timeBox: { textAlign: "center" },
  number: { fontSize: "2.5rem", fontWeight: "bold" },
  label: { fontSize: "1rem" },
  moon: { position: "absolute", top: "10%", left: "80%", width: "80px", height: "80px" },
};
