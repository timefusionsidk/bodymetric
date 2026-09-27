import { useEffect } from 'react'

export default function Contact() {
  useEffect(() => { document.title = 'Contact | BodyMetric' }, [])
  return <div className="container-page py-14 sm:py-20"><div className="max-w-prose"><h1 className="text-3xl font-bold tracking-tight">Contact BodyMetric</h1><p className="mt-4 leading-relaxed text-ink-soft">For feedback, accessibility concerns, or questions about this calculator, contact the project support page. Please do not include private health details.</p><a className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white" href="https://github.com/timefusionsidk/bodymetric/issues/new" target="_blank" rel="noreferrer">Contact project support</a><p className="mt-6 text-sm text-ink-soft">BodyMetric provides general information only and cannot provide medical advice.</p></div></div>
}
