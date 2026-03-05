import { useState, useEffect, useRef } from 'react';

const defaultData = [
  { week: "Week 1", users: 142, pct: 100, color: "#e8c47c" },
  { week: "Week 2", users: 38, pct: 27, color: "#b8944c" },
  { week: "Week 3", users: 12, pct: 8.5, color: "#8a6a30" },
  { week: "Week 4", users: 3, pct: 2.1, color: "#5a4520" },
  { week: "Week 5", users: 3, pct: 2.1, color: "#3a2d15" },
];

export default function RetentionChart({ data }) {
  const [visible, setVisible] = useState(false);
  const chartRef = useRef(null);
  const chartData = data || defaultData;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (chartRef.current) obs.observe(chartRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        background: "#111",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "1.75rem",
        margin: "2rem 0",
      }}
    >
      {chartData.map((d, i) => (
        <div key={i} className="ret-row">
          <span className="ret-lbl">{d.week}</span>
          <div style={{ flex: 1, height: 18, background: "rgba(255,255,255,0.02)", borderRadius: 2, position: "relative" }}>
            <div
              className="ret-bar"
              style={{
                width: visible ? `${d.pct}%` : "0%",
                background: d.color,
                transitionDelay: `${i * 150}ms`,
              }}
            />
          </div>
          <span className="ret-val">
            {d.users}{" "}
            {i === chartData.length - 1 ? (
              <span style={{ color: "var(--text-dim)", fontStyle: "italic" }}>(one is you)</span>
            ) : (
              "users"
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
