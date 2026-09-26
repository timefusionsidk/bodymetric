import { useEffect, useId, useRef, useState } from 'react'

interface AdSlotProps {
  /** A short label describing placement, shown only on the dev placeholder. */
  label: string
  className?: string
}

const PUBLISHER_ID = import.meta.env.VITE_AD_PUBLISHER_ID
const SLOT_ID = import.meta.env.VITE_AD_SLOT_ID

function isConfigured(): boolean {
  return Boolean(PUBLISHER_ID && SLOT_ID)
}

let scriptLoadPromise: Promise<void> | null = null

function loadAdScript(publisherId: string): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise
  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-bodymetric-ads]')
    if (existing) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.async = true
    script.dataset.bodymetricAds = 'true'
    // Publisher-specific ad script URL. Replace with your provider's real
    // loader if you are not using this placeholder pattern.
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`
    script.crossOrigin = 'anonymous'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Ad script failed to load'))
    document.head.appendChild(script)
  })
  return scriptLoadPromise
}

/**
 * Renders a real ad unit only when publisher/slot IDs are configured via
 * environment variables. Otherwise renders a clearly labelled placeholder so
 * layout and behavior can be reviewed without any ad provider configured.
 * Never receives height, weight, age, or BMI results as targeting data.
 */
export default function AdSlot({ label, className }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const headingId = useId()

  useEffect(() => {
    if (!isConfigured()) return
    loadAdScript(PUBLISHER_ID)
      .then(() => {
        // @ts-expect-error -- injected by the third-party ad script at runtime
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      })
      .catch(() => setFailed(true))
  }, [])

  if (isConfigured() && !failed) {
    return (
      <div
        ref={containerRef}
        className={className}
        role="complementary"
        aria-label="Advertisement"
      >
        <ins
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client={PUBLISHER_ID}
          data-ad-slot={SLOT_ID}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl border border-dashed border-line bg-white/60 px-4 py-6 text-center ${className ?? ''}`}
      role="complementary"
      aria-labelledby={headingId}
    >
      <p id={headingId} className="text-xs font-medium uppercase tracking-wide text-ink-soft/70">
        Advertisement placeholder
      </p>
      <p className="mt-1 text-xs text-ink-soft/70">
        {label} — shown because no ad provider is configured. BodyMetric works fully without ads.
      </p>
    </div>
  )
}
