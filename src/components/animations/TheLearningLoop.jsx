import { useEffect, useRef } from 'react';

export default function TheLearningLoop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const parchment = '#FAFAF7';
    const ink = '#1C1C1C';
    const teal = '#0F766E';
    const gold = '#C28E2C';
    const blue = '#3A5F7D';
    const amber = '#D97706';

    let progress = 0; let rotation = 0;
    let animationId;

    const loopStages =[
      { name: 'SHIP', color: teal, icon: '🚀', description: 'Play the gig' },
      { name: 'LISTEN', color: blue, icon: '👂', description: 'Hear the audience' },
      { name: 'LEARN', color: amber, icon: '📊', description: 'Extract insights' },
      { name: 'IMPROVE', color: gold, icon: '✨', description: 'Play better next time' }
    ];

    function drawLoop(centerX, centerY, radius) {
      ctx.strokeStyle = '#D1D1D1'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = teal; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (rotation % (Math.PI * 2))); ctx.stroke();
      loopStages.forEach((stage, index) => {
        const angle = -Math.PI / 2 + (index / 4) * Math.PI * 2; const x = centerX + Math.cos(angle) * radius; const y = centerY + Math.sin(angle) * radius;
        ctx.fillStyle = stage.color; ctx.beginPath(); ctx.arc(x, y, 35, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = parchment; ctx.beginPath(); ctx.arc(x, y, 25, 0, Math.PI * 2); ctx.fill();
        ctx.font = '24px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(stage.icon, x, y);
        ctx.fillStyle = ink; ctx.font = 'bold 14px Courier New'; ctx.fillText(stage.name, x, y + 55);
        ctx.font = 'bold 12px Courier New'; ctx.fillStyle = '#555'; ctx.fillText(stage.description, x, y + 70);
      });
      const dotAngle = -Math.PI / 2 + (rotation % (Math.PI * 2)); const dotX = centerX + Math.cos(dotAngle) * radius; const dotY = centerY + Math.sin(dotAngle) * radius;
      ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(dotX, dotY, 10, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(dotX, dotY, 25, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }

    function drawFeedbackFlow(centerX, centerY) {
      const flowY = 480; ctx.fillStyle = ink; ctx.font = 'bold 16px Courier New'; ctx.textAlign = 'center'; ctx.fillText('THE FEEDBACK TAXONOMY', centerX, flowY);
      const categories =[
        { name: 'Usability', color: teal, count: 12, action: 'Fix quickly' },
        { name: 'Value', color: blue, count: 8, action: 'Listen carefully' },
        { name: 'Emotional', color: gold, count: 4, action: 'Most important' },
        { name: 'Feature Req', color: '#555', count: 14, action: "Log, don't build" },
        { name: 'Edge Case', color: amber, count: 6, action: 'Fix if core' }
      ];
      const startX = 120; const gap = 165;
      categories.forEach((cat, index) => {
        const x = startX + index * gap; const y = flowY + 30;
        ctx.fillStyle = cat.color; ctx.globalAlpha = 0.2; ctx.fillRect(x - 70, y, 140, 70); ctx.globalAlpha = 1;
        ctx.strokeStyle = cat.color; ctx.lineWidth = 2; ctx.strokeRect(x - 70, y, 140, 70);
        ctx.fillStyle = ink; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'center'; ctx.fillText(cat.name.toUpperCase(), x, y + 20);
        ctx.font = 'bold 14px Courier New'; ctx.fillText(cat.count, x, y + 40);
        ctx.font = 'bold 11px Courier New'; ctx.fillStyle = '#444'; ctx.fillText(cat.action, x, y + 58);
      });
    }

    function drawInsight(centerX) {
      if (progress > 100) {
        const insightY = 620; ctx.fillStyle = 'rgba(194, 142, 44, 0.1)'; ctx.fillRect(centerX - 350, insightY - 30, 700, 60);
        ctx.strokeStyle = gold; ctx.lineWidth = 2; ctx.strokeRect(centerX - 350, insightY - 30, 700, 60);
        ctx.fillStyle = gold; ctx.font = 'bold 14px Courier New'; ctx.textAlign = 'center'; ctx.fillText('INSIGHT', centerX, insightY - 15);
        ctx.fillStyle = ink; ctx.font = 'bold 14px Courier New'; ctx.fillText('"Users who complete the first visit cycle describe feeling', centerX, insightY + 5); ctx.fillText('significantly less anxious... delivers on the North Star Moment."', centerX, insightY + 22);
      }
    }

    function draw() {
      ctx.fillStyle = parchment; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink; ctx.font = 'bold 28px Courier New'; ctx.textAlign = 'center'; ctx.fillText('The Learning Loop', 450, 40);
      ctx.font = 'bold 14px Courier New'; ctx.fillText('The band that gets better after every gig is the band that fills stadiums', 450, 65);
      drawLoop(450, 260, 100); drawFeedbackFlow(450, 260); drawInsight(450);
      if (progress > 150) { ctx.fillStyle = ink; ctx.font = 'italic bold 13px Courier New'; ctx.textAlign = 'center'; ctx.fillText('Everything else is vanity. The learning loop is the product.', 450, 690); }
    }

    function animate() {
      progress++; rotation += 0.02; draw();
      if (progress < 300) { animationId = requestAnimationFrame(animate); }
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { animate(); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(canvas);

    const handleClick = () => { cancelAnimationFrame(animationId); progress = 0; rotation = 0; animate(); };
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
