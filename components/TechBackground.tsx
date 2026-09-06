'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseAlpha: number
  pulseSpeed: number
  pulseAngle: number
  layer: number // 1: dust, 2: small glow, 3: network node, 4: ambient
  color: 'emerald' | 'white' | 'dark'
}

/**
 * Sophisticated multi-layer particle background
 * Emerald Green + Charcoal palette — Premium, NOT neon gaming
 */
export default function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef<{ x: number | null; y: number | null }>({ x: null, y: null })
  const rafId = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width  = (canvas.width  = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let particles: Particle[] = []
    let orbAngle = 0

    // ── Resize ──
    const handleResize = () => {
      width  = canvas.width  = window.innerWidth
      height = canvas.height = window.innerHeight
      buildParticles()
    }

    // ── Mouse ──
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseLeave = () => {
      mousePos.current = { x: null, y: null }
    }

    window.addEventListener('resize',     handleResize)
    window.addEventListener('mousemove',  onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    // ── Build particle pool ──
    function buildParticles() {
      const isMobile = width < 768
      // Fewer, more intentional particles — premium look
      const total = isMobile ? 38 : 90
      particles = []

      for (let i = 0; i < total; i++) {
        const r = Math.random()
        let layer: number
        let size:  number
        let speed: number
        let color: Particle['color']

        if (r > 0.78) {
          // Layer 3: network nodes — emerald, connected
          layer = 3
          size  = 1.8 + Math.random() * 1.2
          speed = 0.30
          color = 'emerald'
        } else if (r > 0.48) {
          // Layer 2: medium glowing dots
          layer = 2
          size  = 1.2 + Math.random() * 0.8
          speed = 0.22
          color = Math.random() > 0.55 ? 'emerald' : 'dark'
        } else {
          // Layer 1: background dust — very subtle
          layer = 1
          size  = 0.7 + Math.random() * 0.6
          speed = 0.13
          color = Math.random() > 0.7 ? 'white' : 'dark'
        }

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size,
          // Keep base alpha low — premium restraint
          baseAlpha: layer === 3 ? (0.30 + Math.random() * 0.35)
                   : layer === 2 ? (0.18 + Math.random() * 0.22)
                   :               (0.08 + Math.random() * 0.12),
          pulseSpeed: 0.008 + Math.random() * 0.018,
          pulseAngle: Math.random() * Math.PI * 2,
          layer,
          color,
        })
      }
    }

    buildParticles()

    // ── Render loop ──
    function render() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      // ── Layer 4: Slow ambient emerald orbs (very subtle) ──
      orbAngle += 0.0018
      {
        const ox = width * 0.22 + Math.cos(orbAngle) * 120
        const oy = height * 0.28 + Math.sin(orbAngle * 0.8) * 90
        const g  = ctx.createRadialGradient(ox, oy, 0, ox, oy, Math.min(width, height) * 0.45)
        g.addColorStop(0,   'rgba(16, 185, 129, 0.055)')
        g.addColorStop(0.5, 'rgba(16, 185, 129, 0.018)')
        g.addColorStop(1,   'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, width, height)
      }
      {
        const ox = width  * 0.78 + Math.sin(orbAngle * 0.65) * 110
        const oy = height * 0.72 + Math.cos(orbAngle * 0.55) * 80
        const g  = ctx.createRadialGradient(ox, oy, 0, ox, oy, Math.min(width, height) * 0.38)
        g.addColorStop(0,   'rgba(4, 120, 87, 0.042)')
        g.addColorStop(0.6, 'rgba(4, 120, 87, 0.012)')
        g.addColorStop(1,   'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, width, height)
      }

      // ── Layer 5: Extremely subtle digital grid ──
      ctx.strokeStyle = 'rgba(255,255,255,0.012)'
      ctx.lineWidth   = 1
      const gs = 80
      for (let x = 0; x < width;  x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke() }
      for (let y = 0; y < height; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width,  y); ctx.stroke() }

      // ── Particles ──
      const mouse = mousePos.current
      const connDist = width < 768 ? 80 : 120
      const mouseDist = 140

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Soft mouse pull — very gentle
        if (mouse.x !== null && mouse.y !== null) {
          const dx   = mouse.x - p.x
          const dy   = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < mouseDist && dist > 0 && p.layer >= 2) {
            const force = (1 - dist / mouseDist) * 0.04
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        // Move + damp
        p.x  += p.vx
        p.y  += p.vy
        p.vx *= 0.988
        p.vy *= 0.988

        // Wrap
        if (p.x < -10) p.x = width  + 10
        if (p.x > width  + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        // Pulse
        p.pulseAngle += p.pulseSpeed
        const alpha = Math.max(0.04, p.baseAlpha + Math.sin(p.pulseAngle) * p.baseAlpha * 0.4)

        // ── Layer 3: Network connections ──
        if (p.layer === 3) {
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j]
            if (q.layer < 3) continue
            const dx = p.x - q.x
            const dy = p.y - q.y
            const d  = Math.sqrt(dx * dx + dy * dy)
            if (d < connDist) {
              const lineA = (1 - d / connDist) * 0.16
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(q.x, q.y)
              ctx.strokeStyle = `rgba(16, 185, 129, ${lineA})`
              ctx.lineWidth   = 0.7
              ctx.stroke()
            }
          }

          // Line to mouse
          if (mouse.x !== null && mouse.y !== null) {
            const dx = p.x - mouse.x
            const dy = p.y - mouse.y
            const d  = Math.sqrt(dx * dx + dy * dy)
            if (d < mouseDist) {
              const lineA = (1 - d / mouseDist) * 0.28
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(mouse.x, mouse.y)
              ctx.strokeStyle = `rgba(52, 211, 153, ${lineA})`
              ctx.lineWidth   = 0.9
              ctx.stroke()
            }
          }
        }

        // ── Draw particle ──
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)

        if (p.layer === 3) {
          ctx.fillStyle  = `rgba(16, 185, 129, ${alpha})`
          ctx.shadowColor = 'rgba(16, 185, 129, 0.6)'
          ctx.shadowBlur  = 6
          ctx.fill()
          ctx.shadowBlur  = 0
        } else if (p.layer === 2) {
          if (p.color === 'emerald') {
            ctx.fillStyle = `rgba(4, 120, 87, ${alpha})`
            ctx.shadowColor = 'rgba(16, 185, 129, 0.3)'
            ctx.shadowBlur  = 3
            ctx.fill()
            ctx.shadowBlur  = 0
          } else {
            ctx.fillStyle = `rgba(80, 80, 80, ${alpha})`
            ctx.fill()
          }
        } else {
          // Dust: near-invisible
          const dustColor = p.color === 'white'
            ? `rgba(220, 220, 220, ${alpha})`
            : `rgba(50, 50, 50, ${alpha})`
          ctx.fillStyle = dustColor
          ctx.fill()
        }
      }

      rafId.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize',     handleResize)
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width:  '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        background: '#0a0a0a',
      }}
    />
  )
}
