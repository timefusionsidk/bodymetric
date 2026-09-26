import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Is BodyMetric free to use?',
    a: 'Yes. The calculator is free, requires no account, and has no usage limit.',
  },
  {
    q: 'Do you store my height, weight, or age?',
    a: 'No, not by default. BMI is calculated entirely in your browser and is never sent to a server. If BodyMetric ever offers to remember your last entry, that setting is opt-in and stored only on your device — see the Privacy Policy for details.',
  },
  {
    q: 'Why does BodyMetric ask for my age?',
    a: 'BMI is interpreted differently depending on age. Adults (20 and older) use four fixed categories. People under 20 are still growing, so BMI is compared to age- and sex-specific percentiles instead — a fixed adult range would misclassify them.',
  },
  {
    q: 'Can BMI tell me if I\u2019m healthy?',
    a: 'No. BMI is a screening measure based only on height and weight. It doesn\u2019t measure body fat, muscle, or overall health directly, and it isn\u2019t a diagnosis. It can be a useful starting point for a conversation with a healthcare provider.',
  },
  {
    q: 'Why is my BMI category different from what I expected?',
    a: 'BMI doesn\u2019t account for muscle mass, bone density, age, sex, or body composition, so athletic or muscular people are sometimes categorized differently than their overall health would suggest. The category is a statistical range, not a personal judgment.',
  },
  {
    q: 'What should I do with a BMI in the overweight or obesity range?',
    a: 'Consider it one data point among many. If you have questions about what it means for you, a doctor or registered dietitian can put it in context alongside your medical history and other measurements. BodyMetric doesn\u2019t provide weight-loss targets or calorie guidance.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="border-t border-line bg-white/60 py-14 sm:py-20">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Frequently asked questions</h2>
        </div>
        <div className="mt-8 max-w-3xl divide-y divide-line border-t border-line">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i
            const panelId = `faq-panel-${i}`
            const buttonId = `faq-button-${i}`
            return (
              <div key={item.q}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex min-h-[44px] w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className="font-medium text-ink">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-ink-soft transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pb-4 text-sm leading-relaxed text-ink-soft"
                >
                  {item.a}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
