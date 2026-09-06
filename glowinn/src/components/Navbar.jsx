import { useState, useEffect } from 'react'
import { Cloudmark, MenuIcon } from './icons'
import './Navbar.css'

const LINKS = ['Home', 'Products', 'Our business', 'Clients', 'About']

export default function Navbar() {
  const [active, setActive] = useState('Home')
  const [open, setOpen] = useState(false)

  // Lock body scroll while mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleLink = (label) => {
    setActive(label)
    setOpen(false)
  }

  return (
    <header className="nav">
      <div className="nav__inner shell">
        {/* 1. Brand */}
        <a className="nav__brand" href="#top">
          <Cloudmark size={19} />
          <span>Glowinn</span>
        </a>

        {/* 2. Centred rail */}
        <nav className="nav__rail" aria-label="Primary">
          {LINKS.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
              className={active === label ? 'is-active' : ''}
              onClick={() => handleLink(label)}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* 3. Actions */}
        <div className="nav__actions">
          <a className="nav__register" href="#register">Register</a>
          <a className="btn btn--ink" href="#buy">Buy Now</a>
        </div>

        {/* 4. Mobile toggle */}
        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <MenuIcon open={open} size={20} />
        </button>
      </div>

      {/* Mobile sheet — sibling of .nav__inner */}
      {open && (
        <div className="nav__sheet">
          {LINKS.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
              className={active === label ? 'is-active' : ''}
              onClick={() => handleLink(label)}
            >
              {label}
            </a>
          ))}
          <a className="nav__register" href="#register" onClick={() => setOpen(false)}>
            Register
          </a>
          <a
            className="btn btn--pearl"
            href="#buy"
            onClick={() => setOpen(false)}
          >
            Buy Now
          </a>
        </div>
      )}
    </header>
  )
}
