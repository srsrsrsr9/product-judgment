import { useEffect, useRef } from 'react';

export default function TheIcebergInterview() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const parchment = '#FAFAF7';
    const ink = '#1C1C1C';
    const blue = '#3A5F7D';
    const gold = '#C28E2C';

    let progress = 0; let phase = 0;
    let animationId;

    const layers =[
      { text: '"I use WhatsApp to track everything. It\'s fine."', y: 180, minute: 5, opacity: 0, isSurface: true },
      { text: '"Actually, I spend 2 hours a day on health admin"', y: 260, minute: 12, opacity: 0, isSurface: false },
      { text: '"I\'ve tried 5 apps. I abandoned all of them."', y: 340, minute: 18, opacity: 0, isSurface: false },
      { text: '"I\'m terrified of forgetting something"', y: 420, minute: 22, opacity: 0, isSurface: false },
      { text: '"What happens to my family when I\'m gone?"', y: 500, minute: 25, opacity: 0, isSurface: false, isDeep: true }
    ];

    function drawWaterline() {
      ctx.strokeStyle = blue; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(50, 220); ctx.lineTo(850, 220); ctx.stroke();
      ctx.fillStyle = 'rgba(58, 95, 125, 0.1)'; ctx.fillRect(50, 220, 800, 480);
      ctx.strokeStyle = blue; ctx.lineWidth = 2; ctx.beginPath();
      for (let x = 50; x <= 850; x += 10) { const y = 220 + Math.sin((x + progress * 2) * 0.02) * 5; if (x === 50) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke();
      ctx.fillStyle = ink; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'left'; ctx.fillText('ABOVE WATER', 50, 200); ctx.fillText('(Surface answers)', 50, 215);
      ctx.fillStyle = blue; ctx.fillText('BELOW WATER', 50, 240); ctx.fillText('(Real truth)', 50, 255);
    }

    function drawIceberg() {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; ctx.strokeStyle = ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(250, 220); ctx.lineTo(180, 120); ctx.lineTo(220, 80); ctx.lineTo(280, 100); ctx.lineTo(320, 140); ctx.lineTo(250, 220); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(58, 95, 125, 0.15)'; ctx.beginPath(); ctx.moveTo(250, 220); ctx.lineTo(120, 600); ctx.lineTo(380, 600); ctx.lineTo(250, 220); ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    function drawSpeechBubble(layer) {
      const x = 650; const y = layer.y; const width = 440; const height = 50;
      ctx.save(); ctx.globalAlpha = layer.opacity;
      ctx.fillStyle = layer.isSurface ? '#FFFFFF' : (layer.isDeep ? 'rgba(194, 142, 44, 0.1)' : 'rgba(255, 255, 255, 0.9)');
      ctx.strokeStyle = layer.isDeep ? gold : ink; ctx.lineWidth = layer.isDeep ? 3 : 2;
      ctx.beginPath(); ctx.roundRect(x - width/2, y - height/2, width, height, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = layer.isDeep ? gold : ink; ctx.font = layer.isDeep ? 'bold 15px Courier New' : 'bold 14px Courier New'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(layer.text, x, y);
      ctx.textAlign = 'right'; ctx.fillStyle = layer.isDeep ? gold : blue; ctx.font = 'bold 12px Courier New'; ctx.fillText(`Minute ${layer.minute}`, x + width/2 - 10, y - height/2 + 15); ctx.textAlign = 'center';
      if (!layer.isSurface) { ctx.strokeStyle = layer.isDeep ? gold : blue; ctx.lineWidth = 1; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(350, y); ctx.lineTo(x - width/2, y); ctx.stroke(); ctx.setLineDash([]); }
      ctx.restore();
    }

    function drawInterviewer() {
      const x = 100; const y = 350; ctx.save(); const silenceOpacity = Math.min(1, progress / 100); ctx.globalAlpha = silenceOpacity * 0.3; ctx.strokeStyle = gold; ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) { const radius = 30 + i * 20 + Math.sin(progress * 0.05) * 5; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.stroke(); }
      ctx.globalAlpha = Math.min(1, progress / 50); ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, 25, 35, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x - 5, y, 15, 20, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = ink; ctx.font = 'bold 12px Courier New'; ctx.textAlign = 'center'; ctx.fillText('INTERVIEWER', x, y + 55); ctx.fillText('(silence)', x, y + 70); ctx.restore();
    }

    function draw() {
      ctx.fillStyle = parchment; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink; ctx.font = 'bold 24px Courier New'; ctx.textAlign = 'center'; ctx.fillText('The Iceberg Interview', 450, 50);
      drawIceberg(); drawWaterline(); drawInterviewer();
      layers.forEach((layer, index) => { const triggerPoint = index * 60; if (progress > triggerPoint) { layer.opacity = Math.min(1, (progress - triggerPoint) / 40); } drawSpeechBubble(layer); });
      if (progress > 300) { ctx.fillStyle = ink; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'center'; ctx.fillText('Deep insight emerges at minute 25 — never in the first 10', 450, 650); }
    }

    function animate() {
      progress++;
      if (progress > 50 && phase === 0) phase = 1; if (progress > 200 && phase === 1) phase = 2; if (progress > 350 && phase === 2) phase = 3;
      draw();
      if (progress < 400) { animationId = requestAnimationFrame(animate); }
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { animate(); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(canvas);

    const handleClick = () => { cancelAnimationFrame(animationId); progress = 0; phase = 0; layers.forEach(l => l.opacity = 0); animate(); };
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
