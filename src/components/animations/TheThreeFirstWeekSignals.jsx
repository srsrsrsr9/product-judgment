import { useEffect, useRef } from 'react';

export default function TheThreeFirstWeekSignals() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const parchment = '#FAFAF7';
    const ink = '#1C1C1C';
    const green = '#059669';
    const amber = '#D97706';
    const red = '#DC2626';
    const blue = '#3A5F7D';

    let progress = 0;
    let animationId;

    const signals =[
      { name: 'ACTIVATION', subtitle: 'First visit cycle complete', target: 90, kill: 50, current: 0, metric: '% of users', description: 'Did they complete the core flow?' },
      { name: 'NORTH STAR MOMENT', subtitle: 'Did the visit feel different?', target: 5, kill: 2, current: 0, metric: 'of 15 users', description: 'Qualitative signal via text', isQualitative: true },
      { name: 'INTENT TO RETURN', subtitle: 'Would they use it again?', target: 70, kill: 40, current: 0, metric: '% who say yes', description: 'Future behavior intent' }
    ];

    function drawGauge(signal, x, y, value) {
      const radius = 80; ctx.beginPath(); ctx.arc(x, y, radius, Math.PI * 0.8, Math.PI * 2.2); ctx.lineWidth = 20; ctx.strokeStyle = '#D1D1D1'; ctx.stroke();
      const killAngle = Math.PI * 0.8 + (Math.PI * 1.4) * (signal.kill / 100); ctx.beginPath(); ctx.arc(x, y, radius, Math.PI * 0.8, killAngle); ctx.strokeStyle = red; ctx.stroke();
      const targetAngle = Math.PI * 0.8 + (Math.PI * 1.4) * (signal.target / 100); ctx.beginPath(); ctx.arc(x, y, radius, killAngle, targetAngle); ctx.strokeStyle = amber; ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, radius, targetAngle, Math.PI * 2.2); ctx.strokeStyle = green; ctx.stroke();
      const angle = Math.PI * 0.8 + (Math.PI * 1.4) * (value / 100); const needleX = x + Math.cos(angle) * (radius - 10); const needleY = y + Math.sin(angle) * (radius - 10);
      ctx.strokeStyle = ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(needleX, needleY); ctx.stroke();
      ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = ink; ctx.font = 'bold 24px Courier New'; ctx.textAlign = 'center'; if (signal.isQualitative) { ctx.fillText(`${Math.round(value/100 * 15)}/15`, x, y + 45); } else { ctx.fillText(`${Math.round(value)}%`, x, y + 45); }
      ctx.font = 'bold 16px Courier New'; ctx.fillText(signal.name, x, y - radius - 35); ctx.font = 'bold 12px Courier New'; ctx.fillStyle = '#555'; ctx.fillText(signal.subtitle, x, y - radius - 15);
      ctx.font = 'bold 12px Courier New'; ctx.fillStyle = blue; ctx.fillText(signal.description, x, y + radius + 40);
      ctx.font = 'bold 11px Courier New'; ctx.fillStyle = red; ctx.fillText(`KILL: ${signal.kill}%`, x - radius - 10, y + radius + 15); ctx.fillStyle = green; ctx.fillText(`TARGET: ${signal.target}%`, x + radius + 10, y + radius + 15);
    }

    function draw() {
      ctx.fillStyle = parchment; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink; ctx.font = 'bold 24px Courier New'; ctx.textAlign = 'center'; ctx.fillText('The Three First-Week Signals', 450, 50); ctx.font = 'bold 14px Courier New'; ctx.fillText('Week 1 Dashboard — What Actually Matters', 450, 75);
      const startX = 180; const gap = 270; const y = 280;
      signals.forEach((signal, index) => { let targetValue; if (index === 0) targetValue = 85; else if (index === 1) targetValue = 5/15 * 100; else targetValue = 65; signal.current += (targetValue - signal.current) * 0.05; drawGauge(signal, startX + index * gap, y, signal.current); });
      if (progress > 100) {
        ctx.fillStyle = ink; ctx.font = 'bold 16px Courier New'; ctx.textAlign = 'center'; ctx.fillText('DECISION MATRIX', 450, 480); const matrixY = 500;
        ctx.fillStyle = green; ctx.fillRect(50, matrixY, 250, 60); ctx.fillStyle = parchment; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'center'; ctx.fillText('ALL GREEN', 175, matrixY + 25); ctx.font = 'bold 12px Courier New'; ctx.fillText('Strong signal. Invest in V1.', 175, matrixY + 45);
        ctx.fillStyle = amber; ctx.fillRect(325, matrixY, 250, 60); ctx.fillStyle = parchment; ctx.font = 'bold 14px Courier New'; ctx.fillText('MIXED', 450, matrixY + 25); ctx.font = 'bold 12px Courier New'; ctx.fillText('Investigate yellow. Fix/retest.', 450, matrixY + 45);
        ctx.fillStyle = red; ctx.fillRect(600, matrixY, 250, 60); ctx.fillStyle = parchment; ctx.font = 'bold 14px Courier New'; ctx.fillText('ANY RED', 725, matrixY + 25); ctx.font = 'bold 12px Courier New'; ctx.fillText('Honest reckoning. Fix/pivot.', 725, matrixY + 45);
      }
      if (progress > 150) { ctx.fillStyle = ink; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'center'; ctx.fillText('Everything else is vanity. These three tell you if you have something.', 450, 620); }
    }

    function animate() {
      progress++; draw();
      if (progress < 250) { animationId = requestAnimationFrame(animate); }
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { animate(); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(canvas);

    const handleClick = () => { cancelAnimationFrame(animationId); progress = 0; signals.forEach(s => s.current = 0); animate(); };
    canvas.addEventListener('click', handleClick);

    return () => { cancelAnimationFrame(animationId); canvas.removeEventListener('click', handleClick); observer.disconnect(); };
  },[]);

  return (
    <div style={{ margin: '2.5rem 0', textAlign: 'center' }}>
      <canvas ref={canvasRef} width={900} height={650} style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer' }} />
      <button onClick={() => canvasRef.current?.click()} style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.75rem', background: 'var(--bg-card, #1a1a1a)', border: '1px solid var(--border, #2a2a2a)', borderRadius: '4px', padding: '0.35rem 1rem', cursor: 'pointer', transition: 'all 0.2s' }}>Replay</button>
    </div>
  );
}
