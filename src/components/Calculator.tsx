import { useRef, useState, type FormEvent } from 'react'
import { RotateCcw, Calculator as CalculatorIcon } from 'lucide-react'
import {
  ftInToCm,
  cmToFtIn,
  lbToKg,
  kgToLb,
  calculateBmi,
  roundBmi,
  classifyAdultBmi,
  getAgeBand,
  validateAge,
  validateMetricHeight,
  validateMetricWeight,
  validateImperialHeight,
  validateImperialWeight,
  type FieldError,
  type UnitSystem,
} from '../lib/bmi'
import ResultCard, { type BmiResult } from './ResultCard'

const round1 = (n: number) => Math.round(n * 10) / 10

export default function Calculator() {
  const [unit, setUnit] = useState<UnitSystem>('metric')
  const [ageRaw, setAgeRaw] = useState('')
  const [heightCmRaw, setHeightCmRaw] = useState('')
  const [weightKgRaw, setWeightKgRaw] = useState('')
  const [heightFtRaw, setHeightFtRaw] = useState('')
  const [heightInRaw, setHeightInRaw] = useState('')
  const [weightLbRaw, setWeightLbRaw] = useState('')
  const [errors, setErrors] = useState<FieldError[]>([])
  const [result, setResult] = useState<BmiResult | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  function errorFor(field: string): string | undefined {
    return errors.find((e) => e.field === field)?.message
  }

  function switchUnit(next: UnitSystem) {
    if (next === unit) return

    if (next === 'imperial') {
      // Convert current metric values into imperial fields, if valid.
      const h = Number(heightCmRaw)
      const w = Number(weightKgRaw)
      if (heightCmRaw.trim() !== '' && Number.isFinite(h) && h > 0) {
        const { ft, inches } = cmToFtIn(h)
        setHeightFtRaw(String(Math.floor(ft)))
        setHeightInRaw(String(round1(inches)))
      }
      if (weightKgRaw.trim() !== '' && Number.isFinite(w) && w > 0) {
        setWeightLbRaw(String(round1(kgToLb(w))))
      }
    } else {
      // Convert current imperial values into metric fields, if valid.
      const ft = heightFtRaw.trim() === '' ? 0 : Number(heightFtRaw)
      const inches = heightInRaw.trim() === '' ? 0 : Number(heightInRaw)
      const lb = Number(weightLbRaw)
      if ((heightFtRaw.trim() !== '' || heightInRaw.trim() !== '') && Number.isFinite(ft) && Number.isFinite(inches)) {
        setHeightCmRaw(String(round1(ftInToCm(ft, inches))))
      }
      if (weightLbRaw.trim() !== '' && Number.isFinite(lb) && lb > 0) {
        setWeightKgRaw(String(round1(lbToKg(lb))))
      }
    }

    setUnit(next)
    setErrors([])
  }

  function handleReset() {
    setAgeRaw('')
    setHeightCmRaw('')
    setWeightKgRaw('')
    setHeightFtRaw('')
    setHeightInRaw('')
    setWeightLbRaw('')
    setErrors([])
    setResult(null)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const nextErrors: FieldError[] = []
    const ageError = validateAge(ageRaw)
    if (ageError) nextErrors.push(ageError)

    let heightCm: number
    let weightKg: number

    if (unit === 'metric') {
      const hErr = validateMetricHeight(heightCmRaw)
      const wErr = validateMetricWeight(weightKgRaw)
      if (hErr) nextErrors.push(hErr)
      if (wErr) nextErrors.push(wErr)
      heightCm = Number(heightCmRaw)
      weightKg = Number(weightKgRaw)
    } else {
      const hErr = validateImperialHeight(heightFtRaw, heightInRaw)
      const wErr = validateImperialWeight(weightLbRaw)
      if (hErr) nextErrors.push(hErr)
      if (wErr) nextErrors.push(wErr)
      const ft = heightFtRaw.trim() === '' ? 0 : Number(heightFtRaw)
      const inches = heightInRaw.trim() === '' ? 0 : Number(heightInRaw)
      heightCm = ftInToCm(ft, inches)
      weightKg = lbToKg(Number(weightLbRaw))
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors)
      setResult(null)
      return
    }

    setErrors([])

    const age = Number(ageRaw)
    const ageBand = getAgeBand(age)
    const unroundedBmi = calculateBmi(heightCm, weightKg)
    const bmi = roundBmi(unroundedBmi)

    const next: BmiResult = {
      unit,
      heightCm,
      weightKg,
      age,
      ageBand,
      bmi,
      unroundedBmi,
      category: ageBand === 'adult' ? classifyAdultBmi(unroundedBmi) : null,
    }

    setResult(next)

    // Announce to screen readers and move focus to the result.
    requestAnimationFrame(() => {
      resultRef.current?.focus()
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(30,33,38,0.04),0_8px_24px_rgba(30,33,38,0.04)] sm:p-8"
      >
        <div className="mb-6 flex items-center gap-2 text-ink-soft">
          <CalculatorIcon size={18} aria-hidden="true" />
          <h2 className="text-base font-semibold text-ink">Your measurements</h2>
        </div>

        {/* Unit switcher */}
        <fieldset className="mb-6">
          <legend className="mb-2 text-sm font-medium text-ink-soft">Units</legend>
          <div
            role="radiogroup"
            aria-label="Measurement units"
            className="inline-flex rounded-full border border-line bg-paper p-1"
          >
            {(['metric', 'imperial'] as const).map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={unit === option}
                onClick={() => switchUnit(option)}
                className={`min-h-[44px] rounded-full px-4 text-sm font-medium transition-colors ${
                  unit === option ? 'bg-accent text-white' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {option === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lb, ft/in)'}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Age */}
        <div className="mb-5">
          <label htmlFor="age" className="mb-1.5 block text-sm font-medium text-ink">
            Age (years)
          </label>
          <input
            id="age"
            name="age"
            type="number"
            inputMode="numeric"
            min={0}
            max={120}
            step={1}
            value={ageRaw}
            onChange={(e) => setAgeRaw(e.target.value)}
            aria-invalid={Boolean(errorFor('age'))}
            aria-describedby={errorFor('age') ? 'age-error' : 'age-hint'}
            className={`h-12 w-full rounded-lg border bg-white px-4 text-base text-ink outline-none transition-colors ${
              errorFor('age') ? 'border-category-obesity' : 'border-line focus:border-accent'
            }`}
            placeholder="e.g. 34"
          />
          <p id="age-hint" className="mt-1 text-xs text-ink-soft">
            Used to apply the right BMI category — adult ranges only apply from age 20.
          </p>
          {errorFor('age') && (
            <p id="age-error" role="alert" className="mt-1 text-xs font-medium text-category-obesity">
              {errorFor('age')}
            </p>
          )}
        </div>

        {/* Height */}
        {unit === 'metric' ? (
          <div className="mb-5">
            <label htmlFor="height-cm" className="mb-1.5 block text-sm font-medium text-ink">
              Height (cm)
            </label>
            <input
              id="height-cm"
              name="heightCm"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.1"
              value={heightCmRaw}
              onChange={(e) => setHeightCmRaw(e.target.value)}
              aria-invalid={Boolean(errorFor('heightCm'))}
              aria-describedby={errorFor('heightCm') ? 'height-error' : undefined}
              className={`h-12 w-full rounded-lg border bg-white px-4 text-base text-ink outline-none transition-colors ${
                errorFor('heightCm') ? 'border-category-obesity' : 'border-line focus:border-accent'
              }`}
              placeholder="e.g. 170"
            />
            {errorFor('heightCm') && (
              <p id="height-error" role="alert" className="mt-1 text-xs font-medium text-category-obesity">
                {errorFor('heightCm')}
              </p>
            )}
          </div>
        ) : (
          <div className="mb-5">
            <span className="mb-1.5 block text-sm font-medium text-ink">Height</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="height-ft" className="sr-only">
                  Feet
                </label>
                <div className="relative">
                  <input
                    id="height-ft"
                    name="heightFt"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step="1"
                    value={heightFtRaw}
                    onChange={(e) => setHeightFtRaw(e.target.value)}
                    aria-invalid={Boolean(errorFor('heightFt'))}
                    aria-describedby={errorFor('heightFt') ? 'height-ft-error' : undefined}
                    className={`h-12 w-full rounded-lg border bg-white px-4 pr-10 text-base text-ink outline-none transition-colors ${
                      errorFor('heightFt') ? 'border-category-obesity' : 'border-line focus:border-accent'
                    }`}
                    placeholder="5"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-soft">
                    ft
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="height-in" className="sr-only">
                  Inches
                </label>
                <div className="relative">
                  <input
                    id="height-in"
                    name="heightIn"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={11.99}
                    step="0.1"
                    value={heightInRaw}
                    onChange={(e) => setHeightInRaw(e.target.value)}
                    aria-invalid={Boolean(errorFor('heightIn'))}
                    aria-describedby={errorFor('heightIn') ? 'height-ft-error' : undefined}
                    className={`h-12 w-full rounded-lg border bg-white px-4 pr-10 text-base text-ink outline-none transition-colors ${
                      errorFor('heightIn') ? 'border-category-obesity' : 'border-line focus:border-accent'
                    }`}
                    placeholder="7"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-soft">
                    in
                  </span>
                </div>
              </div>
            </div>
            {(errorFor('heightFt') || errorFor('heightIn')) && (
              <p id="height-ft-error" role="alert" className="mt-1 text-xs font-medium text-category-obesity">
                {errorFor('heightFt') || errorFor('heightIn')}
              </p>
            )}
          </div>
        )}

        {/* Weight */}
        <div className="mb-2">
          <label htmlFor="weight" className="mb-1.5 block text-sm font-medium text-ink">
            Weight ({unit === 'metric' ? 'kg' : 'lb'})
          </label>
          <input
            id="weight"
            name="weight"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.1"
            value={unit === 'metric' ? weightKgRaw : weightLbRaw}
            onChange={(e) => (unit === 'metric' ? setWeightKgRaw(e.target.value) : setWeightLbRaw(e.target.value))}
            aria-invalid={Boolean(errorFor(unit === 'metric' ? 'weightKg' : 'weightLb'))}
            aria-describedby={errorFor(unit === 'metric' ? 'weightKg' : 'weightLb') ? 'weight-error' : undefined}
            className={`h-12 w-full rounded-lg border bg-white px-4 text-base text-ink outline-none transition-colors ${
              errorFor(unit === 'metric' ? 'weightKg' : 'weightLb') ? 'border-category-obesity' : 'border-line focus:border-accent'
            }`}
            placeholder={unit === 'metric' ? 'e.g. 68' : 'e.g. 150'}
          />
          {errorFor(unit === 'metric' ? 'weightKg' : 'weightLb') && (
            <p id="weight-error" role="alert" className="mt-1 text-xs font-medium text-category-obesity">
              {errorFor(unit === 'metric' ? 'weightKg' : 'weightLb')}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
          >
            Calculate BMI
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-medium text-ink-soft transition-colors hover:border-ink-soft hover:text-ink"
          >
            <RotateCcw size={16} aria-hidden="true" />
            Reset
          </button>
        </div>
      </form>

      <div>
        <ResultCard result={result} resultRef={resultRef} />
      </div>
    </div>
  )
}
