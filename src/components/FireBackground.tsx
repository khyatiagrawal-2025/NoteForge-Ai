import { useEffect, useRef } from "react";

const FireBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createBall = () => {
      const ball = document.createElement("div");
      const size = Math.random() * 30 + 10;
      const left = Math.random() * 100;
      const duration = Math.random() * 3 + 4;
      const drift = (Math.random() - 0.5) * 200;

      Object.assign(ball.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: "-40px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 30% 30%, hsl(51 100% 50%), hsl(16 100% 50%), hsl(348 91% 47%))",
        boxShadow: "0 0 20px hsl(16 100% 50%), 0 0 40px hsl(348 91% 47%)",
        opacity: "0",
        pointerEvents: "none",
        animation: `fireFall ${duration}s linear forwards`,
      });

      // Create inline keyframe
      const keyframes = `
        @keyframes fireFall {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          70% { transform: translateY(100vh) translateX(${drift}px); opacity: 0.8; }
          100% { transform: translateY(100vh) translateX(${drift}px); opacity: 0; }
        }
      `;
      const style = document.createElement("style");
      style.textContent = keyframes;
      document.head.appendChild(style);

      container.appendChild(ball);
      setTimeout(() => {
        ball.remove();
        style.remove();
      }, (duration + 1) * 1000);
    };

    const interval = setInterval(createBall, 2000);
    // Initial burst
    for (let i = 0; i < 8; i++) setTimeout(createBall, i * 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Radial gradient bg */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at top left, hsl(348 91% 47% / 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, hsl(16 100% 50% / 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at center, hsl(51 100% 50% / 0.08) 0%, transparent 70%),
            linear-gradient(180deg, hsl(0 0% 4%) 0%, hsl(0 100% 5%) 50%, hsl(0 0% 4%) 100%)
          `,
          animation: "bgPulse 6s ease-in-out infinite",
        }}
      />
      {/* Particle container */}
      <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" />
    </>
  );
};

export default FireBackground;
