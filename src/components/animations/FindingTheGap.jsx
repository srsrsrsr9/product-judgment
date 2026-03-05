import { useEffect, useRef } from 'react';

export default function FindingTheGap() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const parchment = '#FAFAF7';
    const ink = '#1C1C1C';
    const gold = '#C28E2C';
    const blue = '#3A5F7D';
    const gray = '#555555'; // Darkened from #8B8B8B for readability

    let progress = 0;
    let animationId;

    const quadrants =[
      { name: 'Patient/Caregiver + Storage', x: 275, y: 215, competitors:[{ name: 'Practo', icon: 'Practo', ox: -90, oy: -30 }, { name: 'Apple Health', icon: 'Apple Health', ox: 0, oy: -30 }, { name: 'Gallery', icon: 'Phone Gallery', ox: 90, oy: -30 }], crowded: true, isTarget: false },
      { name: 'Doctor + Storage', x: 625, y: 215, competitors:[{ name: 'EHR Systems', icon: 'EHR Systems', ox: -50, oy: -30 }, { name: 'Medical Records', icon: 'Medical Records', ox: 50, oy: -30 }], crowded: true, isTarget: false },
      { name: 'Patient/Caregiver + Intelligence', x: 275, y: 485, competitors:[], crowded: false, isTarget: true, label: 'HERE' },
      { name: 'Doctor + Intelligence', x: 625, y: 485, competitors:[{ name: 'Freed', icon: 'Freed', ox: -80, oy: -30 }, { name: 'Heidi', icon: 'Heidi', ox: 0, oy: -30 }, { name: 'Sunoh.ai', icon: 'Sunoh.ai', ox: 80, oy: -30 }], crowded: true, isTarget: false }
    ];

    function drawAxes() {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(100, 350); ctx.lineTo(800, 350); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(450, 80); ctx.lineTo(450, 620); ctx.stroke();
      ctx.fillStyle = ink;
      ctx.font = 'bold 16px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('For Patients/Caregivers', 275, 340);
      ctx.fillText('For Doctors', 625, 340);
      
      ctx.save();
      // Changed from 85 to 50 to fix text overlap
      ctx.translate(50, 215);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Storage / Records', 0, 0);
      ctx.restore();
      
      ctx.save();
      // Changed from 85 to 50
      ctx.translate(50, 485);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Intelligence / Preparation', 0, 0);
      ctx.restore();
    }

    function drawCompetitorIcon(ctx, x, y, type, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = gray;
      ctx.lineWidth = 2;
      switch(type) {
        case 'Practo': ctx.fillStyle = '#E8F4F8'; ctx.fillRect(x - 15, y - 15, 30, 30); ctx.strokeRect(x - 15, y - 15, 30, 30); ctx.fillStyle = gray; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'center'; ctx.fillText('P', x, y + 4); break;
        case 'Apple Health': ctx.fillStyle = '#FF6B6B'; ctx.beginPath(); ctx.moveTo(x, y + 5); ctx.bezierCurveTo(x - 15, y - 10, x - 20, y + 5, x, y + 15); ctx.bezierCurveTo(x + 20, y + 5, x + 15, y - 10, x, y + 5); ctx.fill(); ctx.stroke(); break;
        case 'Phone Gallery': ctx.fillStyle = '#DDD'; ctx.fillRect(x - 15, y - 10, 30, 20); ctx.strokeRect(x - 15, y - 10, 30, 20); ctx.fillStyle = gray; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill(); break;
        case 'EHR Systems': ctx.fillStyle = '#E0E0E0'; for (let i = 0; i < 3; i++) { ctx.fillRect(x - 20, y - 15 + i * 12, 40, 10); ctx.strokeRect(x - 20, y - 15 + i * 12, 40, 10); } break;
        case 'Medical Records': ctx.fillStyle = '#F4E4C1'; ctx.fillRect(x - 15, y - 12, 30, 24); ctx.strokeRect(x - 15, y - 12, 30, 24); ctx.beginPath(); ctx.moveTo(x - 15, y - 12); ctx.lineTo(x - 5, y - 18); ctx.lineTo(x + 5, y - 12); ctx.stroke(); break;
        case 'Freed': case 'Heidi': case 'Sunoh.ai': ctx.fillStyle = '#D4E4F7'; ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); for (let i = 0; i < 3; i++) { ctx.arc(x, y, 8 + i * 4, -Math.PI/3, Math.PI/3); } ctx.stroke(); break;
      }
      ctx.restore();
    }

    function drawQuadrant(quad, progress) {
      const alpha = Math.min(1, progress / 50);
      if (quad.isTarget) {
        const pulse = Math.sin(progress * 0.1) * 0.1 + 0.9;
        ctx.fillStyle = `rgba(194, 142, 44, ${0.2 * pulse})`;
        ctx.fillRect(quad.x - 160, quad.y - 120, 320, 240);
        ctx.strokeStyle = gold;
        ctx.lineWidth = 4;
        ctx.strokeRect(quad.x - 160, quad.y - 120, 320, 240);
        ctx.fillStyle = gold;
        ctx.font = `bold ${24 + Math.sin(progress * 0.1) * 4}px Courier New`;
        ctx.textAlign = 'center';
        ctx.fillText(quad.label, quad.x, quad.y - 20);
        ctx.font = 'bold 14px Courier New';
        ctx.fillText('(Your positioning gap)', quad.x, quad.y + 10);
        if (progress > 100) {
          ctx.fillStyle = ink; // Fixed legibility issue here
          ctx.font = 'bold 14px Courier New';
          ctx.fillText('Everyone built for the', quad.x, quad.y + 50);
          ctx.fillText('provider side. Nobody built', quad.x, quad.y + 70);
          ctx.fillText('for the waiting room.', quad.x, quad.y + 90);
        }
      } else {
        ctx.fillStyle = 'rgba(139, 139, 139, 0.1)';
        ctx.fillRect(quad.x - 160, quad.y - 120, 320, 240);
        ctx.strokeStyle = gray;
        ctx.lineWidth = 2;
        ctx.strokeRect(quad.x - 160, quad.y - 120, 320, 240);
        quad.competitors.forEach((comp, i) => {
          const compX = quad.x + comp.ox;
          const compY = quad.y + comp.oy;
          const compAlpha = Math.min(1, (progress - i * 20) / 40);
          drawCompetitorIcon(ctx, compX, compY, comp.icon, compAlpha);
          if (compAlpha > 0.5) {
            ctx.fillStyle = gray;
            ctx.font = 'bold 12px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(comp.name, compX, compY + 30);
          }
        });
        ctx.fillStyle = gray;
        ctx.font = 'bold 14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('CROWDED', quad.x, quad.y + 90);
      }
    }

    function draw() {
      ctx.fillStyle = parchment;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink;
      ctx.font = 'bold 24px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('Finding the Gap', 450, 40);
      drawAxes();
      quadrants.forEach((quad, index) => {
        const quadProgress = Math.max(0, progress - index * 30);
        drawQuadrant(quad, quadProgress);
      });
      if (progress > 150) {
        ctx.strokeStyle = gold;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(275, 215); ctx.lineTo(275, 485);
        ctx.moveTo(625, 215); ctx.lineTo(275, 485);
        ctx.moveTo(625, 485); ctx.lineTo(275, 485);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }
    }

    function animate() {
      progress++;
      draw();
      if (progress < 250) {
        animationId = requestAnimationFrame(animate);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(canvas);

    const handleClick = () => {
      cancelAnimationFrame(animationId);
      progress = 0;
      animate();
    };
    canvas.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('click', handleClick);
      observer.disconnect();
    };
  },[]);

  return (
    <div style={{ margin: '2.5rem 0', textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        width={900}
        height={700}
        style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}
      />
      <button onClick={() => canvasRef.current?.click()} style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.75rem', background: 'var(--bg-card, #1a1a1a)', border: '1px solid var(--border, #2a2a2a)', borderRadius: '4px', padding: '0.35rem 1rem', cursor: 'pointer', transition: 'all 0.2s' }}>
        Replay
      </button>
    </div>
  );
}
