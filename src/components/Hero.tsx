import { ShieldCheck, Ruler } from 'lucide-react'

export default function Hero() {
  return (
    <section className="container-page pt-14 pb-10 sm:pt-20 sm:pb-14">
      <div className="max-w-2xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-soft">
          <Ruler size={14} className="text-accent" aria-hidden="true" />
          Private, in-browser calculation
        </div>
        <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          Understand your BMI in seconds
        </h1>
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-soft">
          Enter your height and weight for a quick, private calculation with a clear explanation of your
          result — no account, no upload, no judgment.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#calculator"
            className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
          >
            Calculate BMI
          </a>
          <span className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
            <ShieldCheck size={16} className="text-accent" aria-hidden="true" />
            Nothing you enter leaves your device
          </span>
        </div>
      </div>
    </section>
  )
}
