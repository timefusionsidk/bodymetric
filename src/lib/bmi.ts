// Core BMI calculation, unit conversion, and validation logic.
// Kept framework-free and pure so it can be unit tested in isolation
// and so no measurement ever needs to leave the browser to be processed.

export type UnitSystem = 'metric' | 'imperial'

export type AdultCategory = 'underweight' | 'healthy' | 'overweight' | 'obesity'

export interface MetricInput {
  system: 'metric'
  heightCm: number
  weightKg: number
}

export interface ImperialInput {
  system: 'imperial'
  heightFt: number
  heightIn: number
  weightLb: number
}

export type MeasurementInput = MetricInput | ImperialInput

export interface FieldError {
  field: string
  message: string
}

// Plausible physiological bounds. These exist only to catch mistyped values
// (e.g. a height entered in the wrong unit) — they are intentionally wide.
export const LIMITS = {
  heightCm: { min: 45, max: 272 },
  weightKg: { min: 2, max: 450 },
  heightFt: { min: 1, max: 8 },
  heightInExtra: { min: 0, max: 11.99 },
  weightLb: { min: 4, max: 992 },
  age: { min: 0, max: 120 },
}

const KG_PER_LB = 0.45359237
const CM_PER_IN = 2.54

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB
}

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB
}

export function ftInToCm(ft: number, inches: number): number {
  return (ft * 12 + inches) * CM_PER_IN
}

export function cmToFtIn(cm: number): { ft: number; inches: number } {
  const totalInches = cm / CM_PER_IN
  const ft = Math.floor(totalInches / 12)
  const inches = totalInches - ft * 12
  return { ft, inches }
}

/** Converts any supported input into canonical metric units (kg, cm). */
export function toMetric(input: MeasurementInput): { heightCm: number; weightKg: number } {
  if (input.system === 'metric') {
    return { heightCm: input.heightCm, weightKg: input.weightKg }
  }
  return {
    heightCm: ftInToCm(input.heightFt, input.heightIn),
    weightKg: lbToKg(input.weightLb),
  }
}

/** Full-precision BMI. Do not round before comparing to category boundaries. */
export function calculateBmi(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

export function roundBmi(bmi: number): number {
  return Math.round(bmi * 10) / 10
}

/** Adult (20+) category, applied to the unrounded BMI value. */
export function classifyAdultBmi(unroundedBmi: number): AdultCategory {
  if (unroundedBmi < 18.5) return 'underweight'
  if (unroundedBmi < 25) return 'healthy'
  if (unroundedBmi < 30) return 'overweight'
  return 'obesity'
}

export const CATEGORY_LABEL: Record<AdultCategory, string> = {
  underweight: 'Underweight',
  healthy: 'Healthy weight',
  overweight: 'Overweight',
  obesity: 'Obesity',
}

export const CATEGORY_RANGE_LABEL: Record<AdultCategory, string> = {
  underweight: 'Below 18.5',
  healthy: '18.5 – 24.9',
  overweight: '25.0 – 29.9',
  obesity: '30.0 and above',
}

/**
 * The weight interval, at a given height, whose BMI falls in the adult
 * "healthy weight" band (18.5 to below 25). This is a mathematical
 * consequence of the BMI formula at that height — not a personal target.
 */
export function healthyWeightRangeKg(heightCm: number): { minKg: number; maxKg: number } {
  const heightM = heightCm / 100
  return {
    minKg: 18.5 * heightM * heightM,
    maxKg: 25 * heightM * heightM - 0.0001, // stays just under the 25 boundary
  }
}

// ---- Age handling -------------------------------------------------------

export type AgeBand = 'too-young' | 'child-teen' | 'adult'

export function getAgeBand(age: number): AgeBand {
  if (age < 2) return 'too-young'
  if (age < 20) return 'child-teen'
  return 'adult'
}

// ---- Validation ----------------------------------------------------------

function isNumeric(value: string): boolean {
  if (value.trim() === '') return false
  return Number.isFinite(Number(value))
}

export function validateAge(raw: string): FieldError | null {
  if (raw.trim() === '') return { field: 'age', message: 'Enter an age.' }
  if (!isNumeric(raw)) return { field: 'age', message: 'Age must be a number.' }
  const value = Number(raw)
  if (value < LIMITS.age.min || value > LIMITS.age.max) {
    return { field: 'age', message: `Enter an age between ${LIMITS.age.min} and ${LIMITS.age.max}.` }
  }
  return null
}

export function validateMetricHeight(raw: string): FieldError | null {
  if (raw.trim() === '') return { field: 'heightCm', message: 'Enter a height.' }
  if (!isNumeric(raw)) return { field: 'heightCm', message: 'Height must be a number.' }
  const value = Number(raw)
  if (value <= 0) return { field: 'heightCm', message: 'Height must be greater than zero.' }
  if (value < LIMITS.heightCm.min || value > LIMITS.heightCm.max) {
    return {
      field: 'heightCm',
      message: `Enter a height between ${LIMITS.heightCm.min} and ${LIMITS.heightCm.max} cm.`,
    }
  }
  return null
}

export function validateMetricWeight(raw: string): FieldError | null {
  if (raw.trim() === '') return { field: 'weightKg', message: 'Enter a weight.' }
  if (!isNumeric(raw)) return { field: 'weightKg', message: 'Weight must be a number.' }
  const value = Number(raw)
  if (value <= 0) return { field: 'weightKg', message: 'Weight must be greater than zero.' }
  if (value < LIMITS.weightKg.min || value > LIMITS.weightKg.max) {
    return {
      field: 'weightKg',
      message: `Enter a weight between ${LIMITS.weightKg.min} and ${LIMITS.weightKg.max} kg.`,
    }
  }
  return null
}

export function validateImperialHeight(rawFt: string, rawIn: string): FieldError | null {
  if (rawFt.trim() === '' && rawIn.trim() === '') {
    return { field: 'heightFt', message: 'Enter a height.' }
  }
  const ft = rawFt.trim() === '' ? 0 : Number(rawFt)
  const inches = rawIn.trim() === '' ? 0 : Number(rawIn)
  if (rawFt.trim() !== '' && !isNumeric(rawFt)) {
    return { field: 'heightFt', message: 'Feet must be a number.' }
  }
  if (rawIn.trim() !== '' && !isNumeric(rawIn)) {
    return { field: 'heightIn', message: 'Inches must be a number.' }
  }
  if (ft < 0 || inches < 0) {
    return { field: 'heightFt', message: 'Height cannot be negative.' }
  }
  if (ft === 0 && inches === 0) {
    return { field: 'heightFt', message: 'Height must be greater than zero.' }
  }
  if (inches >= 12) {
    return { field: 'heightIn', message: 'Inches must be less than 12 — carry extra into feet.' }
  }
  const totalCm = ftInToCm(ft, inches)
  if (totalCm < LIMITS.heightCm.min || totalCm > LIMITS.heightCm.max) {
    return { field: 'heightFt', message: 'Enter a realistic height.' }
  }
  return null
}

export function validateImperialWeight(raw: string): FieldError | null {
  if (raw.trim() === '') return { field: 'weightLb', message: 'Enter a weight.' }
  if (!isNumeric(raw)) return { field: 'weightLb', message: 'Weight must be a number.' }
  const value = Number(raw)
  if (value <= 0) return { field: 'weightLb', message: 'Weight must be greater than zero.' }
  if (value < LIMITS.weightLb.min || value > LIMITS.weightLb.max) {
    return {
      field: 'weightLb',
      message: `Enter a weight between ${LIMITS.weightLb.min} and ${LIMITS.weightLb.max} lb.`,
    }
  }
  return null
}
