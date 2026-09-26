import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

export default function Nav() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  const sectionLink = (hash: string, label: string) =>
    isHome ? (
      <a href={`#${hash}`} className="hover:text-ink transition-colors">
        {label}
      </a>
    ) : (
      <Link to={`/#${hash}`} className="hover:text-ink transition-colors">
        {label}
      </Link>
    )

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" aria-label="BodyMetric home">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-ink-soft sm:flex">
          {sectionLink('calculator', 'Calculator')}
          {sectionLink('how-it-works', 'How it works')}
          {sectionLink('faq', 'FAQ')}
        </nav>
        <a
          href={isHome ? '#calculator' : '/#calculator'}
          className="inline-flex h-10 items-center rounded-full bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
        >
          Calculate BMI
        </a>
      </div>
    </header>
  )
}
