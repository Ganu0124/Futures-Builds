'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, ProjectRequest } from '@/lib/supabase'
import TechBackground from '@/components/TechBackground'
import { downloadCSV, downloadXLSX } from '@/lib/export-utils'

/* ═══════════════════════════════════
   ANIMATED COUNTER HOOK
   ═══════════════════════════════════ */
function useAnimatedCount(target: number, delay = 0) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) { setCount(0); return }
    const t = setTimeout(() => {
      let frame = 0
      const frames = 36
      const step   = target / frames
      let cur      = 0
      const id = setInterval(() => {
        frame++
        cur += step
        if (frame >= frames) { setCount(target); clearInterval(id) }
        else setCount(Math.floor(cur))
      }, 900 / frames)
      return () => clearInterval(id)
    }, delay)
    return () => clearTimeout(t)
  }, [target, delay])
  return count
}

/* ═══════════════════════════════════
   STAT CARD
   ═══════════════════════════════════ */
function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: number; sub: string }) {
  const animated = useAnimatedCount(value)
  return (
    <div
      className="stat-card"
      style={{
        background: 'rgba(17,17,17,0.90)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 18,
        padding: '24px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: "'Space Grotesk',sans-serif" }}>
          {label}
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>
          {icon}
        </div>
      </div>
      <div>
        <div style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: 'clamp(28px,3vw,38px)',
          fontWeight: 800,
          color: '#10B981',
          lineHeight: 1,
          marginBottom: 4,
          letterSpacing: '-0.02em',
        }}>
          {animated}
        </div>
        <div style={{ fontSize: 12, color: '#4B5563' }}>{sub}</div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════
   DETAIL MODAL
   ═══════════════════════════════════ */
function DetailModal({ project, onClose }: { project: ProjectRequest; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 19, fontWeight: 700, color: '#F5F5F5' }}>
              Project Request Details
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 8, color: '#6B7280', width: 32, height: 32,
              cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          {[
            { label: 'Email Address',  value: project.email         },
            { label: 'Phone Number',   value: project.phone_number  },
            { label: 'Project Title',  value: project.project_title },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12 }}>
              <span style={{ color: '#4B5563', fontSize: 12.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'start', paddingTop: 2 }}>
                {label}
              </span>
              <span style={{ color: '#F5F5F5', fontSize: 14, fontWeight: 500, wordBreak: 'break-word' }}>
                {value}
              </span>
            </div>
          ))}

          <div>
            <div style={{ color: '#4B5563', fontSize: 12.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Project Description
            </div>
            <div style={{
              background: 'rgba(5,5,5,0.90)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '14px 16px',
              color: '#A3A3A3', fontSize: 13.5, lineHeight: 1.75, whiteSpace: 'pre-wrap',
            }}>
              {project.project_description}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12 }}>
            <span style={{ color: '#4B5563', fontSize: 12.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Submitted
            </span>
            <span style={{ color: '#10B981', fontSize: 13, fontFamily: "'JetBrains Mono',monospace" }}>
              {new Date(project.created_at).toLocaleString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12 }}>
            <span style={{ color: '#4B5563', fontSize: 12.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Record ID
            </span>
            <span style={{ color: '#374151', fontSize: 11, fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {project.id}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-secondary"
          style={{ marginTop: 28, width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14 }}
        >
          Close
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════ */
export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'requests' | 'export' | 'settings'>('dashboard')
  const [projects, setProjects] = useState<ProjectRequest[]>([])
  const [loading,     setLoading]     = useState(true)
  const [refreshing,  setRefreshing]  = useState(false)
  const [search,      setSearch]      = useState('')
  const [selected,    setSelected]    = useState<ProjectRequest | null>(null)
  const [exportingCsv,  setExportingCsv]  = useState(false)
  const [exportingXlsx, setExportingXlsx] = useState(false)
  const [toast, setToast] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [deletingId,  setDeletingId]  = useState<string | null>(null)
  const [notifyingId, setNotifyingId] = useState<string | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast(msg); setToastType(type)
    setTimeout(() => setToast(''), 4000)
  }

  /* ── Fetch ── */
  const fetchProjects = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true); else setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      const res  = await fetch(`/api/admin/projects?${params}`)
      const json = await res.json()
      if (json.success) {
        setProjects(json.data || [])
        if (manual) showToast('Records synchronized from Supabase.')
      } else {
        showToast(json.message || 'Failed to fetch records.', 'error')
      }
    } catch {
      showToast('Network error fetching data.', 'error')
    } finally {
      setLoading(false); setRefreshing(false)
    }
  }, [search])

  /* ── Auth guard ── */
  useEffect(() => {
    const check = async () => {
      const cookie = typeof document !== 'undefined' && document.cookie.includes('admin_token=authenticated_admin')
      if (cookie) return
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/admin/login')
    }
    check()
  }, [router])

  /* ── Debounced search ── */
  useEffect(() => {
    const t = setTimeout(() => fetchProjects(false), 300)
    return () => clearTimeout(t)
  }, [fetchProjects])

  /* ── Delete ── */
  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this record from Supabase?')) return
    setDeletingId(id)
    try {
      const res  = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setProjects((p) => p.filter((r) => r.id !== id))
        showToast('Record deleted from Supabase.')
      } else {
        showToast(json.message || 'Delete failed.', 'error')
      }
    } catch {
      showToast('Network error.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  /* ── Notify (Accept / Reject) ── */
  const handleNotify = async (project: ProjectRequest, decision: 'accepted' | 'rejected') => {
    const verb = decision === 'accepted' ? 'accept' : 'reject'
    if (!confirm(`Send a ${verb}ance email to ${project.email}?`)) return
    setNotifyingId(`${project.id}-${decision}`)
    try {
      const res  = await fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:        project.email,
          projectTitle: project.project_title,
          decision,
        }),
      })
      const json = await res.json()
      if (json.success) {
        showToast(`✓ ${decision === 'accepted' ? 'Acceptance' : 'Rejection'} email sent to ${project.email}.`)
      } else {
        showToast(json.message || 'Failed to send email.', 'error')
      }
    } catch {
      showToast('Network error sending email.', 'error')
    } finally {
      setNotifyingId(null)
    }
  }

  /* ── Export CSV ── */
  const handleExportCSV = async () => {
    setExportingCsv(true)
    try {
      const res  = await fetch('/api/admin/projects')
      const json = await res.json()
      const data: ProjectRequest[] = json.success ? json.data : projects
      if (!data?.length) { showToast('No data available to export.', 'error'); return }
      const result = downloadCSV(data)
      if (result.success) showToast('CSV downloaded: futurebuilds-project-requests.csv')
      else showToast(result.message || 'CSV export failed.', 'error')
    } catch (e: any) {
      showToast(e?.message || 'Export error.', 'error')
    } finally {
      setExportingCsv(false)
    }
  }

  /* ── Export XLSX ── */
  const handleExportXLSX = async () => {
    setExportingXlsx(true)
    try {
      const res  = await fetch('/api/admin/projects')
      const json = await res.json()
      const data: ProjectRequest[] = json.success ? json.data : projects
      if (!data?.length) { showToast('No data available to export.', 'error'); return }
      const result = downloadXLSX(data)
      if (result.success) showToast('Excel downloaded: futurebuilds-project-requests.xlsx')
      else showToast(result.message || 'XLSX export failed.', 'error')
    } catch (e: any) {
      showToast(e?.message || 'Export error.', 'error')
    } finally {
      setExportingXlsx(false)
    }
  }

  /* ── Logout ── */
  const handleLogout = async () => {
    if (typeof document !== 'undefined') document.cookie = 'admin_token=; path=/; max-age=0'
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  /* ── Stats ── */
  const stats = useMemo(() => {
    const total    = projects.length
    const emails   = new Set(projects.map((p) => p.email.toLowerCase())).size
    const oneDay   = 24 * 60 * 60 * 1000
    const recent   = projects.filter((p) => Date.now() - new Date(p.created_at).getTime() <= oneDay).length
    return { total, emails, recent }
  }, [projects])

  /* ── NAV items ── */
  const navItems: { id: typeof activeTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard',        icon: '◈' },
    { id: 'requests',  label: 'Project Requests', icon: '≡' },
    { id: 'export',    label: 'Export Data',      icon: '↓' },
    { id: 'settings',  label: 'Settings',         icon: '⚙' },
  ]

  /* ── Sidebar button style ── */
  const navStyle = (id: string): React.CSSProperties => {
    const on = activeTab === id
    return {
      width: '100%',
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 14px',
      borderRadius: 10,
      border: on ? '1px solid rgba(16,185,129,0.25)' : '1px solid transparent',
      background: on ? 'rgba(16,185,129,0.08)' : 'transparent',
      color: on ? '#10B981' : '#6B7280',
      fontWeight: on ? 600 : 500,
      fontSize: 14,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'Inter,sans-serif',
      textAlign: 'left',
      letterSpacing: '0.01em',
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#F5F5F5', display: 'flex', position: 'relative' }}>
      <TechBackground />

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 999,
          background: toastType === 'success' ? 'rgba(17,17,17,0.98)' : 'rgba(40,8,8,0.98)',
          border: `1px solid ${toastType === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
          color: toastType === 'success' ? '#10B981' : '#F87171',
          padding: '12px 20px', borderRadius: 12, fontSize: 13.5, fontWeight: 600,
          boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', gap: 10,
          backdropFilter: 'blur(20px)', maxWidth: 400,
          animation: 'modalEnter 0.25s ease-out',
        }}>
          <span>{toastType === 'success' ? '✓' : '⚠'}</span>
          <span>{toast}</span>
        </div>
      )}

      {/* ════ SIDEBAR ════ */}
      <aside style={{
        width: 248,
        background: 'rgba(10,10,10,0.92)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '24px 16px',
        position: 'sticky', top: 0, height: '100vh',
        zIndex: 40, flexShrink: 0,
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, paddingLeft: 4 }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L28 9v14L16 30 4 23V9z" stroke="#10B981" strokeWidth="1.5" fill="rgba(16,185,129,0.08)"/>
              <path d="M16 8L22 11.5v7L16 22l-6-3.5v-7z" fill="#10B981" opacity="0.7"/>
            </svg>
            <div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: '-0.03em' }}>
                <span style={{ color: '#F5F5F5' }}>Future</span>
                <span style={{ color: '#10B981' }}>Builds</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                Admin Portal
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'grid', gap: 4 }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={navStyle(item.id)}
              >
                <span style={{ fontSize: 15, width: 18, textAlign: 'center', opacity: 0.9 }}>{item.icon}</span>
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <div style={{
                    marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%',
                    background: '#10B981', boxShadow: '0 0 6px #10B981',
                  }} />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div>
          <div style={{
            padding: '10px 12px', borderRadius: 10, marginBottom: 12,
            background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div className="pulse-dot" style={{ width: 6, height: 6 }} />
            <div>
              <div style={{ color: '#F5F5F5', fontSize: 12, fontWeight: 600 }}>Supabase Database</div>
              <div style={{ color: '#10B981', fontSize: 10.5, fontFamily: "'JetBrains Mono',monospace" }}>Live Synchronized</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10,
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)',
              color: '#EF4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
              fontFamily: 'Inter,sans-serif', transition: 'all 0.2s',
            }}
          >
            <span>⎋</span> Sign Out
          </button>
        </div>
      </aside>

      {/* ════ MAIN CONTENT ════ */}
      <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 10 }}>

        {/* Top bar */}
        <header style={{
          height: 64,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(10,10,10,0.88)',
          backdropFilter: 'blur(20px)',
          padding: '0 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="pulse-dot" style={{ width: 6, height: 6 }} />
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#10B981',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              fontFamily: "'JetBrains Mono',monospace",
            }}>
              Supabase PostgreSQL Active
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: '7px 16px', fontSize: 13 }}
            >
              ↗ View Website
            </a>
            <button
              onClick={() => fetchProjects(true)}
              disabled={refreshing}
              className="btn-secondary"
              style={{ padding: '7px 16px', fontSize: 13 }}
            >
              {refreshing ? <><div className="spinner" /><span>Syncing…</span></> : <><span>↻</span><span>Refresh</span></>}
            </button>
          </div>
        </header>

        <main style={{ padding: 'clamp(24px,3vw,40px)', maxWidth: 1360 }}>

          {/* Page title */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 'clamp(24px,3vw,32px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#F5F5F5',
              marginBottom: 6,
            }}>
              Project Requests{' '}
              <span style={{ color: '#10B981' }}>Command Center</span>
            </h1>
            <p style={{ color: '#6B7280', fontSize: 14 }}>
              Real-time telemetry and client submissions from the{' '}
              <code style={{ color: '#10B981', background: 'rgba(16,185,129,0.08)', padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>
                project_requests
              </code>{' '}
              table.
            </p>
          </div>

          {/* ── Stat cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
            <StatCard icon="📋" label="Total Requests"  value={stats.total}  sub="All-time Supabase records"     />
            <StatCard icon="✦"  label="New Requests"    value={stats.total}  sub="Awaiting review"               />
            <StatCard icon="👤" label="Unique Emails"   value={stats.emails} sub="Distinct client contacts"      />
            <StatCard icon="⚡" label="Recent (24h)"    value={stats.recent} sub="Submitted in last 24 hours"    />
          </div>

          {/* ── Export Engine ── */}
          <div style={{
            background: 'rgba(17,17,17,0.90)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18, padding: '22px 24px', marginBottom: 22,
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 18,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.40), transparent)',
            }} />
            <div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, color: '#F5F5F5', marginBottom: 4 }}>
                Export Data Engine
              </div>
              <div style={{ color: '#6B7280', fontSize: 13 }}>
                Download live Supabase records as formatted CSV or Excel files.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={handleExportCSV}
                disabled={exportingCsv}
                className="btn-export-csv"
                style={{ padding: '11px 20px', fontSize: 13.5, opacity: exportingCsv ? 0.7 : 1, cursor: exportingCsv ? 'not-allowed' : 'pointer' }}
              >
                {exportingCsv ? <><div className="spinner" /><span>Preparing CSV…</span></> : <><span>⬇</span><span>Export CSV (.csv)</span></>}
              </button>
              <button
                onClick={handleExportXLSX}
                disabled={exportingXlsx}
                className="btn-export-xlsx"
                style={{ padding: '11px 20px', fontSize: 13.5, opacity: exportingXlsx ? 0.7 : 1, cursor: exportingXlsx ? 'not-allowed' : 'pointer' }}
              >
                {exportingXlsx ? <><div className="spinner" /><span>Preparing Excel…</span></> : <><span>📊</span><span>Export Excel (.xlsx)</span></>}
              </button>
            </div>
          </div>

          {/* ── Search ── */}
          <div style={{
            background: 'rgba(17,17,17,0.90)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: '14px 20px', marginBottom: 18,
            display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
          }}>
            <div style={{ position: 'relative', flex: '1 1 300px', minWidth: 200 }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#10B981', fontSize: 14, pointerEvents: 'none' }}>
                ⌕
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email, phone number, or project title…"
                className="form-input"
                style={{ paddingLeft: 36, fontSize: 14, background: 'transparent', border: 'none', boxShadow: 'none' }}
              />
            </div>
            <span style={{ color: '#6B7280', fontSize: 13, flexShrink: 0 }}>
              Showing <strong style={{ color: '#F5F5F5' }}>{projects.length}</strong> record{projects.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* ── Table ── */}
          <div style={{
            background: 'rgba(17,17,17,0.90)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18, overflow: 'hidden',
          }}>
            {loading ? (
              <div style={{ padding: 60, textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 14px', width: 30, height: 30 }} />
                <p style={{ color: '#6B7280', fontSize: 14 }}>Fetching records from Supabase…</p>
              </div>
            ) : projects.length === 0 ? (
              <div style={{ padding: 60, textAlign: 'center' }}>
                <div style={{ fontSize: 42, marginBottom: 14 }}>📭</div>
                <p style={{ color: '#F5F5F5', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                  {search ? 'No matching records found.' : 'No project requests yet.'}
                </p>
                <p style={{ color: '#6B7280', fontSize: 13 }}>
                  {search ? 'Adjust your search query.' : 'Submissions from the website form will appear here.'}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>#</th>
                      <th>Email Address</th>
                      <th>Phone Number</th>
                      <th>Project Title</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'center', width: 140 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p, i) => (
                      <tr key={p.id || i}>
                        <td style={{ color: '#374151', fontSize: 12 }}>{i + 1}</td>
                        <td style={{ color: '#F5F5F5', fontWeight: 600, fontSize: 13.5 }}>{p.email}</td>
                        <td style={{ color: '#A3A3A3', fontSize: 13 }}>{p.phone_number}</td>
                        <td>
                          <div style={{ color: '#10B981', fontWeight: 600, fontSize: 13.5, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.project_title}>
                            {p.project_title}
                          </div>
                        </td>
                        <td>
                          <div style={{ color: '#6B7280', fontSize: 13, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.project_description}>
                            {p.project_description}
                          </div>
                        </td>
                        <td style={{ color: '#4B5563', fontSize: 12, whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono',monospace" }}>
                          {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {/* Accept */}
                            <button
                              onClick={() => handleNotify(p, 'accepted')}
                              disabled={notifyingId === `${p.id}-accepted`}
                              title="Send Acceptance Email"
                              style={{
                                background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.28)',
                                color: '#10B981', padding: '5px 10px', borderRadius: 7,
                                cursor: notifyingId === `${p.id}-accepted` ? 'not-allowed' : 'pointer',
                                fontSize: 13, opacity: notifyingId === `${p.id}-accepted` ? 0.5 : 1,
                                transition: 'all 0.2s', fontWeight: 600,
                              }}
                            >
                              {notifyingId === `${p.id}-accepted` ? '…' : '✓'}
                            </button>
                            {/* Reject */}
                            <button
                              onClick={() => handleNotify(p, 'rejected')}
                              disabled={notifyingId === `${p.id}-rejected`}
                              title="Send Rejection Email"
                              style={{
                                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
                                color: '#F59E0B', padding: '5px 10px', borderRadius: 7,
                                cursor: notifyingId === `${p.id}-rejected` ? 'not-allowed' : 'pointer',
                                fontSize: 13, opacity: notifyingId === `${p.id}-rejected` ? 0.5 : 1,
                                transition: 'all 0.2s', fontWeight: 600,
                              }}
                            >
                              {notifyingId === `${p.id}-rejected` ? '…' : '✗'}
                            </button>
                            {/* View */}
                            <button
                              onClick={() => setSelected(p)}
                              title="View Details"
                              style={{
                                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
                                color: '#6B7280', padding: '5px 10px', borderRadius: 7,
                                cursor: 'pointer', fontSize: 13, transition: 'all 0.2s',
                              }}
                            >
                              ↗
                            </button>
                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(p.id)}
                              disabled={deletingId === p.id}
                              title="Delete Record"
                              style={{
                                background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
                                color: '#EF4444', padding: '5px 10px', borderRadius: 7,
                                cursor: deletingId === p.id ? 'not-allowed' : 'pointer',
                                fontSize: 13, opacity: deletingId === p.id ? 0.5 : 1, transition: 'all 0.2s',
                              }}
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && projects.length > 0 && (
              <div style={{
                padding: '14px 22px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(10,10,10,0.60)',
              }}>
                <span style={{ color: '#6B7280', fontSize: 12.5 }}>
                  Total: <strong style={{ color: '#10B981' }}>{projects.length}</strong> record{projects.length !== 1 ? 's' : ''}
                </span>
                <code style={{ color: '#374151', fontSize: 11 }}>public.project_requests</code>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail modal */}
      {selected && <DetailModal project={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
