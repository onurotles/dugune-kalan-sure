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

  function getBackgroundStyle(): React.CSSProperties {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return { background: "linear-gradient(to top, #f0e68c, #87ceeb)" };
    }
    if (hour >= 12 && hour < 15) {
      return { background: "linear-gradient(to top, #00bfff, #ffff66)" };
    }
    if (hour >= 15 && hour < 18) {
      return {
        background: "linear-gradient(to top, #3cba54 20%, #87ceeb 80%)",
        position: "relative",
      };
    }
    if (hour >= 18 && hour < 21) {
      return { background: "linear-gradient(to top, #ff6600, #990000)" };
    }
    return { background: "#0a0a2a" };
  }

  function renderAfternoonScene() {
    const hour = new Date().getHours();
    if (hour >= 15 && hour < 18) {
      return (
        <>
          {/* Güneş */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "75%",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #ffeb3b, #fbc02d)",
              boxShadow: "0 0 50px rgba(255,223,0,0.8)",
            }}
          />

          {/* Bulutlar (sadece 2 tane kaldı) */}
          <div style={{ ...styles.cloud, top: "15%", left: "10%" }} />
          <div style={{ ...styles.cloud, top: "20%", left: "40%" }} />

          {/* Çimen */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "80px",
              background: "linear-gradient(to top, #228B22, #32CD32)",
              borderTopLeftRadius: "50% 20px",
              borderTopRightRadius: "50% 20px",
            }}
          />

          {/* Ağaçlar */}
          <svg
            style={{ position: "absolute", bottom: 0, left: "10%", height: "200px" }}
            viewBox="0 0 100 200"
          >
            <rect x="45" y="120" width="10" height="80" fill="#8b4513" />
            <circle cx="50" cy="100" r="40" fill="#228B22" />
          </svg>

          <svg
            style={{ position: "absolute", bottom: 0, left: "30%", height: "150px" }}
            viewBox="0 0 100 200"
          >
            <rect x="45" y="120" width="10" height="80" fill="#8b4513" />
            <circle cx="50" cy="100" r="35" fill="#2e8b57" />
          </svg>

          <svg
            style={{ position: "absolute", bottom: 0, right: "20%", height: "180px" }}
            viewBox="0 0 100 200"
          >
            <rect x="45" y="120" width="10" height="80" fill="#8b4513" />
            <circle cx="50" cy="100" r="38" fill="#006400" />
          </svg>
        </>
      );
    }
    return null;
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
      {renderAfternoonScene()}
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
  container: {
    width: "100vw",
    height: "100vh",
    backgroundSize: "cover",
    position: "relative",
    overflow: "hidden",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    maxWidth: "90%",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
  },
  progressContainer: {
    width: "80%",
    maxWidth: "600px",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "10px",
    overflow: "hidden",
    margin: "0 auto 2rem",
  },
  progressBar: {
    height: "25px",
    backgroundColor: "#4cafef",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "width 0.5s ease",
  },
  progressLabel: {
    fontSize: "0.9rem",
    color: "#fff",
    fontWeight: "bold",
  },
  timer: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
  },
  timeBox: {
    textAlign: "center",
  },
  number: {
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
  label: {
    fontSize: "1rem",
  },
  moon: {
    position: "absolute",
    top: "10%",
    left: "80%",
    width: "80px",
    height: "80px",
  },
  cloud: {
    position: "absolute",
    width: "120px",
    height: "60px",
    background: "#fff",
    borderRadius: "60px",
    boxShadow: "30px 10px 0 0 #fff, 60px 15px 0 0 #fff, 90px 5px 0 0 #fff",
    opacity: 0.8,
  },
};
