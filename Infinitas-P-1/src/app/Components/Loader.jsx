"use client";
import React, { useState, useEffect } from "react";

export default function InfinityLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [hideAnim, setHideAnim] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          // Start hide animation
          setHideAnim(true);
          // Actually hide after animation duration
          setTimeout(() => setVisible(false), 1500); // Duration should match css animation
          return 100;
        }
        return p + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className={"loader-overlay " + (hideAnim ? "hide-slide-up" : "")}>
      <div className="loader-background" />
      <svg
        className="infinity-svg"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 187.3 93.7"
      >
        <path
          d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 
                    c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
          strokeMiterlimit="10"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="4"
          fill="none"
          id="outline"
          stroke="#ceae95"
        />
        <path
          d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 
                    c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
          strokeMiterlimit="10"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="4"
          stroke="#ceae95"
          fill="none"
          opacity="0.05"
        />
      </svg>
      <div className="progress-text">{progress}%</div>
    </div>
  );
}
