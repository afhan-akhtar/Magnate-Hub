"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 600);
    const removeTimer = setTimeout(() => setVisible(false), 1100);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "loaderEntry 0.4s ease-out",
        }}
      >
        <div className="mgh-ant-spin" aria-label="Loading" role="status">
          <span className="mgh-ant-spin-dot" />
          <span className="mgh-ant-spin-dot" />
          <span className="mgh-ant-spin-dot" />
          <span className="mgh-ant-spin-dot" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes loaderEntry {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes mghAntRotate {
          to {
            transform: rotate(405deg);
          }
        }

        @keyframes mghAntDotPulse {
          0%,
          80%,
          100% {
            opacity: 0.35;
            transform: scale(0.45);
          }

          40% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .mgh-ant-spin {
          position: relative;
          width: 42px;
          height: 42px;
          transform: rotate(45deg);
          animation: mghAntRotate 1.2s linear infinite;
        }

        .mgh-ant-spin-dot {
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #1677ff;
          animation: mghAntDotPulse 1s infinite linear alternate;
        }

        .mgh-ant-spin-dot:nth-child(1) {
          top: 0;
          left: 0;
        }

        .mgh-ant-spin-dot:nth-child(2) {
          top: 0;
          right: 0;
          animation-delay: 0.4s;
        }

        .mgh-ant-spin-dot:nth-child(3) {
          right: 0;
          bottom: 0;
          animation-delay: 0.8s;
        }

        .mgh-ant-spin-dot:nth-child(4) {
          bottom: 0;
          left: 0;
          animation-delay: 1.2s;
        }
      `}</style>
    </div>
  );
}
