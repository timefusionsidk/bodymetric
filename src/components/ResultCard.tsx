import type { RefObject } from 'react'
import { Info, ExternalLink } from 'lucide-react'
import {
  CATEGORY_LABEL,
  CATEGORY_RANGE_LABEL,
  healthyWeightRangeKg,
  kgToLb,
  type AdultCategory,
  type AgeBand,
  type UnitSystem,
} from '../lib/bmi'

export interface BmiResult {
  unit: UnitSystem
  heightCm: number
  weightKg: number
  age: number
  ageBand: AgeBand
  bmi: number
  unroundedBmi: number
  category: AdultCategory | null
}

interface ResultCardProps {
  result: BmiResult | null
  resultRef: RefObject<HTMLDivElement>
}

const CATEGORY_STYLES: Record<AdultCategory, { text: string; bg: string; bar: string }> = {
  underweight: { text: 'text-category-under', bg: 'bg-category-under-bg', bar: 'bg-category-under' },
  healthy: { text: 'text-category-healthy', bg: 'bg-category-healthy-bg', bar: 'bg-category-healthy' },
  overweight: { text: 'text-category-over', bg: 'bg-category-over-bg', bar: 'bg-category-over' },
  obesity: { text: 'text-category-obesity', bg: 'bg-category-obesity-bg', bar: 'bg-category-obesity' },
}

// Range indicator boundaries, mapped onto a fixed visual scale from 15 to 35+
// so the marker position is meaningful without needing a dynamic axis.
const SCALE_MIN = 15
const SCALE_MAX = 35

function scalePosition(bmi: number): number {
  const clamped = Math.min(Math.max(bmi, SCALE_MIN), SCALE_MAX)
  return ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100
}

function RangeIndicator({ bmi, category }: { bmi: number; category: AdultCategory }) {
  const segments: { key: AdultCategory; from: number; to: number }[] = [
    { key: 'underweight', from: SCALE_MIN, to: 18.5 },
    { key: 'healthy', from: 18.5, to: 25 },
    { key: 'overweight', from: 25, to: 30 },
    { key: 'obesity', from: 30, to: SCALE_MAX },
  ]
  const markerLeft = scalePosition(bmi)

  return (
    <div className="mt-5">
      <div className="relative h-2.5 w-full overflow-hidden rounded-full">
        <div className="flex h-full w-full">
          {segments.map((seg) => (
            <div
              key={seg.key}
              className={CATEGORY_STYLES[seg.key].bar}
              style={{ width: `${((seg.to - seg.from) / (SCALE_MAX - SCALE_MIN)) * 100}%` }}
            />
          ))}
        </div>
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-ink shadow-sm"
          style={{ left: `${markerLeft}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1 text-[11px] text-ink-soft">
        {segments.map((seg) => (
          <div key={seg.key} className={seg.key === category ? 'font-semibold text-ink' : ''}>
            {CATEGORY_LABEL[seg.key]}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ResultCard({ result, resultRef }: ResultCardProps) {
  if (!result) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/60 p-8 text-center">
        <p className="text-sm text-ink-soft">
          Enter your age, height, and weight, then select <span className="font-medium text-ink">Calculate BMI</span> to
          see your result here.
        </p>
      </div>
    )
  }

  const heightLabel =
    result.unit === 'metric' ? `${round1(result.heightCm)} cm` : formatFtIn(result.heightCm)
  const weightLabel =
    result.unit === 'metric' ? `${round1(result.weightKg)} kg` : `${round1(kgToLb(result.weightKg))} lb`

  if (result.ageBand === 'too-young') {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        aria-live="polite"
        className="animate-rise rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex items-start gap-3">
          <Info size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <h3 className="text-base font-semibold text-ink">BMI isn't interpreted under age 2</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              BMI-for-age references don't cover children under 2. For a child this young, growth is best
              tracked by a pediatrician using weight-for-length and head circumference charts, not BMI. Please
              talk to your child's doctor about their growth.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (result.ageBand === 'child-teen') {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        aria-live="polite"
        className="animate-rise rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8"
      >
        <p className="text-sm font-medium text-ink-soft">Mathematical BMI</p>
        <p className="mt-1 font-display text-6xl font-bold tracking-tight text-ink">{result.bmi.toFixed(1)}</p>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          This is the raw height-to-weight calculation only. For ages 2–19, BMI is interpreted using
          sex- and age-specific percentiles on a growth chart, not the fixed adult categories — the same BMI
          number can mean something different for two children of different ages. BodyMetric doesn't display an
          adult category or a percentile here, so nothing is misapplied.
        </p>
        <a
          href="https://www.cdc.gov/bmi/child-teen-calculator/index.html"
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-deep"
        >
          Use the CDC's Child and Teen BMI Calculator
          <ExternalLink size={14} aria-hidden="true" />
        </a>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
          <div>
            <dt className="text-ink-soft">Height</dt>
            <dd className="font-medium text-ink">{heightLabel}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Weight</dt>
            <dd className="font-medium text-ink">{weightLabel}</dd>
          </div>
        </dl>
      </div>
    )
  }

  // Adult
  const category = result.category as AdultCategory
  const styles = CATEGORY_STYLES[category]
  const range = healthyWeightRangeKg(result.heightCm)
  const rangeLabel =
    result.unit === 'metric'
      ? `${round1(range.minKg)}–${round1(range.maxKg)} kg`
      : `${round1(kgToLb(range.minKg))}–${round1(kgToLb(range.maxKg))} lb`

  return (
    <div
      ref={resultRef}
      tabIndex={-1}
      aria-live="polite"
      className="animate-rise rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8"
    >
      <p className="text-sm font-medium text-ink-soft">Your BMI</p>
      <div className="mt-1 flex flex-wrap items-baseline gap-3">
        <span className="font-display text-6xl font-bold tracking-tight text-ink">{result.bmi.toFixed(1)}</span>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${styles.bg} ${styles.text}`}>
          {CATEGORY_LABEL[category]}
        </span>
      </div>

      <RangeIndicator bmi={result.unroundedBmi} category={category} />

      <p className="mt-5 text-sm leading-relaxed text-ink-soft">
        A BMI of {result.bmi.toFixed(1)} falls in the <span className="font-medium text-ink">{CATEGORY_LABEL[category].toLowerCase()}</span> range
        ({CATEGORY_RANGE_LABEL[category]}) for adults. BMI is a screening measure based on height and weight —
        it doesn't directly measure body fat and doesn't diagnose a health condition. Muscle mass, bone
        density, age, and body composition can all affect how well it reflects an individual's health.
      </p>

      <div className="mt-5 rounded-xl bg-paper p-4 text-sm">
        <p className="font-medium text-ink">BMI-based reference interval</p>
        <p className="mt-1 text-ink-soft">
          At {heightLabel}, a BMI of 18.5–24.9 corresponds mathematically to about{' '}
          <span className="font-medium text-ink">{rangeLabel}</span>. This is a calculated interval, not an
          individual target or goal weight.
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
        <div>
          <dt className="text-ink-soft">Height</dt>
          <dd className="font-medium text-ink">{heightLabel}</dd>
        </div>
        <div>
          <dt className="text-ink-soft">Weight</dt>
          <dd className="font-medium text-ink">{weightLabel}</dd>
        </div>
      </dl>
    </div>
  )
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

function formatFtIn(heightCm: number): string {
  const totalInches = heightCm / 2.54
  const ft = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches - ft * 12)
  return `${ft} ft ${inches} in`
}
