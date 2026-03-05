import { useEffect, useRef } from 'react';

export default function TheReworkCascade() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const parchment = '#FAFAF7';
    const ink = '#1C1C1C';
    const teal = '#0F766E';
    const green = '#059669';
    const red = '#8B3A3A';

    let progress = 0; let phase = 0;
    let animationId;

    const stages =[
      { name: 'Paper', x: 100, cost: '5 min', color: green },
      { name: 'Mockup', x: 250, cost: '30 min', color: green },
      { name: 'Code', x: 400, cost: '4-8 hrs', color: teal },
      { name: 'Test', x: 550, cost: '1-3 days', color: teal },
      { name: 'Launch', x: 700, cost: '1-3 weeks', color: red }
    ];

    function drawStage(stage, index, isActive) {
      const y = 200; const width = 120; const height = 80;
      if (index < stages.length - 1) { const next = stages[index + 1]; ctx.strokeStyle = '#9CA3AF'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(stage.x, y); ctx.lineTo(next.x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(next.x - width/2 - 10, y - 5); ctx.lineTo(next.x - width/2, y); ctx.lineTo(next.x - width/2 - 10, y + 5); ctx.stroke(); }
      ctx.fillStyle = parchment; ctx.fillRect(stage.x - width/2, y - height/2, width, height);
      ctx.fillStyle = isActive ? stage.color : '#D1D5DB'; ctx.globalAlpha = isActive ? 0.3 : 0.1; ctx.fillRect(stage.x - width/2, y - height/2, width, height); ctx.globalAlpha = 1;
      ctx.strokeStyle = isActive ? stage.color : '#9CA3AF'; ctx.lineWidth = isActive ? 3 : 2; ctx.strokeRect(stage.x - width/2, y - height/2, width, height);
      ctx.fillStyle = ink; ctx.font = `bold ${isActive ? 16 : 14}px Courier New`; ctx.textAlign = 'center'; ctx.fillText(stage.name, stage.x, y - 10);
      ctx.font = `bold ${isActive ? 14 : 12}px Courier New`; ctx.fillText(stage.cost, stage.x, y + 15);
    }

    function drawMistake(stageIndex, size, alpha) { const stage = stages[stageIndex]; const x = stage.x; const y = 200; ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = red; ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill(); if (size > 10) { ctx.strokeStyle = red; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, size + 10, 0, Math.PI * 2); ctx.stroke(); } ctx.restore(); }

    function drawFixFlash(stageIndex, alpha) { const stage = stages[stageIndex]; ctx.save(); ctx.globalAlpha = alpha * 0.4; ctx.fillStyle = green; ctx.fillRect(stage.x - 60, 160, 120, 80); ctx.restore(); ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = green; ctx.font = 'bold 16px Courier New'; ctx.textAlign = 'center'; ctx.fillText('FIXED', stage.x, 180); ctx.restore(); }

    function drawCascade(stageIndex, intensity) {
      const stage = stages[stageIndex]; ctx.save(); ctx.globalAlpha = intensity * 0.4; ctx.fillStyle = red; for (let i = 0; i < 3; i++) { const radius = 20 + i * 15 + intensity * 30; ctx.beginPath(); ctx.arc(stage.x, 200, radius, 0, Math.PI * 2); ctx.fill(); } ctx.restore();
      if (stageIndex >= 2 && stageIndex < 4) { ctx.save(); ctx.globalAlpha = intensity; ctx.strokeStyle = red; ctx.lineWidth = 2; const figureX = stage.x + 40; const figureY = 280; ctx.beginPath(); ctx.arc(figureX, figureY - 30, 10, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(figureX, figureY - 20); ctx.lineTo(figureX, figureY + 10); ctx.stroke(); ctx.beginPath(); ctx.moveTo(figureX - 15, figureY - 5); ctx.lineTo(figureX + 15, figureY - 5); ctx.stroke(); ctx.fillStyle = red; ctx.font = 'bold 18px Arial'; ctx.fillText('?', figureX - 5, figureY - 32); ctx.restore(); }
      if (stageIndex === 4) { ctx.save(); ctx.globalAlpha = intensity; ctx.fillStyle = red; for (let i = 0; i < 5; i++) { const ticketX = stage.x - 30 + i * 20; const ticketY = 280 + Math.sin(progress * 0.1 + i) * 15; ctx.fillRect(ticketX, ticketY, 15, 20); ctx.strokeStyle = ink; ctx.strokeRect(ticketX, ticketY, 15, 20); } ctx.restore(); }
    }

    function draw() {
      ctx.fillStyle = parchment; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink; ctx.font = 'bold 24px Courier New'; ctx.textAlign = 'center'; ctx.fillText('The Rework Cascade', 450, 50); ctx.font = 'bold 14px Courier New'; ctx.fillText('A design mistake caught at each stage', 450, 80);
      if (phase >= 4) { if (phase === 4) drawCascade(2, (progress - 150) / 50); if (phase === 6) drawCascade(3, (progress - 230) / 50); if (phase === 8) drawCascade(4, (progress - 310) / 50); if (phase === 9) drawCascade(4, 1); }
      stages.forEach((stage, index) => { const isActive = phase >= index; drawStage(stage, index, isActive); });
      if (phase === 0) { const size = Math.min(5, progress / 10); drawMistake(0, size, 1); }
      else if (phase === 1) { drawMistake(0, 5, 0.5); const flashAlpha = Math.max(0, 1 - (progress - 50) / 30); drawFixFlash(0, flashAlpha); }
      else if (phase === 2) { const size = 5 + (progress - 80) / 5; drawMistake(1, size, 1); }
      else if (phase === 3) { drawMistake(1, 15, 0.5); const flashAlpha = Math.max(0, 1 - (progress - 120) / 30); drawFixFlash(1, flashAlpha); }
      else if (phase === 4) { const size = 15 + (progress - 150) / 3; drawMistake(2, size, 1); }
      else if (phase === 5) { drawMistake(2, 30, 0.5); const flashAlpha = Math.max(0, 1 - (progress - 200) / 30); drawFixFlash(2, flashAlpha); ctx.fillStyle = teal; ctx.font = 'bold 14px Courier New'; ctx.fillText('2 engineers', 400, 320); ctx.fillText('rebuilding...', 400, 335); }
      else if (phase === 6) { const size = 30 + (progress - 230) / 2; drawMistake(3, size, 1); }
      else if (phase === 7) { drawMistake(3, 50, 0.5); const flashAlpha = Math.max(0, 1 - (progress - 280) / 30); drawFixFlash(3, flashAlpha); ctx.fillStyle = red; ctx.font = 'bold 14px Courier New'; ctx.fillText('User confused', 550, 320); }
      else if (phase === 8) { const size = 50 + (progress - 310) / 2; drawMistake(4, size, 1); }
      else if (phase === 9) { drawMistake(4, 80, 0.5); ctx.save(); ctx.translate(700, 320); ctx.rotate(progress * 0.1); ctx.fillStyle = red; ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -20); ctx.moveTo(0, 0); ctx.lineTo(15, 0); ctx.stroke(); ctx.restore(); if (progress > 380) { ctx.fillStyle = green; ctx.font = 'bold 18px Courier New'; ctx.textAlign = 'center'; ctx.fillText('Fix it on paper.', 450, 520); ctx.fillText('The paper doesn\'t have users.', 450, 545); } }
    }

    function animate() {
      progress++; if (progress > 50 && phase === 0) phase = 1; if (progress > 80 && phase === 1) phase = 2; if (progress > 120 && phase === 2) phase = 3; if (progress > 150 && phase === 3) phase = 4; if (progress > 200 && phase === 4) phase = 5; if (progress > 230 && phase === 5) phase = 6; if (progress > 280 && phase === 6) phase = 7; if (progress > 310 && phase === 7) phase = 8; if (progress > 350 && phase === 8) phase = 9; draw();
      if (progress < 420) { animationId = requestAnimationFrame(animate); }
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
