import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-5xl font-bold text-ink">404</p>
      <p className="mt-3 text-ink-soft">This page doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
      >
        Back to BodyMetric
      </Link>
    </div>
  )
}
