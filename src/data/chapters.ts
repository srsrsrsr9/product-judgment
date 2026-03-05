export const CHAPTERS = [
  { num: 1, title: "The Garage Band Problem", subtitle: "Why everyone can play an instrument now, and almost nobody can play a gig.", slug: "01-the-garage-band-problem" },
  { num: 2, title: "Finding a Problem Worth Solving", subtitle: "The difference between \"wouldn't it be cool if\" and \"I can't believe nobody's fixed this.\"", slug: "02-finding-a-problem-worth-solving" },
  { num: 3, title: "Talking to Strangers", subtitle: "How to learn more in thirty minutes of listening than in three months of building.", slug: "03-talking-to-strangers" },
  { num: 4, title: "Who Are You Building For?", subtitle: "Turning research into people — without turning people into spreadsheets.", slug: "04-who-are-you-building-for" },
  { num: 5, title: "Know Your Neighborhood", subtitle: "Who else is playing your song — and what key are they in?", slug: "05-know-your-neighborhood" },
  { num: 6, title: "Deciding What to Build", subtitle: "The art of saying \"not now\" to good ideas.", slug: "06-deciding-what-to-build" },
  { num: 7, title: "Making It Real on Paper", subtitle: "Why the thing nobody sees is the thing that makes everything work.", slug: "07-making-it-real-on-paper" },
  { num: 8, title: "The AI Layer", subtitle: "The amplifier that makes everything louder — including your mistakes.", slug: "08-the-ai-layer" },
  { num: 9, title: "Ship It", subtitle: "The gig is tonight. The audience doesn't owe you anything.", slug: "09-ship-it" },
  { num: 10, title: "Learning as a Feature", subtitle: "The band that gets better after every gig is the band that fills stadiums.", slug: "10-learning-as-a-feature" },
];

export const PRODUCTS = [
  {
    id: "lms", name: "Learning Management System", tagline: "Enterprise-grade learning, built from zero",
    description: "A complete LMS with SSO (Google, Microsoft), Zoom integration with automatic session recording, Amazon S3 storage, AI-powered course creation, and full admin capabilities for student management, testing, and course authoring.",
    tags: ["EdTech", "Enterprise", "AI", "SSO", "Zoom API", "AWS S3"], color: "#2563eb", icon: "\u{1F4DA}",
    highlights: ["Single Sign-On with Google & Microsoft", "Automatic Zoom session recording", "AI-powered course creation engine", "Complete admin: imports, tests, courses"],
  },
  {
    id: "calling-agent", name: "AI Calling Agent", tagline: "Conversations that convert",
    description: "An AI agent that makes outbound calls, books appointments, handles objections naturally, and logs every interaction. Full recording and transcription pipeline built in.",
    tags: ["Voice AI", "NLP", "Telephony", "Automation"], color: "#7c3aed", icon: "\u{1F4DE}",
    highlights: ["Natural-sounding AI voice calls", "Intelligent objection handling", "Automatic appointment booking", "Full call recording & transcription"],
  },
  {
    id: "health-app", name: "Family Health Chief of Staff", tagline: "Multi-generational care, coordinated",
    description: "An AI-powered coordination tool for Indian families managing healthcare across generations. Doctor visit planning, prescription scanning with automatic data extraction, and family-wide health tracking.",
    tags: ["HealthTech", "AI", "OCR", "Mobile", "React Native"], color: "#059669", icon: "\u{1F3E5}",
    highlights: ["Multi-generational family health management", "Doctor visit planning & reminders", "Prescription photo scanning with AI extraction", "Responsible AI with clear guardrails"],
  },
  {
    id: "resume-tool", name: "Resume Updater", tagline: "Tailored, not fabricated",
    description: "An AI tool that helps tailor your resume to a specific job description — surfacing what you've actually done, not inventing what you haven't. Honest optimization.",
    tags: ["Career Tech", "AI", "NLP"], color: "#dc2626", icon: "\u{1F4C4}",
    highlights: ["JD-aware resume optimization", "Surfaces real experience, never fabricates", "Highlights transferable skills", "Clean, ATS-friendly output"],
  },
];

export function getChapterNav(num: number) {
  const idx = CHAPTERS.findIndex(c => c.num === num);
  return {
    prev: idx > 0 ? CHAPTERS[idx - 1] : undefined,
    next: idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : undefined,
  };
}
