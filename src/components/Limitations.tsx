import { Dumbbell, Users, Baby, Activity } from 'lucide-react'

const points = [
  {
    icon: Dumbbell,
    title: 'It doesn\u2019t separate muscle from fat',
    body: 'BMI uses only height and weight, so a muscular, athletic body and a higher-fat body of the same weight and height score identically.',
  },
  {
    icon: Users,
    title: 'Averages don\u2019t describe individuals',
    body: 'BMI categories come from population-level research. Age, sex, ethnicity, bone structure, and overall health all shape what a given BMI means for one person.',
  },
  {
    icon: Baby,
    title: 'It works differently for growing bodies',
    body: 'Children and teens are interpreted with age- and sex-specific percentiles, not the fixed adult ranges \u2014 that\u2019s why BodyMetric handles them separately.',
  },
  {
    icon: Activity,
    title: 'It\u2019s a screening tool, not a diagnosis',
    body: 'A BMI result can be a helpful starting point for a conversation with a doctor \u2014 it isn\u2019t a measurement of health on its own.',
  },
]

export default function Limitations() {
  return (
    <section id="limitations" className="container-page py-14 sm:py-20">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">BMI and its limitations</h2>
        <p className="mt-3 text-ink-soft">
          BMI is useful because it's simple, but that simplicity is also its biggest limitation. Here's what
          it leaves out.
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {points.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft">
              <Icon size={18} className="text-accent" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
