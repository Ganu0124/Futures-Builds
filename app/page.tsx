'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import TechBackground from '@/components/TechBackground'

/* ════════════════════════════════
   SCROLL OBSERVER HOOK
   ════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ════════════════════════════════
   ANIMATED COUNTER
   ════════════════════════════════ */
function useCounter(target: number, duration = 1200, active = true) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active || target === 0) { setValue(target); return }
    let start = 0
    const frames = 50
    const step = target / frames
    let frame = 0
    const id = setInterval(() => {
      frame++
      start += step
      if (frame >= frames) { setValue(target); clearInterval(id) }
      else setValue(Math.floor(start))
    }, duration / frames)
    return () => clearInterval(id)
  }, [target, duration, active])
  return value
}

/* ════════════════════════════════
   NAVBAR
   ════════════════════════════════ */
function Navbar() {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setActive(id)
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const links = [
    { id: 'home',     label: 'Home'     },
    { id: 'about',    label: 'About'    },
    { id: 'services', label: 'Services' },
    { id: 'contact',  label: 'Projects' },
    { id: 'process',  label: 'Process'  },
  ]

  return (
    <nav
      style={{
        position: 'fixed',
        top: 16,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 20px',
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          height: 62,
          padding: '0 24px',
          background: scrolled ? 'rgba(10,10,10,0.95)' : 'rgba(17,17,17,0.80)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 9999,
          boxShadow: scrolled
            ? '0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(16,185,129,0.12)'
            : '0 8px 30px rgba(0,0,0,0.5)',
          transition: 'all 0.35s ease',
        }}
      >
        {/* ── Logo ── */}
        <button
          onClick={() => scrollTo('home')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          {/* Geometric hexagon icon */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 2L28 9v14L16 30 4 23V9z"
              stroke="#10B981" strokeWidth="1.5" fill="rgba(16,185,129,0.08)"
            />
            <path
              d="M16 8L22 11.5v7L16 22l-6-3.5v-7z"
              fill="#10B981" opacity="0.7"
            />
          </svg>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em' }}>
            <span style={{ color: '#F5F5F5' }}>Future</span>
            <span style={{ color: '#10B981' }}>Builds</span>
          </span>
        </button>

        {/* ── Desktop links ── */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 32, justifyContent: 'flex-start' }}>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className={`nav-link${active === l.id ? ' active' : ''}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* ── CTA + Mobile toggle ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
          <button
            className="btn-primary desktop-nav"
            onClick={() => scrollTo('contact')}
            style={{ padding: '10px 22px', fontSize: 14, borderRadius: 9999 }}
          >
            Start a Project
          </button>
          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#A3A3A3', fontSize: 22, padding: 4,
            }}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="mobile-menu"
          style={{
            maxWidth: 1180, margin: '8px auto 0', padding: '16px',
            background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20,
            display: 'flex', flexDirection: 'column', gap: 4,
          }}
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#A3A3A3', fontSize: 15, fontWeight: 500,
                padding: '12px 16px', borderRadius: 10, textAlign: 'left',
                fontFamily: 'Inter,sans-serif',
              }}
            >
              {l.label}
            </button>
          ))}
          <button
            className="btn-primary"
            onClick={() => scrollTo('contact')}
            style={{ margin: '8px 0 0', padding: '12px 24px', fontSize: 14 }}
          >
            Start a Project
          </button>
        </div>
      )}
    </nav>
  )
}

/* ════════════════════════════════
   HERO
   ════════════════════════════════ */
function Hero({ onExplore }: { onExplore: () => void }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    // Staggered entrance sequence
    const t1 = setTimeout(() => setPhase(1), 200)
    const t2 = setTimeout(() => setPhase(2), 600)
    const t3 = setTimeout(() => setPhase(3), 1100)
    const t4 = setTimeout(() => setPhase(4), 1500)
    const t5 = setTimeout(() => setPhase(5), 1900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5) }
  }, [])

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '120px 20px 80px',
        textAlign: 'center',
      }}
    >
      {/* Label */}
      <div
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
          marginBottom: 28,
        }}
      >
        <span className="section-label">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
          Welcome to FutureBuilds
        </span>
      </div>

      {/* FutureBuilds brand name */}
      <div
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.75s cubic-bezier(0.16,1,0.3,1)',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <svg width="52" height="52" viewBox="0 0 32 32" fill="none">
          <path d="M16 2L28 9v14L16 30 4 23V9z" stroke="#10B981" strokeWidth="1.5" fill="rgba(16,185,129,0.08)" />
          <path d="M16 8L22 11.5v7L16 22l-6-3.5v-7z" fill="#10B981" opacity="0.7" />
        </svg>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(48px, 7vw, 96px)', fontWeight: 800, letterSpacing: '-0.03em' }}>
          <span style={{ color: '#F5F5F5' }}>Future</span>
          <span style={{ color: '#10B981' }}>Builds</span>
        </span>
      </div>

      {/* Main headline */}
      <h1
        style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: 'clamp(22px, 3.5vw, 48px)',
          fontWeight: 600,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          maxWidth: 920,
          marginBottom: 28,
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <span style={{ color: '#F5F5F5' }}>Building Ideas Into </span>
        <br />
        <span style={{ color: '#F5F5F5' }}>Intelligent </span>
        <span style={{ color: '#10B981' }}>Digital Solutions</span>
      </h1>

      {/* Supporting text */}
      <p
        style={{
          fontSize: 'clamp(15px, 1.8vw, 19px)',
          color: '#A3A3A3',
          maxWidth: 620,
          lineHeight: 1.7,
          marginBottom: 48,
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        Transform your ideas into modern digital products through software, AI, automation,
        data, and intelligent technology built for global scale.
      </p>

      {/* CTA Buttons */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 80,
          opacity: phase >= 5 ? 1 : 0,
          transform: phase >= 5 ? 'translateY(0)' : 'translateY(14px)',
          transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <button
          className="btn-primary"
          onClick={scrollToContact}
          style={{
            padding: '15px 32px',
            fontSize: 15,
            animation: phase >= 5 ? 'ambientPulse 3s ease-in-out infinite' : 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          Start Your Project
        </button>
        <button
          className="btn-secondary"
          onClick={onExplore}
          style={{ padding: '15px 32px', fontSize: 15 }}
        >
          Explore Our Services
        </button>
      </div>

      {/* Quick stats bar */}
      <div
        style={{
          display: 'flex',
          gap: 48,
          flexWrap: 'wrap',
          justifyContent: 'center',
          opacity: phase >= 5 ? 1 : 0,
          transform: phase >= 5 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {[
          { value: '250+', label: 'Digital Products Shipped' },
          { value: '38ms', label: 'Median API Latency'       },
          { value: '99.9%', label: 'Uptime Architecture'     },
          { value: '24/7', label: 'Client Support'           },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 26,
                fontWeight: 800,
                color: '#10B981',
                letterSpacing: '-0.02em',
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 500, marginTop: 3 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          opacity: phase >= 5 ? 0.6 : 0,
          transition: 'opacity 1s ease',
        }}
      >
        <div style={{ fontSize: 10, color: '#6B7280', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
          Scroll
        </div>
        <div style={{ width: 1, height: 36, background: 'linear-gradient(180deg, #10B981, transparent)' }} />
        <div
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#10B981',
            animation: 'scrollBounce 1.8s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  )
}

/* ════════════════════════════════
   ABOUT
   ════════════════════════════════ */
function About() {
  return (
    <section id="about" style={{ padding: 'clamp(64px,8vw,120px) 20px', position: 'relative', zIndex: 2 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 64,
          alignItems: 'start',
        }}>
          {/* Left: text */}
          <div>
            <div className="fade-up section-label" style={{ marginBottom: 20 }}>
              About FutureBuilds
            </div>
            <h2
              className="fade-up stagger-1"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 'clamp(30px,4vw,50px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.12,
                marginBottom: 24,
                color: '#F5F5F5',
              }}
            >
              Engineering the Next Wave of{' '}
              <span style={{ color: '#10B981' }}>Intelligent Platforms</span>
            </h2>
            <p className="fade-up stagger-2" style={{ color: '#A3A3A3', lineHeight: 1.8, fontSize: 16, marginBottom: 20 }}>
              FutureBuilds is a modern technology and digital engineering studio. We architect
              and construct high-performance software systems, cognitive AI workflows, and
              scalable cloud applications for forward-thinking businesses and startups.
            </p>
            <p className="fade-up stagger-3" style={{ color: '#A3A3A3', lineHeight: 1.8, fontSize: 16, marginBottom: 36 }}>
              Our engineering methodology combines deep distributed systems expertise,
              autonomous automation pipelines, and modern security protocols to turn ambitious
              ideas into reliable, production-grade reality.
            </p>
            <div className="fade-up stagger-4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['Zero-Trust Security', 'Microsecond Scalability', 'AI Neural Workflows'].map((t) => (
                <span key={t} className="tag-pill">{t}</span>
              ))}
            </div>
          </div>

          {/* Right: feature cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { icon: '🧠', title: 'Neural & AI Integration',   desc: 'Autonomous LLM agents, cognitive workflows, and predictive inference engines built into your core systems.', tag: 'AI-Native' },
              { icon: '⚡', title: 'High-Throughput Core',      desc: 'Sub-millisecond data processing, distributed caching, and elastic compute designed to scale under heavy load.', tag: 'Performance' },
              { icon: '🔒', title: 'Enterprise Cyber Resilience', desc: 'Zero-trust architecture, end-to-end encryption, and automated security scanning baked into every deployment.', tag: 'Security' },
              { icon: '🔄', title: 'Autonomous DevOps',         desc: 'Self-healing infrastructure, declarative CI/CD pipelines, and multi-region cloud orchestrations.', tag: 'Reliability' },
            ].map((c, i) => (
              <div
                key={c.title}
                className={`card-premium fade-up stagger-${i + 1}`}
                style={{ padding: '20px 18px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 22 }}>{c.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#10B981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.20)', borderRadius: 9999, padding: '2px 8px', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.06em' }}>
                    {c.tag}
                  </span>
                </div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: '#F5F5F5', marginBottom: 8 }}>
                  {c.title}
                </div>
                <div style={{ color: '#6B7280', fontSize: 12.5, lineHeight: 1.65 }}>
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════
   SERVICES
   ════════════════════════════════ */
function Services() {
  const services = [
    {
      icon: '🤖', title: 'AI Solutions',
      desc: 'Deploy custom Large Language Models, autonomous agents systems, cognitive automation, and predictive machine learning models tailored to your business operations.',
      tags: ['LLMs', 'Agents·AI', 'Neural Search', 'LangChain'],
    },
    {
      icon: '🌐', title: 'Web Development',
      desc: 'Ultra-fast, responsive web applications engineered with Next.js, React, and modern full-stack architectures with sub-second page loads and seamless UX.',
      tags: ['Next.js', 'React', 'TypeScript'],
    },
    {
      icon: '⚙️', title: 'Software Development',
      desc: 'Scalable distributed software, microservices, and robust cloud APIs built with clean architectural patterns to power high-concurrency business workloads.',
      tags: ['Distributed Systems', 'REST/GraphQL', 'Node.js', 'Go'],
    },
    {
      icon: '📊', title: 'Data Analytics',
      desc: 'Unlock actionable intelligence with real-time telemetry streaming, interactive data visualization dashboards, data warehousing, and automated KPI reporting.',
      tags: ['PostgreSQL', 'BigQuery', 'Telemetry', 'BI Dashboards'],
    },
    {
      icon: '⚡', title: 'Automation',
      desc: 'Eliminate repetitive workflows with intelligent automation pipelines, scheduled jobs, event-driven triggers, and cross-platform API synchronizations.',
      tags: ['Workflows', 'Webhooks', 'ETL Pipelines', 'Zero-Touch'],
    },
    {
      icon: '💎', title: 'Custom Digital Solutions',
      desc: 'End-to-end bespoke digital platforms designed from the ground up to solve unique domain problems, streamline operations, and drive market leadership.',
      tags: ['Cloud Native', 'Tailored UX', 'SaaS Platforms', 'Security'],
    },
  ]

  return (
    <section id="services" style={{ padding: 'clamp(64px,8vw,120px) 20px', position: 'relative', zIndex: 2 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="fade-up section-label" style={{ marginBottom: 20 }}>Core Capabilities</div>
          <h2
            className="fade-up stagger-1"
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 'clamp(28px,4vw,50px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#F5F5F5',
              marginBottom: 16,
            }}
          >
            Specialized <span style={{ color: '#10B981' }}>Technology</span> Services
          </h2>
          <p className="fade-up stagger-2" style={{ color: '#A3A3A3', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
            Comprehensive end-to-end technology engineering to build, scale, and automate your digital infrastructure.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`service-card fade-up stagger-${(i % 3) + 1}`}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                <div className="icon-badge">{s.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 17, color: '#F5F5F5', marginBottom: 4 }}>
                    {s.title}
                  </div>
                </div>
              </div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>
                {s.desc}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {s.tags.map((t) => (
                  <span key={t} className="tag-pill" style={{ fontSize: 10 }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════
   STATISTICS
   ════════════════════════════════ */
function Statistics({ totalRequests }: { totalRequests: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const c1 = useCounter(totalRequests, 1400, visible)
  const c2 = useCounter(250, 1600, visible)
  const c3 = useCounter(12, 1200, visible)
  const c4 = useCounter(99, 1500, visible)

  const stats = [
    { value: c1, label: 'Project Requests', suffix: '', desc: 'Submitted by clients worldwide' },
    { value: c2, label: 'Products Shipped', suffix: '+', desc: 'Live production deployments' },
    { value: c3, label: 'Technologies Used', suffix: '+', desc: 'Frameworks and cloud platforms' },
    { value: c4, label: 'Uptime SLA', suffix: '.9%', desc: 'System reliability guarantee' },
  ]

  return (
    <section ref={ref} style={{ padding: 'clamp(48px,6vw,90px) 20px', position: 'relative', zIndex: 2 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 20 }}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`stat-card fade-up stagger-${i + 1}`}
              style={{ textAlign: 'center', padding: '30px 20px' }}
            >
              <div
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: 'clamp(34px,4vw,50px)',
                  fontWeight: 800,
                  color: '#10B981',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {s.value}{s.suffix}
              </div>
              <div style={{ fontWeight: 700, color: '#F5F5F5', fontSize: 14, marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ color: '#6B7280', fontSize: 12 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════
   PROCESS
   ════════════════════════════════ */
function Process() {
  const steps = [
    { num: '01', title: 'Share Your Idea', desc: 'Submit your project concept. We review every requirement carefully and respond within one business day.' },
    { num: '02', title: 'We Analyze Requirements', desc: 'Our engineering team performs deep technical analysis and produces a comprehensive solution architecture.' },
    { num: '03', title: 'We Build Your Solution', desc: 'Rigorous engineering, iterative delivery, automated testing, and continuous integration pipelines.' },
    { num: '04', title: 'We Deliver and Support', desc: 'Production deployment, post-launch monitoring, performance tuning, and dedicated ongoing support.' },
  ]

  return (
    <section id="process" style={{ padding: 'clamp(64px,8vw,120px) 20px', position: 'relative', zIndex: 2 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="fade-up section-label" style={{ marginBottom: 20 }}>How It Works</div>
          <h2
            className="fade-up stagger-1"
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 'clamp(28px,4vw,50px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#F5F5F5',
            }}
          >
            Our <span style={{ color: '#10B981' }}>Engineering</span> Process
          </h2>
        </div>

        <div style={{ display: 'grid', gap: 24 }}>
          {steps.map((s, i) => (
            <div
              key={s.num}
              className={`process-step fade-up stagger-${i + 1}`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              {/* Connector line on the left */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, marginTop: 4 }}>
                <div
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(16,185,129,0.10)',
                    border: '1px solid rgba(16,185,129,0.30)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 13, fontWeight: 700, color: '#10B981',
                    flexShrink: 0,
                  }}
                >
                  {s.num}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg, rgba(16,185,129,0.40), rgba(16,185,129,0.05))', marginTop: 4 }} />
                )}
              </div>

              {/* Content */}
              <div
                className="card-premium"
                style={{ flex: 1, padding: '22px 24px', marginBottom: i < steps.length - 1 ? 0 : 0 }}
              >
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, color: '#F5F5F5', marginBottom: 8 }}>
                  {s.title}
                </div>
                <div style={{ color: '#A3A3A3', fontSize: 14.5, lineHeight: 1.7 }}>
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════
   PROJECT REQUEST FORM
   ════════════════════════════════ */
function ProjectForm() {
  const [form, setForm] = useState({ email: '', phone_number: '', project_title: '', project_description: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.email.trim())              e.email = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.phone_number.trim())       e.phone_number = 'Phone number is required'
    if (!form.project_title.trim())      e.project_title = 'Project title is required'
    if (!form.project_description.trim()) e.project_description = 'Project description is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/submit-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
        setForm({ email: '', phone_number: '', project_title: '', project_description: '' })
      } else {
        setSubmitError(data.message || 'Submission failed. Please try again.')
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'email',               label: 'Email Address *',    placeholder: 'you@company.com',                         type: 'email',  multi: false },
    { key: 'phone_number',        label: 'Phone Number *',     placeholder: '+1 (555) 019-2834',                       type: 'tel',    multi: false },
    { key: 'project_title',       label: 'Project Title *',    placeholder: 'e.g. AI-Powered Autonomous Workflow Engine', type: 'text',  multi: false },
    { key: 'project_description', label: 'Project Description *', placeholder: 'Describe your technical requirements, architecture goals, target audience, and preferred integrations.', type: 'textarea', multi: true },
  ]

  return (
    <section id="contact" style={{ padding: 'clamp(64px,8vw,120px) 20px', position: 'relative', zIndex: 2 }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="fade-up section-label" style={{ marginBottom: 20 }}>Project Initiation</div>
          <h2
            className="fade-up stagger-1"
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 'clamp(28px,4vw,50px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#F5F5F5',
              marginBottom: 14,
            }}
          >
            Submit Your <span style={{ color: '#10B981' }}>Project Request</span>
          </h2>
          <p className="fade-up stagger-2" style={{ color: '#A3A3A3', fontSize: 15.5 }}>
            Share your project details with FutureBuilds. Saved directly to our Supabase PostgreSQL database for architectural review.
          </p>
        </div>

        {/* Form card */}
        <div
          className="fade-up"
          style={{
            background: 'rgba(10,10,10,0.92)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24,
            padding: 'clamp(28px,4vw,48px)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top emerald border accent */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.5), rgba(52,211,153,0.7), rgba(16,185,129,0.5), transparent)',
          }} />

          {success ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 52, marginBottom: 20 }}>✅</div>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 800, color: '#F5F5F5', marginBottom: 12 }}>
                Request Submitted Successfully
              </h3>
              <p style={{ color: '#A3A3A3', marginBottom: 8 }}>
                Your project request has been saved to our Supabase database.
              </p>
              <p style={{ color: '#10B981', fontWeight: 600, fontSize: 14, marginBottom: 32 }}>
                Our engineering team will review and respond within 24 hours.
              </p>
              <button
                className="btn-primary"
                onClick={() => setSuccess(false)}
                style={{ padding: '12px 28px', fontSize: 14 }}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
              <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))' }}>
                {fields.slice(0, 2).map((f) => (
                  <div key={f.key}>
                    <label className="form-label">{f.label}</label>
                    <input
                      type={f.type}
                      className={`form-input${errors[f.key] ? ' error' : ''}`}
                      placeholder={f.placeholder}
                      value={(form as any)[f.key]}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                    />
                    {errors[f.key] && <div className="error-msg">⚠ {errors[f.key]}</div>}
                  </div>
                ))}
              </div>

              {fields.slice(2).map((f) => (
                <div key={f.key}>
                  <label className="form-label">{f.label}</label>
                  {f.multi ? (
                    <textarea
                      className={`form-input${errors[f.key] ? ' error' : ''}`}
                      placeholder={f.placeholder}
                      value={(form as any)[f.key]}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      rows={5}
                      style={{ resize: 'vertical', minHeight: 120 }}
                    />
                  ) : (
                    <input
                      type={f.type}
                      className={`form-input${errors[f.key] ? ' error' : ''}`}
                      placeholder={f.placeholder}
                      value={(form as any)[f.key]}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                    />
                  )}
                  {errors[f.key] && <div className="error-msg">⚠ {errors[f.key]}</div>}
                </div>
              ))}

              {submitError && (
                <div style={{
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 10, padding: '12px 16px', color: '#F87171', fontSize: 13.5,
                }}>
                  ⚠ {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  padding: '16px 32px', fontSize: 15, width: '100%',
                  justifyContent: 'center',
                  opacity: loading ? 0.75 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    <span>Submitting to Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Project Request</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', color: '#4B5563', fontSize: 12 }}>
                🔒 End-to-end encrypted transmission. Saved directly into Supabase PostgreSQL.
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════
   FOOTER
   ════════════════════════════════ */
function Footer() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer style={{ position: 'relative', zIndex: 2, padding: 'clamp(48px,6vw,80px) 20px 40px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Separator line */}
        <div className="footer-separator" style={{ marginBottom: 56 }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
          gap: 40,
          marginBottom: 56,
        }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L28 9v14L16 30 4 23V9z" stroke="#10B981" strokeWidth="1.5" fill="rgba(16,185,129,0.08)"/>
                <path d="M16 8L22 11.5v7L16 22l-6-3.5v-7z" fill="#10B981" opacity="0.7"/>
              </svg>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em' }}>
                <span style={{ color: '#F5F5F5' }}>Future</span>
                <span style={{ color: '#10B981' }}>Builds</span>
              </span>
            </div>
            <p style={{ color: '#6B7280', fontSize: 13.5, lineHeight: 1.7, maxWidth: 220 }}>
              Engineering intelligent digital solutions for forward-thinking organizations worldwide.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontWeight: 700, color: '#F5F5F5', fontSize: 13, marginBottom: 16, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Navigation
            </div>
            {['home', 'about', 'services', 'process', 'contact'].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                style={{
                  display: 'block', background: 'none', border: 'none',
                  color: '#6B7280', fontSize: 14, cursor: 'pointer', padding: '5px 0',
                  fontFamily: 'Inter,sans-serif', textAlign: 'left', textTransform: 'capitalize',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#10B981')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
              >
                {id}
              </button>
            ))}
          </div>

          {/* Services */}
          <div>
            <div style={{ fontWeight: 700, color: '#F5F5F5', fontSize: 13, marginBottom: 16, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Services
            </div>
            {['AI Solutions', 'Web Development', 'Software Dev', 'Data Analytics', 'Automation'].map((s) => (
              <div key={s} style={{ color: '#6B7280', fontSize: 14, padding: '5px 0' }}>{s}</div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontWeight: 700, color: '#F5F5F5', fontSize: 13, marginBottom: 16, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Contact
            </div>
            <div style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.8 }}>
              <a
                href="mailto:gganu8615@gmail.com"
                style={{
                  color: '#6B7280',
                  textDecoration: 'none',
                  fontSize: 14,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#10B981')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
              >
                gganu8615@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div style={{ color: '#4B5563', fontSize: 13 }}>
            © {new Date().getFullYear()} FutureBuilds. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="pulse-dot" style={{ width: 6, height: 6 }} />
            <span style={{ color: '#6B7280', fontSize: 12 }}>
              Systems operational · Powered by Supabase PostgreSQL
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ════════════════════════════════
   MAIN PAGE
   ════════════════════════════════ */
export default function Home() {
  const [totalRequests, setTotalRequests] = useState(0)

  useScrollReveal()

  // Fetch project count from Supabase for the stats section
  useEffect(() => {
    fetch('/api/admin/projects')
      .then((r) => r.json())
      .then((d) => { if (d.success) setTotalRequests(d.data?.length ?? 0) })
      .catch(() => {})
  }, [])

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#F5F5F5', position: 'relative' }}>
      {/* 5-layer particle canvas background */}
      <TechBackground />

      {/* Floating navbar */}
      <Navbar />

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Hero onExplore={scrollToServices} />
        <About />
        <Services />
        <Statistics totalRequests={totalRequests} />
        <Process />
        <ProjectForm />
        <Footer />
      </div>
    </div>
  )
}
