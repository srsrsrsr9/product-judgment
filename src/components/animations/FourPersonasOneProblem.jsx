import { useEffect, useRef } from 'react';

export default function FourPersonasOneProblem() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const parchment = '#FAFAF7';
    const ink = '#1C1C1C';
    const gold = '#C28E2C';
    const blue = '#3A5F7D';
    let progress = 0;
    let animationId;

    const personas =[
      { name: 'SANDEEP', archetype: 'The Local Coordinator', label: 'Overwhelmed by proximity', x: 200, y: 200, color: '#E8D5B7', draw: (ctx, x, y) => { ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - 30, 15, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y - 15); ctx.lineTo(x, y + 20); ctx.stroke(); ctx.fillStyle = '#D4A574'; ctx.fillRect(x + 10, y - 10, 25, 35); ctx.strokeRect(x + 10, y - 10, 25, 35); ctx.fillStyle = ink; ctx.fillRect(x - 20, y - 5, 12, 20); ctx.strokeStyle = '#C28E2C'; ctx.lineWidth = 1; for (let i = 0; i < 3; i++) { ctx.strokeRect(x - 40 + i * 15, y + 25 + i * 5, 10, 12); } } },
      { name: 'PRIYA', archetype: 'The Distance Caregiver', label: 'Terrified by distance', x: 800, y: 200, color: '#D4E4F7', draw: (ctx, x, y) => { ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - 20, 15, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 30, y + 10); ctx.lineTo(x + 30, y + 10); ctx.lineTo(x + 25, y + 40); ctx.lineTo(x - 25, y + 40); ctx.closePath(); ctx.stroke(); ctx.fillStyle = '#3A5F7D'; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.arc(x + 15, y - 10, 30, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; ctx.fillStyle = ink; for (let i = 0; i < 4; i++) { ctx.fillRect(x + 20, y - 30 + i * 8, 30 - i * 5, 3); } ctx.strokeStyle = ink; ctx.beginPath(); ctx.arc(x - 25, y - 35, 10, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 25, y - 35); ctx.lineTo(x - 25, y - 42); ctx.moveTo(x - 25, y - 35); ctx.lineTo(x - 20, y - 35); ctx.stroke(); } },
      { name: 'ALEKHYA', archetype: 'The Sandwich Juggler', label: 'Drowning in everything', x: 200, y: 600, color: '#F7E8D4', draw: (ctx, x, y) => { ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - 30, 15, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y - 15); ctx.lineTo(x, y + 15); ctx.stroke(); ctx.strokeRect(x - 40, y - 10, 25, 30); ctx.strokeRect(x - 10, y - 5, 20, 25); ctx.strokeRect(x + 20, y - 8, 22, 28); ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(x + 50, y - 40, 8, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 50, y - 32); ctx.lineTo(x + 50, y - 15); ctx.stroke(); ctx.beginPath(); ctx.arc(x + 65, y - 35, 8, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; ctx.fillStyle = '#E74C3C'; for (let i = 0; i < 5; i++) { ctx.fillRect(x - 30 + i * 12, y + 20 + (i % 2) * 8, 8, 10); } } },
      { name: 'RAKESH', archetype: 'The Reluctant Manager', label: 'Starting from zero', x: 800, y: 600, color: '#E8E8E8', draw: (ctx, x, y) => { ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - 25, 15, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x - 5, y + 20); ctx.moveTo(x, y - 10); ctx.lineTo(x + 5, y + 20); ctx.stroke(); ctx.fillStyle = '#FAFAF7'; ctx.fillRect(x - 15, y - 5, 20, 25); ctx.strokeRect(x - 15, y - 5, 20, 25); ctx.fillStyle = gold; ctx.font = 'bold 20px Courier New'; ctx.fillText('?', x - 35, y - 40); ctx.fillText('?', x + 25, y - 35); ctx.fillText('?', x - 20, y + 45); ctx.strokeStyle = '#CCC'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 60, y - 60); ctx.lineTo(x - 40, y + 60); ctx.moveTo(x + 60, y - 60); ctx.lineTo(x + 40, y + 60); ctx.stroke(); } }
    ];

    function drawPanel(persona, opacity) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = persona.color;
      ctx.fillRect(persona.x - 130, persona.y - 110, 260, 220);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2;
      ctx.strokeRect(persona.x - 130, persona.y - 110, 260, 220);
      persona.draw(ctx, persona.x, persona.y - 20);
      ctx.fillStyle = blue;
      ctx.font = 'bold 16px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(persona.name, persona.x, persona.y + 50);
      ctx.fillStyle = ink;
      ctx.font = 'bold 13px Courier New';
      ctx.fillText(persona.archetype, persona.x, persona.y + 70);
      ctx.fillStyle = gold;
      ctx.font = 'bold 14px Courier New';
      ctx.fillText(persona.label, persona.x, persona.y + 90);
      ctx.restore();
    }

    function drawVennDiagram(opacity) {
      ctx.save();
      ctx.globalAlpha = opacity;
      const centerX = 500; const centerY = 400;
      const positions =[{ x: centerX - 55, y: centerY - 55 }, { x: centerX + 55, y: centerY - 55 }, { x: centerX - 55, y: centerY + 55 }, { x: centerX + 55, y: centerY + 55 }];
      ctx.fillStyle = 'rgba(194, 142, 44, 0.2)';
      ctx.strokeStyle = gold;
      ctx.lineWidth = 2;
      positions.forEach(pos => { ctx.beginPath(); ctx.arc(pos.x, pos.y, 85, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
      ctx.fillStyle = gold;
      ctx.beginPath(); ctx.arc(centerX, centerY, 50, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = parchment;
      ctx.font = 'bold 13px Courier New';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Fear of', centerX, centerY - 16);
      ctx.fillText('failing the', centerX, centerY);
      ctx.fillText('people they', centerX, centerY + 16);
      ctx.fillText('love', centerX, centerY + 32);
      ctx.restore();
    }

    function draw() {
      ctx.fillStyle = parchment;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink;
      ctx.font = 'bold 28px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('Four Personas, One Problem', 500, 50);
      if (progress > 280) {
        ctx.strokeStyle = gold;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        personas.forEach(persona => { ctx.beginPath(); ctx.moveTo(persona.x, persona.y); ctx.lineTo(500, 400); ctx.stroke(); });
        ctx.globalAlpha = 1;
      }
      personas.forEach((persona, index) => {
        const trigger = index * 40;
        const opacity = Math.min(1, Math.max(0, (progress - trigger) / 60));
        drawPanel(persona, opacity);
      });
      if (progress > 200) {
        const vennOpacity = Math.min(1, (progress - 200) / 80);
        drawVennDiagram(vennOpacity);
      }
    }

    function animate() {
      progress++;
      draw();
      if (progress < 350) {
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
      <canvas ref={canvasRef} width={1000} height={800} style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer' }} />
      <button onClick={() => canvasRef.current?.click()} style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.75rem', background: 'var(--bg-card, #1a1a1a)', border: '1px solid var(--border, #2a2a2a)', borderRadius: '4px', padding: '0.35rem 1rem', cursor: 'pointer', transition: 'all 0.2s' }}>Replay</button>
    </div>
  );
}
