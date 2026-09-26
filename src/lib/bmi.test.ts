import { describe, it, expect } from 'vitest'
import {
  calculateBmi,
  roundBmi,
  classifyAdultBmi,
  toMetric,
  ftInToCm,
  cmToFtIn,
  lbToKg,
  kgToLb,
  getAgeBand,
  healthyWeightRangeKg,
  validateAge,
  validateMetricHeight,
  validateMetricWeight,
  validateImperialHeight,
  validateImperialWeight,
} from './bmi'

describe('calculateBmi', () => {
  it('computes BMI from height in cm and weight in kg', () => {
    // 70kg at 175cm -> 70 / 1.75^2 = 22.857...
    expect(calculateBmi(175, 70)).toBeCloseTo(22.857, 3)
  })

  it('keeps full precision (does not round internally)', () => {
    const bmi = calculateBmi(170, 68)
    expect(bmi).not.toBe(roundBmi(bmi))
    expect(bmi.toString().length).toBeGreaterThan(4)
  })
})

describe('roundBmi', () => {
  it('rounds to one decimal place', () => {
    expect(roundBmi(22.857)).toBe(22.9)
    expect(roundBmi(24.94)).toBe(24.9)
    expect(roundBmi(24.96)).toBe(25)
    expect(roundBmi(18.449)).toBe(18.4)
  })
})

describe('classifyAdultBmi — boundaries applied before rounding', () => {
  it('classifies a value just under 18.5 as underweight even if it rounds to 18.5', () => {
    // 18.449 rounds (display) to 18.4, safely underweight - sanity check
    expect(classifyAdultBmi(18.449)).toBe('underweight')
  })

  it('classifies a value that ROUNDS to 18.5 but is unrounded below it as underweight', () => {
    // 18.449999 would display as 18.4, still underweight - not the tricky case.
    // The tricky case: unrounded 18.46 rounds to 18.5 (looks "healthy" if rounded first)
    // but is still < 18.5 unrounded, so must classify as underweight.
    const unrounded = 18.46
    expect(roundBmi(unrounded)).toBe(18.5) // rounds to the healthy-looking boundary
    expect(classifyAdultBmi(unrounded)).toBe('underweight') // but classified on unrounded value
  })

  it('classifies exactly 18.5 as healthy (lower bound inclusive)', () => {
    expect(classifyAdultBmi(18.5)).toBe('healthy')
  })

  it('classifies a value just below 25 as healthy even if it rounds to 25.0', () => {
    const unrounded = 24.96
    expect(roundBmi(unrounded)).toBe(25)
    expect(classifyAdultBmi(unrounded)).toBe('healthy')
  })

  it('classifies exactly 25 as overweight (lower bound inclusive)', () => {
    expect(classifyAdultBmi(25)).toBe('overweight')
  })

  it('classifies a value just below 30 as overweight even if it rounds to 30.0', () => {
    const unrounded = 29.96
    expect(roundBmi(unrounded)).toBe(30)
    expect(classifyAdultBmi(unrounded)).toBe('overweight')
  })

  it('classifies exactly 30 and above as obesity', () => {
    expect(classifyAdultBmi(30)).toBe('obesity')
    expect(classifyAdultBmi(45)).toBe('obesity')
  })
})

describe('unit conversions', () => {
  it('converts pounds to kilograms and back', () => {
    expect(lbToKg(150)).toBeCloseTo(68.0389, 3)
    expect(kgToLb(lbToKg(150))).toBeCloseTo(150, 6)
  })

  it('converts feet/inches to centimetres and back', () => {
    const cm = ftInToCm(5, 9) // 5'9"
    expect(cm).toBeCloseTo(175.26, 2)
    const back = cmToFtIn(cm)
    expect(back.ft).toBe(5)
    expect(back.inches).toBeCloseTo(9, 6)
  })

  it('toMetric passes metric input through unchanged', () => {
    const result = toMetric({ system: 'metric', heightCm: 180, weightKg: 75 })
    expect(result).toEqual({ heightCm: 180, weightKg: 75 })
  })

  it('toMetric converts imperial input to metric', () => {
    const result = toMetric({ system: 'imperial', heightFt: 5, heightIn: 9, weightLb: 150 })
    expect(result.heightCm).toBeCloseTo(175.26, 2)
    expect(result.weightKg).toBeCloseTo(68.0389, 3)
  })
})

