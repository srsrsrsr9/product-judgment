import { useEffect, useRef } from 'react';

export default function TheProblemSpectrum() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const parchment = '#FAFAF7';
    const ink = '#1C1C1C';
    const gold = '#C28E2C';
    const blue = '#3A5F7D';
    const deepRed = '#8B3A3A';
    const paleGray = '#E0E0E0';
    const darkGray = '#555555';

    let progress = 0; let phase = 0;
    let animationId;

    function drawSpectrum() {
      const gradient = ctx.createLinearGradient(100, 0, 800, 0); gradient.addColorStop(0, deepRed); gradient.addColorStop(0.5, '#C28E2C'); gradient.addColorStop(1, paleGray);
      ctx.fillStyle = gradient; ctx.fillRect(100, 200, 700, 60); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.strokeRect(100, 200, 700, 60);
      ctx.fillStyle = ink; ctx.font = 'bold 16px Courier New'; ctx.textAlign = 'center'; ctx.fillText('HAIR ON FIRE', 150, 180); ctx.fillText('MILD ITCH', 850, 180);
      ctx.font = 'bold 13px Courier New'; ctx.fillStyle = deepRed; ctx.textAlign = 'left'; ctx.fillText('People spending money, time, emotional energy', 100, 300); ctx.fillText('Cobbled workarounds. Lose sleep over it.', 100, 315);
      ctx.fillStyle = darkGray; ctx.textAlign = 'right'; ctx.fillText('People have noticed this is annoying', 800, 300); ctx.fillText('They\'ve adapted. "Yeah, not great."', 800, 315);
    }

    function drawWorkaroundIcons(x, y, scale, alpha) {
      ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = blue; ctx.lineWidth = 2;
      ctx.fillStyle = '#DDD'; ctx.fillRect(x - 30*scale, y - 10*scale, 60*scale, 20*scale); ctx.strokeRect(x - 30*scale, y - 10*scale, 60*scale, 20*scale);
      ctx.beginPath(); ctx.moveTo(x - 20*scale, y - 5*scale); ctx.lineTo(x - 10*scale, y + 5*scale); ctx.moveTo(x, y - 5*scale); ctx.lineTo(x + 10*scale, y + 5*scale); ctx.stroke();
      ctx.restore();
    }

    function drawProblemDot(x, y, intensity, label) {
      const size = 20 + intensity * 15; const color = intensity > 0.7 ? deepRed : (intensity > 0.4 ? '#C28E2C' : darkGray);
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.arc(x, y, size + 10 + Math.sin(progress * 0.1) * 5, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillStyle = ink; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'center'; ctx.fillText(label, x, y - size - 15);
    }

    function drawResearchArrow(fromX, fromY, toX, toY, alpha) {
      ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = gold; ctx.lineWidth = 4; ctx.setLineDash([10, 5]);
      ctx.beginPath(); ctx.moveTo(fromX, fromY); ctx.lineTo(toX, toY); ctx.stroke();
      ctx.setLineDash([]); const angle = Math.atan2(toY - fromY, toX - fromX); ctx.beginPath(); ctx.moveTo(toX, toY); ctx.lineTo(toX - 15 * Math.cos(angle - Math.PI/6), toY - 15 * Math.sin(angle - Math.PI/6)); ctx.lineTo(toX - 15 * Math.cos(angle + Math.PI/6), toY - 15 * Math.sin(angle + Math.PI/6)); ctx.closePath(); ctx.fillStyle = gold; ctx.fill();
      ctx.fillStyle = gold; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'center'; ctx.fillText('RESEARCH', (fromX + toX) / 2, (fromY + toY) / 2 - 15); ctx.fillText('MOVES LEFT', (fromX + toX) / 2, (fromY + toY) / 2); ctx.restore();
    }

    function draw() {
      ctx.fillStyle = parchment; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink; ctx.font = 'bold 24px Courier New'; ctx.textAlign = 'center'; ctx.fillText('The Problem Spectrum', 450, 50);
      drawSpectrum();
      if (phase >= 1) { const initialX = 750; const initialY = 230; drawProblemDot(initialX, initialY, 0.3, 'Initial Hypothesis'); drawWorkaroundIcons(initialX, 360, 0.8, Math.min(1, progress / 50)); }
      if (phase >= 2) { const fromX = 750; const fromY = 120; const toX = 250; const toY = 120; drawResearchArrow(fromX, fromY, toX, toY, Math.min(1, (progress - 100) / 50)); }
      if (phase >= 3) {
        const finalX = 250; const finalY = 230;
        ctx.globalAlpha = Math.max(0, 1 - (progress - 200) / 50); drawProblemDot(750, 230, 0.3, 'Initial Hypothesis'); ctx.globalAlpha = 1;
        const newAlpha = Math.min(1, (progress - 200) / 50); ctx.globalAlpha = newAlpha; drawProblemDot(finalX, finalY, 0.9, 'After Research');
        drawWorkaroundIcons(finalX - 40, 360, 1.2, newAlpha); drawWorkaroundIcons(finalX + 40, 360, 1.0, newAlpha); drawWorkaroundIcons(finalX, 390, 0.9, newAlpha); ctx.globalAlpha = 1;
        ctx.fillStyle = deepRed; ctx.font = 'bold 16px Courier New'; ctx.textAlign = 'center'; ctx.fillText('BUILD HERE', finalX, 480);
        ctx.fillStyle = darkGray; ctx.fillText('DON\'T BUILD HERE', 750, 480); ctx.font = 'bold 12px Courier New'; ctx.fillText('(unless you can move it left)', 750, 495);
      }
    }

    function animate() {
      progress++; if (progress > 50 && phase === 0) phase = 1; if (progress > 150 && phase === 1) phase = 2; if (progress > 250 && phase === 2) phase = 3; draw();
      if (progress < 350) { animationId = requestAnimationFrame(animate); }
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { animate(); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(canvas);

    const handleClick = () => { cancelAnimationFrame(animationId); progress = 0; phase = 0; animate(); };
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
