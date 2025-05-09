import React, { useEffect, useRef } from "react";

const AbstractBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drawCurves = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.9;

      for (let i = 1; i <= 10; i++) {
        const radius = (maxRadius / 10) * i + i * 20; // mayor espacio entre líneas
        ctx.beginPath();
        ctx.lineWidth = 1;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#ff00ff"); // fucsia
        gradient.addColorStop(1, "#0000ff"); // azul
        ctx.strokeStyle = gradient;

        // patrón más desordenado: distorsionamos el círculo
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
          const distortion = Math.sin(angle * i) * 20;
          const x = centerX + (radius + distortion) * Math.cos(angle + i);
          const y = centerY + (radius + distortion) * Math.sin(angle + i);
          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }
    };

    drawCurves();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawCurves();
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity:0.4,
      }}
    />
  );
};

export default AbstractBackground;
