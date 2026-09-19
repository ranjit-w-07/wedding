import { useState, useEffect, useRef } from 'react';

export default function Countdown({ targetDate, revealOnInteraction = false }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isRevealed, setIsRevealed] = useState(!revealOnInteraction);
  const canvasRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    if (!revealOnInteraction || isRevealed) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d');
    let isDrawing = false;

    context.fillStyle = '#741538';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#f6d98d';
    context.font = '700 17px Noto Sans Devanagari, sans-serif';
    context.textAlign = 'center';
    context.fillText('स्पर्श करा किंवा स्क्रॅच करा', canvas.width / 2, canvas.height / 2 - 5);
    context.font = '14px Noto Sans Devanagari, sans-serif';
    context.fillText('प्रेमाचा वेळ उलगडा', canvas.width / 2, canvas.height / 2 + 24);

    const reveal = () => setIsRevealed(true);
    const start = () => {
      isDrawing = true;
      reveal();
    };
    const stop = () => { isDrawing = false; };
    const scratch = (event) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = event.clientX || event.touches?.[0]?.clientX;
      const clientY = event.clientY || event.touches?.[0]?.clientY;
      if (clientX === undefined || clientY === undefined) return;
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.arc(clientX - rect.left, clientY - rect.top, 28, 0, Math.PI * 2);
      context.fill();
    };

    canvas.addEventListener('click', reveal);
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchstart', start, { passive: true });
    canvas.addEventListener('touchend', stop);
    canvas.addEventListener('touchmove', scratch, { passive: true });

    return () => {
      canvas.removeEventListener('click', reveal);
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mouseleave', stop);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchend', stop);
      canvas.removeEventListener('touchmove', scratch);
    };
  }, [isRevealed, revealOnInteraction]);

  return (
    <div className={`countdown-reveal ${isRevealed ? 'is-revealed' : ''}`}>
      <div className="countdown">
        <div className="time-box"><span>{timeLeft.days}</span><label>दिवस</label></div>
        <div className="time-box"><span>{timeLeft.hours}</span><label>तास</label></div>
        <div className="time-box"><span>{timeLeft.minutes}</span><label>मिनिटे</label></div>
        <div className="time-box"><span>{timeLeft.seconds}</span><label>सेकंद</label></div>
      </div>
      {!isRevealed && <canvas className="countdown-cover" ref={canvasRef} width="420" height="116" aria-label="Countdown reveal scratch area" />}
    </div>
  );
}