import { useEffect, useRef } from 'react';

export default function FromGarageToTour() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const parchment = '#FAFAF7';
    const ink = '#1C1C1C';
    const gold = '#C28E2C';
    const fadeGray = '#555555'; // Darkened

    let progress = 0;
    let animationId;

    const stages =[
      { x: 100, label: 'Garage', sublabel: '"I had an idea"', icon: 'guitar' },
      { x: 300, label: 'Forming', sublabel: 'Research & Validation', icon: 'band' },
      { x: 500, label: 'Rehearsal', sublabel: 'Design & Prototyping', icon: 'practice' },
      { x: 700, label: 'First Gig', sublabel: 'MVP Launch', icon: 'gig' },
      { x: 900, label: 'Tour', sublabel: 'Product-Market Fit', icon: 'tour' }
    ];

    function drawIcon(type, x, y, scale, alpha) {
      ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = ink; ctx.lineWidth = 2;
      switch(type) {
        case 'guitar': ctx.beginPath(); ctx.ellipse(x, y, 20*scale, 30*scale, 0, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y - 30*scale); ctx.lineTo(x, y - 60*scale); ctx.stroke(); break;
        case 'band': for (let i = -1; i <= 1; i++) { const offset = i * 15; ctx.beginPath(); ctx.arc(x + offset, y - 20, 8*scale, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + offset, y - 12); ctx.lineTo(x + offset, y + 10); ctx.stroke(); } break;
        case 'practice': ctx.font = `bold ${30*scale}px Arial`; ctx.fillText('♪', x - 15, y); ctx.fillText('♫', x + 5, y - 10); break;
        case 'gig': ctx.beginPath(); ctx.arc(x, y - 10, 15*scale, 0, Math.PI, true); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x, y - 40); ctx.stroke(); ctx.beginPath(); ctx.ellipse(x, y - 45, 10*scale, 5*scale, 0, 0, Math.PI * 2); ctx.stroke(); break;
        case 'tour': ctx.fillRect(x - 30*scale, y - 20*scale, 60*scale, 40*scale); ctx.fillStyle = parchment; ctx.fillRect(x - 20*scale, y - 10*scale, 15*scale, 10*scale); ctx.fillRect(x + 5*scale, y - 10*scale, 15*scale, 10*scale); break;
      }
      ctx.restore();
    }

    function drawGhostBand(x, y, alpha) {
      ctx.save(); ctx.globalAlpha = alpha * 0.4; ctx.strokeStyle = fadeGray; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x, y - 20, 8, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y - 12); ctx.lineTo(x, y + 10); ctx.stroke();
      ctx.restore();
    }

    function draw() {
      ctx.fillStyle = parchment;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink;
      ctx.font = 'bold 24px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('From Garage to Tour', 500, 50);
      ctx.strokeStyle = ink; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(50, 300); ctx.lineTo(950, 300); ctx.stroke();
      
      stages.forEach((stage, i) => {
        const isActive = progress >= i / (stages.length - 1);
        const fadeAlpha = isActive ? 1 : 0.4;
        ctx.fillStyle = isActive ? gold : fadeGray;
        ctx.beginPath(); ctx.arc(stage.x, 300, isActive ? 8 : 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = isActive ? ink : fadeGray;
        ctx.font = `bold ${isActive ? 16 : 14}px Courier New`;
        ctx.textAlign = 'center';
        ctx.fillText(stage.label, stage.x, 340);
        ctx.font = `bold ${isActive ? 12 : 11}px Courier New`;
        ctx.fillText(stage.sublabel, stage.x, 360);
        const iconProgress = Math.min(1, Math.max(0, (progress - (i * 0.2)) * 5));
        drawIcon(stage.icon, stage.x, 200, isActive ? 1 : 0.7, fadeAlpha);
        
        if (i < stages.length - 1 && progress > (i + 1) / stages.length) {
          for (let g = 0; g < 3; g++) {
            const ghostX = stage.x + 40 + g * 40;
            const ghostY = 300 + Math.sin(g) * 40;
            const ghostAlpha = 1 - ((progress - 0.2) * 2);
            if (ghostAlpha > 0) drawGhostBand(ghostX, ghostY, ghostAlpha);
          }
        }
      });
      
      if (progress > 0) {
        ctx.strokeStyle = gold; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(50, 300); ctx.lineTo(50 + (900 * progress), 300); ctx.stroke();
      }
      ctx.fillStyle = ink; ctx.font = 'bold 12px Courier New'; ctx.textAlign = 'left';
      ctx.fillText('● Gold: Surviving path', 50, 550);
      ctx.fillStyle = fadeGray;
      ctx.fillText('● Gray: Dissolved bands', 50, 570);
    }

    function animate() {
      progress += 0.005;
      if (progress > 1) progress = 1;
      draw();
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
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
      <canvas ref={canvasRef} width={1000} height={600} style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer' }} />
      <button onClick={() => canvasRef.current?.click()} style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.75rem', background: 'var(--bg-card, #1a1a1a)', border: '1px solid var(--border, #2a2a2a)', borderRadius: '4px', padding: '0.35rem 1rem', cursor: 'pointer', transition: 'all 0.2s' }}>Replay</button>
    </div>
  );
}
