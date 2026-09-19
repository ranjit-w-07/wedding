import { useEffect, useRef } from 'react';

export default function ScratchCard({ title, name, details, coverText, coverColor }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    ctx.fillStyle = coverColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(coverText, canvas.width / 2, canvas.height / 2 + 5);

    const scratch = (e) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    };

    const start = () => (isDrawing = true);
    const stop = () => (isDrawing = false);

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mousemove', scratch);

    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchend', stop);
    canvas.addEventListener('touchmove', scratch);

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchend', stop);
      canvas.removeEventListener('touchmove', scratch);
    };
  }, [coverColor, coverText]);

  return (
    <div className="scratch-box">
      <div className="scratch-content">
        <span>{title}</span>
        <h4>{name}</h4>
        <p style={{ fontSize: '0.7rem', margin: 0 }}>{details}</p>
      </div>
      <canvas ref={canvasRef} width={200} height={200} />
    </div>
  );
}