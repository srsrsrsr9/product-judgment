import { useEffect, useRef } from 'react';

export default function RetentionCliff() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const parchment = '#FAFAF7';
    const ink = '#1C1C1C';
    const exitRed = '#8B3A3A';
    const gold = '#C28E2C';

    let frame = 0; let currentWeek = 0;
    const stickFigures =[]; const totalFigures = 24;
    let animationId;

    function initFigures() {
      stickFigures.length = 0;
      for (let i = 0; i < totalFigures; i++) {
        stickFigures.push({
          x: 150 + (i % 8) * 60 + Math.random() * 30,
          y: 250 + Math.floor(i / 8) * 60 + Math.random() * 40,
          vx: 0, vy: 0,
          state: i === 0 ? 'builder' : 'idle',
          exitWeek: Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : 0,
          opacity: 1
        });
      }
      stickFigures[0].exitWeek = 999;
    }
    initFigures();

    function drawDoor(x, y, week) {
      ctx.strokeStyle = ink; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x - 30, y - 40); ctx.lineTo(x - 30, y + 40); ctx.lineTo(x + 30, y + 40); ctx.lineTo(x + 30, y - 40); ctx.stroke();
      ctx.fillStyle = '#E5E5E0'; ctx.fillRect(x - 25, y - 35, 50, 75);
      ctx.fillStyle = ink; ctx.font = 'bold 16px Courier New'; ctx.textAlign = 'center'; ctx.fillText(`Week ${week}`, x, y + 60);
    }

    function drawStickFigure(fig, isGhost = false) {
      ctx.save(); ctx.globalAlpha = fig.opacity; if (isGhost) ctx.globalAlpha = 0.3;
      ctx.strokeStyle = fig.state === 'builder' ? gold : ink; ctx.lineWidth = 2; const x = fig.x; const y = fig.y;
      ctx.beginPath(); ctx.arc(x, y - 25, 8, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - 17); ctx.lineTo(x, y + 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 12, y - 5); ctx.lineTo(x, y - 10); ctx.lineTo(x + 12, y - 5); ctx.stroke();
      if (fig.state === 'exiting') { ctx.beginPath(); ctx.moveTo(x, y + 5); ctx.lineTo(x - 8, y + 20); ctx.moveTo(x, y + 5); ctx.lineTo(x + 8, y + 20); ctx.stroke(); }
      else if (fig.state === 'confused') { ctx.beginPath(); ctx.moveTo(x, y + 5); ctx.lineTo(x - 5, y + 20); ctx.moveTo(x, y + 5); ctx.lineTo(x + 5, y + 20); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x + 15, y - 20); ctx.stroke(); }
      else { ctx.beginPath(); ctx.moveTo(x, y + 5); ctx.lineTo(x - 6, y + 20); ctx.moveTo(x, y + 5); ctx.lineTo(x + 6, y + 20); ctx.stroke(); }
      if (fig.state === 'idle' && Math.random() > 0.7) { ctx.fillStyle = ink; ctx.fillRect(x + 10, y - 5, 6, 10); } ctx.restore();
    }

    function drawExitSign(x, y) { ctx.fillStyle = exitRed; ctx.fillRect(x - 25, y - 10, 50, 20); ctx.fillStyle = '#FAFAF7'; ctx.font = 'bold 12px Courier New'; ctx.textAlign = 'center'; ctx.fillText('EXIT', x, y + 4); }

    function drawJokeFigure() {
      const x = 750; const y = 350; ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.arc(x, y - 25, 8, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - 17); ctx.lineTo(x, y + 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 12, y - 5); ctx.lineTo(x, y + 5); ctx.lineTo(x + 12, y - 5); ctx.stroke();
      ctx.fillStyle = gold; ctx.fillRect(x - 3, y - 2, 6, 10);
      ctx.beginPath(); ctx.moveTo(x, y + 5); ctx.lineTo(x - 10, y + 20); ctx.moveTo(x, y + 5); ctx.lineTo(x + 5, y + 18); ctx.stroke();
      ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'center'; ctx.fillText('"Thought they got a', x, y + 40); ctx.fillText('push notification"', x, y + 55); ctx.fillText('They did not.', x, y + 70);
    }

    function updateFigures() {
      stickFigures.forEach(fig => {
        if (fig.state === 'builder') return;
        if (currentWeek >= fig.exitWeek && fig.state !== 'exiting' && fig.state !== 'gone') { fig.state = 'exiting'; fig.vx = 2 + Math.random(); }
        if (fig.state === 'exiting') { fig.x += fig.vx; fig.opacity -= 0.01; if (fig.opacity <= 0) { fig.state = 'gone'; fig.opacity = 0; } }
        if (currentWeek === 2 && fig.state === 'idle' && Math.random() > 0.5) { fig.state = 'confused'; }
      });
    }

    function draw() {
      ctx.fillStyle = parchment; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink; ctx.font = 'bold 24px Courier New'; ctx.textAlign = 'center'; ctx.fillText('The Retention Cliff', 450, 50);
      const weekPositions =[150, 350, 550, 750]; weekPositions.forEach((x, i) => { drawDoor(x, 150, i + 1); if (i < currentWeek) { drawExitSign(x, 220); } });
      updateFigures(); stickFigures.forEach(fig => { if (fig.state !== 'gone') { drawStickFigure(fig); } });
      if (currentWeek >= 3) { drawJokeFigure(); }
      ctx.fillStyle = gold; ctx.font = 'bold 18px Courier New'; ctx.textAlign = 'center'; ctx.fillText(`Current: Week ${currentWeek + 1}`, 450, 550);
    }

    function animate() {
      frame++; if (frame % 120 === 0 && currentWeek < 3) { currentWeek++; } draw();
      if (frame < 480) { animationId = requestAnimationFrame(animate); }
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { animate(); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(canvas);

    const handleClick = () => { cancelAnimationFrame(animationId); frame = 0; currentWeek = 0; initFigures(); animate(); };
    canvas.addEventListener('click', handleClick);

    return () => { cancelAnimationFrame(animationId); canvas.removeEventListener('click', handleClick); observer.disconnect(); };
  },[]);

  return (
    <div style={{ margin: '2.5rem 0', textAlign: 'center' }}>
      <canvas ref={canvasRef} width={900} height={600} style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer' }} />
      <button onClick={() => canvasRef.current?.click()} style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.75rem', background: 'var(--bg-card, #1a1a1a)', border: '1px solid var(--border, #2a2a2a)', borderRadius: '4px', padding: '0.35rem 1rem', cursor: 'pointer', transition: 'all 0.2s' }}>Replay</button>
    </div>
  );
}
