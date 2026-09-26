import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo />
          <p className="mt-2 max-w-sm text-sm text-ink-soft">
            A free, private BMI calculator. Calculations happen in your browser — nothing you enter is
            uploaded or stored on a server.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
          <Link to="/privacy" className="hover:text-ink transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-ink transition-colors">
            Terms of Use
          </Link>
          <a href="/#faq" className="hover:text-ink transition-colors">
            FAQ
          </a>
        </nav>
      </div>
      <div className="container-page mt-8 text-xs text-ink-soft/70">
        BodyMetric provides general information only and is not medical advice.
      </div>
    </footer>
  )
}
