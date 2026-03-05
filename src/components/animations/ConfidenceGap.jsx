import { useEffect, useRef } from 'react';

export default function ConfidenceGap() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const parchment = '#FAFAF7';
    const ink = '#1C1C1C';
    const gold = '#C28E2C';

    let progress = 0;
    let animationId;

    function drawGrid() {
      ctx.strokeStyle = '#D1D1D1'; ctx.lineWidth = 0.5;
      for (let i = 0; i < 10; i++) { const y = 100 + i * 40; ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(720, y); ctx.stroke(); }
      for (let i = 0; i < 12; i++) { const x = 80 + i * 53; ctx.beginPath(); ctx.moveTo(x, 100); ctx.lineTo(x, 420); ctx.stroke(); }
    }

    function drawAxes() {
      ctx.strokeStyle = ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(80, 420); ctx.lineTo(80, 80); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(75, 85); ctx.lineTo(80, 80); ctx.lineTo(85, 85); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(80, 420); ctx.lineTo(750, 420); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(745, 415); ctx.lineTo(750, 420); ctx.lineTo(745, 425); ctx.stroke();
      
      ctx.fillStyle = ink; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'center';
      ctx.fillText('Time Spent Building', 415, 470);
      
      ctx.save(); ctx.translate(30, 250); ctx.rotate(-Math.PI / 2); ctx.fillText('Confidence Level', 0, 0); ctx.restore();
      
      ctx.font = '12px Courier New';
      for (let i = 0; i <= 5; i++) { const y = 420 - i * 64; ctx.fillText((i * 20) + '%', 60, y + 5); }
      ctx.fillText('1h', 186, 445); ctx.fillText('3h', 319, 445); ctx.fillText('6h', 452, 445); ctx.fillText('12h', 585, 445); ctx.fillText('20h+', 718, 445);
    }

    function getCurvePoint(t) {
      const p0 = {x: 80, y: 420}; const p1 = {x: 186, y: 150}; const p2 = {x: 319, y: 120}; const p3 = {x: 452, y: 380}; const p4 = {x: 585, y: 200}; const p5 = {x: 718, y: 180};
      if (t <= 0.2) { const localT = t / 0.2; return bezier(p0, p1, p2, localT); }
      else if (t <= 0.4) { const localT = (t - 0.2) / 0.2; return bezier(p2, p3, p4, localT); }
      else { const localT = (t - 0.4) / 0.6; return bezier(p4, p5, p5, localT); }
    }

    function bezier(p0, p1, p2, t) {
      const x = (1-t)*(1-t)*p0.x + 2*(1-t)*t*p1.x + t*t*p2.x;
      const y = (1-t)*(1-t)*p0.y + 2*(1-t)*t*p1.y + t*t*p2.y; return {x, y};
    }

    function drawCurve() {
      ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.beginPath();
      const steps = 100; const currentSteps = Math.floor(steps * progress);
      for (let i = 0; i <= currentSteps; i++) {
        const t = i / steps; const point = getCurvePoint(t);
        if (i === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
      if (progress > 0) {
        const currentPoint = getCurvePoint(progress);
        ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(currentPoint.x, currentPoint.y, 6, 0, Math.PI * 2); ctx.fill();
      }
    }

    function drawLabels() {
      if (progress < 0.3) return;
      ctx.fillStyle = gold; ctx.font = 'bold 16px Courier New'; ctx.textAlign = 'left'; ctx.fillText('Mount Stupid', 300, 80);
      ctx.strokeStyle = gold; ctx.lineWidth = 2; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(340, 90); ctx.lineTo(319, 120); ctx.stroke(); ctx.setLineDash([]);
      
      if (progress < 0.5) return;
      ctx.fillStyle = ink; ctx.font = 'bold 16px Courier New'; ctx.fillText('Valley of Actually', 480, 320); ctx.fillText('Talking to Users', 480, 340);
      ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(480, 330); ctx.lineTo(452, 380); ctx.stroke();
    }

    function draw() {
      ctx.fillStyle = parchment; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink; ctx.font = 'bold 24px Courier New'; ctx.textAlign = 'center'; ctx.fillText('The Confidence Gap', 400, 40);
      drawGrid(); drawAxes(); drawCurve(); drawLabels();
    }

    function animate() {
      if (progress < 1) { progress += 0.005; draw(); animationId = requestAnimationFrame(animate); }
      else { progress = 1; draw(); }
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { animate(); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(canvas);

    const handleClick = () => { cancelAnimationFrame(animationId); progress = 0; animate(); };
    canvas.addEventListener('click', handleClick);

    return () => { cancelAnimationFrame(animationId); canvas.removeEventListener('click', handleClick); observer.disconnect(); };
  },[]);

  return (
    <div style={{ margin: '2.5rem 0', textAlign: 'center' }}>
      <canvas ref={canvasRef} width={800} height={600} style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer' }} />
      <button onClick={() => canvasRef.current?.click()} style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.75rem', background: 'var(--bg-card, #1a1a1a)', border: '1px solid var(--border, #2a2a2a)', borderRadius: '4px', padding: '0.35rem 1rem', cursor: 'pointer', transition: 'all 0.2s' }}>Replay</button>
    </div>
  );
}
