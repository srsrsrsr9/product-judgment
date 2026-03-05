import { useEffect, useRef } from 'react';

export default function TheCapabilityTrap() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const parchment = '#FAFAF7';
    const ink = '#1C1C1C';
    const green = '#059669';
    const amber = '#B45309'; // Darkened from D97706 for contrast
    const red = '#DC2626';
    const gold = '#B47B20'; // Darkened

    let progress = 0;
    let needlePosition = 0;
    let animationId;

    function drawDial() {
      const centerX = 450; const centerY = 250; const radius = 180;
      ctx.beginPath(); ctx.arc(centerX, centerY, radius, Math.PI * 0.8, Math.PI * 1.0); ctx.lineWidth = 40; ctx.strokeStyle = green; ctx.stroke();
      ctx.beginPath(); ctx.arc(centerX, centerY, radius, Math.PI * 1.0, Math.PI * 1.2); ctx.lineWidth = 40; ctx.strokeStyle = amber; ctx.stroke();
      ctx.beginPath(); ctx.arc(centerX, centerY, radius, Math.PI * 1.2, Math.PI * 1.4); ctx.lineWidth = 40; ctx.strokeStyle = red; ctx.stroke();
      ctx.beginPath(); ctx.arc(centerX, centerY, radius - 40, Math.PI * 0.8, Math.PI * 1.4); ctx.lineWidth = 2; ctx.strokeStyle = ink; ctx.stroke();
      ctx.fillStyle = ink; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'center';
      ctx.fillText('NARROW & SAFE', centerX - 240, centerY + 30); ctx.font = 'bold 12px Courier New'; ctx.fillText('Limited scope', centerX - 240, centerY + 45); ctx.fillText('Clear boundaries', centerX - 240, centerY + 60);
      ctx.font = 'bold 14px Courier New'; ctx.fillText('USEFUL & BOUNDED', centerX, centerY + 100); ctx.font = 'bold 12px Courier New'; ctx.fillText('Core value delivered', centerX, centerY + 115); ctx.fillText('Risk managed', centerX, centerY + 130);
      ctx.font = 'bold 14px Courier New'; ctx.fillText('EVERYTHING', centerX + 240, centerY + 30); ctx.fillText('IT CAN DO', centerX + 240, centerY + 45); ctx.font = 'bold 12px Courier New'; ctx.fillText('Capability', centerX + 240, centerY + 65); ctx.fillText('without judgment', centerX + 240, centerY + 80);
      ctx.fillStyle = ink; ctx.font = 'bold 18px Courier New'; ctx.fillText('AI SCOPE', centerX, centerY - 210);
    }

    function drawNeedle(position) {
      const centerX = 450; const centerY = 250; const radius = 180;
      const startAngle = Math.PI * 0.8; const endAngle = Math.PI * 1.4; const angle = startAngle + (endAngle - startAngle) * position;
      const needleLength = radius - 15; const needleX = centerX + Math.cos(angle) * needleLength; const needleY = centerY + Math.sin(angle) * needleLength;
      ctx.strokeStyle = ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.lineTo(needleX, needleY); ctx.stroke();
      ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(centerX, centerY, 8, 0, Math.PI * 2); ctx.fill();
      let zoneColor; if (position < 0.33) zoneColor = green; else if (position < 0.66) zoneColor = amber; else zoneColor = red;
      ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = zoneColor; ctx.beginPath(); ctx.arc(centerX, centerY, 20, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }

    function drawCurves() {
      const startX = 150; const baseY = 600;
      ctx.strokeStyle = gold; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(startX, baseY);
      for (let x = 0; x <= 600; x += 5) { const t = x / 600; let value; if (t < 0.4) { value = t * 2.5; } else { value = 1.0 + (t - 0.4) * 0.2; } const y = baseY - value * 100; ctx.lineTo(startX + x, y); } ctx.stroke();
      ctx.strokeStyle = red; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(startX, baseY);
      for (let x = 0; x <= 600; x += 5) { const t = x / 600; let risk; if (t < 0.3) { risk = t * 0.5; } else { risk = 0.15 + Math.pow((t - 0.3) * 2, 2); } const y = baseY - risk * 100; ctx.lineTo(startX + x, y); } ctx.stroke();
      ctx.fillStyle = gold; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'left'; ctx.fillText('VALUE', startX, baseY - 120);
      ctx.fillStyle = red; ctx.fillText('RISK', startX, baseY - 30);
      const sweetSpotX = startX + 300; const sweetSpotY = baseY - 100;
      ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(sweetSpotX, sweetSpotY, 8, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = ink; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'center'; ctx.fillText('★ SWEET SPOT', sweetSpotX, sweetSpotY - 20);
    }

    function drawWarning(position) {
      if (position > 0.8) {
        ctx.save(); ctx.globalAlpha = (position - 0.8) * 5;
        ctx.fillStyle = red; ctx.font = 'bold 16px Courier New'; ctx.textAlign = 'center';
        ctx.fillText('⚠ DANGER ZONE', 700, 480);
        ctx.font = 'bold 14px Courier New'; ctx.fillText('Risk compounding exponentially', 700, 500);
        ctx.restore();
      }
    }

    function draw() {
      ctx.fillStyle = parchment;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink; ctx.font = 'bold 24px Courier New'; ctx.textAlign = 'center'; ctx.fillText('The Capability Trap', 450, 50);
      drawDial(); drawNeedle(needlePosition); drawCurves(); drawWarning(needlePosition);
      ctx.fillStyle = ink; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'center';
      ctx.fillText('AI value plateaus. AI risk compounds. The sweet spot is narrower than you think.', 450, 670);
    }

    function animate() {
      progress++;
      if (progress < 100) { needlePosition = (progress / 100) * 0.9; }
      else if (progress < 150) { needlePosition = 0.9 + ((progress - 100) / 50) * 0.1; }
      else { needlePosition = 0.5 + Math.sin((progress - 150) * 0.05) * 0.15; }
      draw();
      if (progress < 300) { animationId = requestAnimationFrame(animate); }
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
      <canvas ref={canvasRef} width={900} height={700} style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer' }} />
      <button onClick={() => canvasRef.current?.click()} style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.75rem', background: 'var(--bg-card, #1a1a1a)', border: '1px solid var(--border, #2a2a2a)', borderRadius: '4px', padding: '0.35rem 1rem', cursor: 'pointer', transition: 'all 0.2s' }}>Replay</button>
    </div>
  );
}
