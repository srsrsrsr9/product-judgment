import { useEffect, useRef } from 'react';

export default function FeaturitisSpiral() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const white = '#FFFFFF';
    const blue = '#3A5F7D';
    const gold = '#C28E2C';
    const ink = '#1C1C1C';
    const parchment = '#FAFAF7';

    let phase = 0;
    let frame = 0;
    let clutterLevel = 0;
    let animationId;

    const features =[
      { name: 'sidebar', draw: (ctx, x, y, scale) => { ctx.fillStyle = blue; ctx.fillRect(x - 120 * scale, y - 100 * scale, 40 * scale, 200 * scale); ctx.fillStyle = white; for (let i = 0; i < 5; i++) { ctx.fillRect(x - 115 * scale, y - 80 * scale + i * 30 * scale, 30 * scale, 4 * scale); } }},
      { name: 'notification', draw: (ctx, x, y, scale) => { ctx.fillStyle = '#E74C3C'; ctx.beginPath(); ctx.arc(x + 80 * scale, y - 80 * scale, 15 * scale, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = white; ctx.font = `bold ${12 * scale}px Arial`; ctx.textAlign = 'center'; ctx.fillText('3', x + 80 * scale, y - 76 * scale); }},
      { name: 'settings', draw: (ctx, x, y, scale) => { ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x + 100 * scale, y + 60 * scale, 12 * scale, 0, Math.PI * 2); ctx.stroke(); for (let i = 0; i < 8; i++) { const angle = (i / 8) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(x + 100 * scale + Math.cos(angle) * 15 * scale, y + 60 * scale + Math.sin(angle) * 15 * scale); ctx.lineTo(x + 100 * scale + Math.cos(angle) * 20 * scale, y + 60 * scale + Math.sin(angle) * 20 * scale); ctx.stroke(); } }},
      { name: 'chatbot', draw: (ctx, x, y, scale) => { ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(x + 90 * scale, y + 90 * scale, 20 * scale, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = white; ctx.fillRect(x + 82 * scale, y + 85 * scale, 4 * scale, 4 * scale); ctx.fillRect(x + 90 * scale, y + 85 * scale, 4 * scale, 4 * scale); ctx.fillRect(x + 98 * scale, y + 95 * scale, 8 * scale, 2 * scale); }},
      { name: 'tabs', draw: (ctx, x, y, scale) => { ctx.fillStyle = '#E5E5E5'; ctx.fillRect(x - 80 * scale, y - 130 * scale, 160 * scale, 25 * scale); ctx.fillStyle = white; ctx.fillRect(x - 75 * scale, y - 128 * scale, 40 * scale, 23 * scale); ctx.fillStyle = ink; ctx.font = `bold ${10 * scale}px Arial`; ctx.fillText('Tab 1', x - 55 * scale, y - 112 * scale); ctx.fillText('Tab 2', x - 15 * scale, y - 112 * scale); ctx.fillText('Tab 3', x + 25 * scale, y - 112 * scale); }},
      { name: 'floating', draw: (ctx, x, y, scale) => { ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(x - 100 * scale, y + 80 * scale, 25 * scale, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = white; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 100 * scale, y + 70 * scale); ctx.lineTo(x - 100 * scale, y + 90 * scale); ctx.moveTo(x - 110 * scale, y + 80 * scale); ctx.lineTo(x - 90 * scale, y + 80 * scale); ctx.stroke(); }}
    ];

    function drawAppScreen(x, y, scale, clutter) {
      ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.strokeRect(x - 100 * scale, y - 150 * scale, 200 * scale, 300 * scale);
      ctx.fillStyle = white; ctx.fillRect(x - 95 * scale, y - 145 * scale, 190 * scale, 290 * scale);
      ctx.fillStyle = blue; ctx.fillRect(x - 95 * scale, y - 145 * scale, 190 * scale, 40 * scale);
      if (clutter < 6) { ctx.fillStyle = '#F0F0F0'; ctx.fillRect(x - 75 * scale, y - 90 * scale, 150 * scale, 60 * scale); ctx.fillRect(x - 75 * scale, y - 20 * scale, 150 * scale, 60 * scale); ctx.fillRect(x - 75 * scale, y + 50 * scale, 150 * scale, 60 * scale); }
      const activeFeatures = Math.min(Math.floor(clutter), features.length);
      for (let i = 0; i < activeFeatures; i++) { features[i].draw(ctx, x, y, scale * (1 - i * 0.05)); }
      const avatarScale = scale * (1 - clutter * 0.08);
      ctx.fillStyle = '#DDD'; ctx.beginPath(); ctx.arc(x, y + 180 * scale, 20 * avatarScale, 0, Math.PI * 2); ctx.fill();
      if (clutter > 2) { ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.font = `bold ${12 * avatarScale}px Arial`; ctx.fillStyle = ink; ctx.fillText('?', x - 8 * avatarScale, y + 175 * scale); ctx.fillText('?', x + 2 * avatarScale, y + 175 * scale); ctx.beginPath(); ctx.arc(x, y + 185 * scale, 8 * avatarScale, 0, Math.PI); ctx.stroke(); }
    }

    function draw() {
      ctx.fillStyle = parchment; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink; ctx.font = 'bold 24px Courier New'; ctx.textAlign = 'center'; ctx.fillText('The Featuritis Spiral', 400, 40);
      drawAppScreen(400, 350, 1.2, clutterLevel);
      if (clutterLevel >= 6 && phase === 1) { ctx.fillStyle = ink; ctx.font = 'bold 16px Courier New'; ctx.fillText('User leaves...', 600, 480); ctx.fillText('Features remain', 600, 500); ctx.fillText('talking to each other', 600, 520); }
      if (phase === 2) { ctx.strokeStyle = gold; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(650, 300); ctx.lineTo(650, 400); ctx.stroke(); ctx.beginPath(); ctx.moveTo(640, 310); ctx.lineTo(650, 300); ctx.lineTo(660, 310); ctx.stroke(); ctx.fillStyle = gold; ctx.font = 'bold 16px Courier New'; ctx.fillText('Strip it back', 650, 280); }
      if (phase === 3 && clutterLevel <= 0.5) { ctx.fillStyle = gold; ctx.font = 'bold 20px Courier New'; ctx.fillText(':) User returns!', 600, 400); }
      ctx.fillStyle = ink; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'left';
      if (phase === 0) ctx.fillText('Sprint ' + Math.floor(clutterLevel + 1) + ': Adding features...', 50, 650); else if (phase === 1) ctx.fillText('Maximum clutter reached', 50, 650); else if (phase === 2) ctx.fillText('Removing features...', 50, 650); else ctx.fillText('Clean and focused', 50, 650);
    }

    function animate() {
      frame++;
      if (phase === 0) { clutterLevel += 0.02; if (clutterLevel >= 6) { clutterLevel = 6; phase = 1; setTimeout(() => { phase = 2; }, 2000); } }
      else if (phase === 2) { clutterLevel -= 0.05; if (clutterLevel <= 0) { clutterLevel = 0; phase = 3; } }
      draw();
      if (phase !== 3 || clutterLevel > 0) { animationId = requestAnimationFrame(animate); } else { draw(); }
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { animate(); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(canvas);

    const handleClick = () => { cancelAnimationFrame(animationId); phase = 0; frame = 0; clutterLevel = 0; animate(); };
    canvas.addEventListener('click', handleClick);

    return () => { cancelAnimationFrame(animationId); canvas.removeEventListener('click', handleClick); observer.disconnect(); };
  },[]);

  return (
    <div style={{ margin: '2.5rem 0', textAlign: 'center' }}>
      <canvas ref={canvasRef} width={800} height={700} style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer' }} />
      <button onClick={() => canvasRef.current?.click()} style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.75rem', background: 'var(--bg-card, #1a1a1a)', border: '1px solid var(--border, #2a2a2a)', borderRadius: '4px', padding: '0.35rem 1rem', cursor: 'pointer', transition: 'all 0.2s' }}>Replay</button>
    </div>
  );
}
