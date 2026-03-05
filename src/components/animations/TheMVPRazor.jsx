import { useEffect, useRef } from 'react';

export default function TheMVPRazor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const parchment = '#FAFAF7';
    const ink = '#1C1C1C';
    const gold = '#C28E2C';
    const blue = '#3A5F7D';

    let progress = 0; let phase = 0;
    let animationId;

    const features =[
      { name: 'AI visit briefing', testsHypothesis: true }, { name: 'Post-visit tasks', testsHypothesis: true }, { name: 'Prescription OCR', testsHypothesis: true }, { name: 'Family profile', testsHypothesis: true }, { name: 'Task tracker', testsHypothesis: true },
      { name: 'Medication reminders', testsHypothesis: false }, { name: 'Doctor discovery', testsHypothesis: false }, { name: 'Multi-user sharing', testsHypothesis: false }, { name: 'Health dashboard', testsHypothesis: false }, { name: 'Symptom checker', testsHypothesis: false },
      { name: 'Chat between family', testsHypothesis: false }, { name: 'Appointment booking', testsHypothesis: false }, { name: 'ABHA integration', testsHypothesis: false }, { name: 'Analytics', testsHypothesis: false }, { name: 'Settings page', testsHypothesis: false }
    ];

    function initFeatures() {
      features.forEach((f, i) => {
        f.x = 450; f.y = 150 + i * 15;
        const pileIndex = features.filter(other => other.testsHypothesis === f.testsHypothesis && features.indexOf(other) < i).length;
        if (f.testsHypothesis) { f.targetX = 250; f.targetY = 300 + pileIndex * 45; }
        else { const col = Math.floor(pileIndex / 5); const row = pileIndex % 5; f.targetX = 550 + col * 180; f.targetY = 300 + row * 45; }
        f.currentX = f.x; f.currentY = f.y; f.opacity = 1; f.sorted = false;
      });
    }
    initFeatures();

    function drawCard(feature, x, y, alpha) {
      ctx.save(); ctx.globalAlpha = alpha; const width = 160; const height = 40;
      ctx.fillStyle = feature.testsHypothesis ? 'rgba(194, 142, 44, 0.2)' : 'rgba(58, 95, 125, 0.15)'; ctx.fillRect(x - width/2, y - height/2, width, height);
      ctx.strokeStyle = feature.testsHypothesis ? gold : blue; ctx.lineWidth = feature.testsHypothesis ? 3 : 2; ctx.strokeRect(x - width/2, y - height/2, width, height);
      ctx.fillStyle = ink; ctx.font = 'bold 12px Courier New'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const words = feature.name.split(' ');
      if (words.length > 1 && feature.name.length > 15) { const mid = Math.ceil(words.length/2); ctx.fillText(words.slice(0, mid).join(' '), x, y - 6); ctx.fillText(words.slice(mid).join(' '), x, y + 6); }
      else { ctx.fillText(feature.name, x, y); }
      ctx.font = 'bold 14px Arial'; ctx.fillStyle = feature.testsHypothesis ? gold : blue; ctx.fillText(feature.testsHypothesis ? '✓' : '✗', x + width/2 - 15, y - height/2 + 12); ctx.restore();
    }

    function drawRazor(x, y, angle) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
      ctx.fillStyle = '#C0C0C0'; ctx.fillRect(-60, -15, 120, 30);
      ctx.fillStyle = '#E8E8E8'; ctx.beginPath(); ctx.moveTo(-60, 15); ctx.lineTo(60, 15); ctx.lineTo(0, 25); ctx.closePath(); ctx.fill();
      ctx.fillStyle = ink; ctx.fillRect(-80, -10, 20, 20);
      ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-50, -5); ctx.lineTo(50, -5); ctx.stroke(); ctx.restore();
    }

    function drawPileLabel(x, y, label, count, color, isGlowing) {
      ctx.save(); if (isGlowing) { ctx.shadowColor = color; ctx.shadowBlur = 20; }
      ctx.fillStyle = color; ctx.font = 'bold 18px Courier New'; ctx.textAlign = 'center'; ctx.fillText(label, x, y);
      ctx.font = 'bold 14px Courier New'; ctx.fillText(`${count} features`, x, y + 20);
      ctx.font = 'bold 12px Courier New'; if (isGlowing) { ctx.fillText('(This is your MVP)', x, y + 40); } else { ctx.fillText('(This is your roadmap)', x, y + 40); } ctx.restore();
    }

    function draw() {
      ctx.fillStyle = parchment; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink; ctx.font = 'bold 24px Courier New'; ctx.textAlign = 'center'; ctx.fillText('The MVP Razor', 450, 50);
      ctx.font = 'bold 14px Courier New'; ctx.fillText('Does this test the hypothesis?', 450, 80);
      if (phase === 0) { features.forEach((f, i) => { const offset = Math.sin(progress * 0.05 + i * 0.5) * 2; drawCard(f, f.x + offset, f.y, 1); }); }
      else if (phase === 1) {
        const razorX = 100 + (progress - 50) * 8; const razorY = 250; const razorAngle = Math.sin(progress * 0.1) * 0.1; drawRazor(razorX, razorY, razorAngle);
        features.forEach(f => { const shake = razorX > f.x - 100 ? Math.random() * 4 - 2 : 0; drawCard(f, f.x + shake, f.y, 1); });
      } else if (phase >= 2) {
        features.forEach(f => {
          if (!f.sorted && phase === 2) { const dx = f.targetX - f.currentX; const dy = f.targetY - f.currentY; f.currentX += dx * 0.1; f.currentY += dy * 0.1; if (Math.abs(dx) < 1 && Math.abs(dy) < 1) f.sorted = true; }
          drawCard(f, f.currentX, f.currentY, 1);
        });
        const buildCount = features.filter(f => f.testsHypothesis).length; const laterCount = features.filter(f => !f.testsHypothesis).length;
        if (progress > 180) { drawPileLabel(250, 600, 'BUILD', buildCount, gold, true); drawPileLabel(640, 600, 'LATER', laterCount, blue, false); }
        if (progress > 220) { ctx.fillStyle = ink; ctx.font = 'bold 16px Courier New'; ctx.textAlign = 'center'; ctx.fillText(`The LATER pile is ${Math.round(laterCount/buildCount)}x the size of the BUILD pile`, 450, 680); }
      }
    }

    function animate() {
      progress++; if (progress > 50 && phase === 0) phase = 1; if (progress > 150 && phase === 1) phase = 2; if (progress > 250 && phase === 2) phase = 3;
      draw(); if (progress < 300) { animationId = requestAnimationFrame(animate); }
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { animate(); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(canvas);

    const handleClick = () => { cancelAnimationFrame(animationId); progress = 0; phase = 0; initFeatures(); animate(); };
    canvas.addEventListener('click', handleClick);

    return () => { cancelAnimationFrame(animationId); canvas.removeEventListener('click', handleClick); observer.disconnect(); };
  },[]);

  return (
    <div style={{ margin: '2.5rem 0', textAlign: 'center' }}>
      <canvas ref={canvasRef} width={900} height={750} style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer' }} />
      <button onClick={() => canvasRef.current?.click()} style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.75rem', background: 'var(--bg-card, #1a1a1a)', border: '1px solid var(--border, #2a2a2a)', borderRadius: '4px', padding: '0.35rem 1rem', cursor: 'pointer', transition: 'all 0.2s' }}>Replay</button>
    </div>
  );
}
