import React from 'react';
import { Briefcase, Sparkles, FileEdit } from 'lucide-react';

const PRESETS = [
  {
    title: 'Senior Full-Stack MERN Developer',
    role: 'Senior Full Stack Engineer (React/Node)',
    description: `About the Role:
We are seeking an experienced Senior Full-Stack Engineer to architect, build, and scale our core SaaS platform. You will work across modern React frontends and high-performance Node.js / Express microservices backed by MongoDB and Redis.

Key Responsibilities:
- Design and implement resilient, low-latency RESTful APIs using Node.js, Express, and MongoDB.
- Build reactive, high-performance web user interfaces using React, TypeScript, and modern state management.
- Optimize database schemas, query indexes, and Redis caching layers for high throughput.
- Collaborate on CI/CD automation pipelines using Docker, Kubernetes, and AWS (S3, EC2, CloudFront).
- Drive testing automation (unit, integration, and E2E) with Jest and Cypress.

Required Qualifications:
- 4+ years of professional full-stack development experience with JavaScript / TypeScript.
- Strong proficiency in React.js, modern hooks, and state management.
- Deep expertise in Node.js, Express.js REST API development, and asynchronous programming.
- Hands-on experience with MongoDB (Mongoose), schema design, and query optimization.
- Familiarity with Docker, Git, CI/CD, and AWS cloud environments.
- Excellent communication and team collaboration skills.`
  },
  {
    title: 'Backend Node.js & Cloud Architect',
    role: 'Backend Node.js Engineer',
    description: `Position: Backend Node.js Engineer

We are looking for a Backend Engineer to scale our distributed cloud backend services. 

Requirements:
- Proven experience with Node.js, Express, TypeScript, and REST/GraphQL APIs.
- Experience with distributed databases: MongoDB, PostgreSQL, and Redis caching.
- Familiarity with message brokers (Kafka or RabbitMQ) and microservices architecture.
- Understanding of secure API authentication (OAuth2, JWT), rate limiting, and input validation.
- Experience with Docker, Kubernetes, and AWS/GCP deployment.
- Passion for code quality, testing (Jest/Mocha), and automated deployment pipelines.`
  },
  {
    title: 'Senior Frontend React Specialist',
    role: 'Senior Frontend Engineer',
    description: `Role Overview:
Join our design systems and web application team to build next-generation enterprise interfaces.

Qualifications:
- 4+ years building complex web applications using React, Next.js, and TypeScript.
- Expert knowledge of HTML5, CSS3, Tailwind CSS, and component libraries.
- Strong understanding of web performance optimization, core web vitals, and accessibility (WCAG).
- Experience consuming RESTful and GraphQL APIs with optimistic UI updates.
- Experience with unit and integration testing using Jest and React Testing Library.`
  }
];

export default function JobDescriptionInput({
  jobTitle,
  setJobTitle,
  jobDescription,
  setJobDescription,
  error
}) {
  const handleSelectPreset = (preset) => {
    setJobTitle(preset.role);
    setJobDescription(preset.description);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-indigo-400" />
          2. Target Job Description
        </label>
        <span className="text-xs text-slate-500 font-mono">
          {jobDescription.length} chars
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="mb-3 flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectPreset(p)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-indigo-500/50 transition font-medium"
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Job Title Field */}
      <div className="mb-3">
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Target Role (e.g. Senior Full-Stack Engineer)"
          className="w-full px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition"
        />
      </div>

      {/* Job Description Textarea */}
      <div className="flex-1 flex flex-col min-h-[220px]">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the target job description, responsibilities, and required qualifications here..."
          className="flex-1 w-full p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none transition resize-none leading-relaxed font-sans"
        />
      </div>

      {error && (
        <p className="mt-2 text-xs text-rose-400 font-medium">{error}</p>
      )}
    </div>
  );
}