describe('metric vs imperial equivalence', () => {
  it('gives the same BMI (within rounding) for equivalent metric and imperial inputs', () => {
    const metric = toMetric({ system: 'metric', heightCm: 175.26, weightKg: 68.0389 })
    const imperial = toMetric({ system: 'imperial', heightFt: 5, heightIn: 9, weightLb: 150 })

    const bmiMetric = calculateBmi(metric.heightCm, metric.weightKg)
    const bmiImperial = calculateBmi(imperial.heightCm, imperial.weightKg)

    expect(roundBmi(bmiMetric)).toBe(roundBmi(bmiImperial))
  })
})

describe('age banding', () => {
  it('treats under 2 as too-young', () => {
    expect(getAgeBand(0)).toBe('too-young')
    expect(getAgeBand(1.9)).toBe('too-young')
  })

  it('treats 2 through 19 as child-teen', () => {
    expect(getAgeBand(2)).toBe('child-teen')
    expect(getAgeBand(19)).toBe('child-teen')
    expect(getAgeBand(19.9)).toBe('child-teen')
  })

  it('treats 20 and up as adult', () => {
    expect(getAgeBand(20)).toBe('adult')
    expect(getAgeBand(65)).toBe('adult')
  })
})

describe('healthyWeightRangeKg', () => {
  it('computes a weight interval whose BMI falls within 18.5-<25 at a given height', () => {
    const heightCm = 175
    const { minKg, maxKg } = healthyWeightRangeKg(heightCm)
    const bmiAtMin = calculateBmi(heightCm, minKg)
    const bmiAtMax = calculateBmi(heightCm, maxKg)
    expect(bmiAtMin).toBeCloseTo(18.5, 4)
    expect(bmiAtMax).toBeLessThan(25)
    expect(bmiAtMax).toBeGreaterThan(24.99)
  })
})

describe('validation — rejects missing, zero, negative, and nonnumeric values', () => {
  it('rejects an empty age', () => {
    expect(validateAge('')).not.toBeNull()
  })
  it('rejects a nonnumeric age', () => {
    expect(validateAge('abc')).not.toBeNull()
  })
  it('accepts a valid age', () => {
    expect(validateAge('34')).toBeNull()
  })

  it('rejects zero and negative metric height', () => {
    expect(validateMetricHeight('0')).not.toBeNull()
    expect(validateMetricHeight('-10')).not.toBeNull()
  })
  it('rejects nonnumeric metric weight', () => {
    expect(validateMetricWeight('seventy')).not.toBeNull()
  })
  it('rejects an implausible metric height', () => {
    expect(validateMetricHeight('900')).not.toBeNull()
  })
  it('accepts a plausible metric height and weight', () => {
    expect(validateMetricHeight('175')).toBeNull()
    expect(validateMetricWeight('70')).toBeNull()
  })

  it('rejects zero-and-zero imperial height', () => {
    expect(validateImperialHeight('0', '0')).not.toBeNull()
  })
  it('rejects inches of 12 or more', () => {
    expect(validateImperialHeight('5', '12')).not.toBeNull()
  })
  it('accepts valid imperial height split across feet and inches', () => {
    expect(validateImperialHeight('5', '9')).toBeNull()
  })
  it('rejects negative imperial weight', () => {
    expect(validateImperialWeight('-5')).not.toBeNull()
  })
  it('rejects an empty imperial weight', () => {
    expect(validateImperialWeight('')).not.toBeNull()
  })
})
