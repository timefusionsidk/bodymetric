const categories = [
  { name: 'Underweight', range: 'Below 18.5', note: 'May indicate insufficient energy intake for some people, but can also reflect body type or a fast metabolism.', color: 'bg-category-under' },
  { name: 'Healthy weight', range: '18.5 – 24.9', note: 'Associated with lower average health risk in large population studies, though individual health varies widely.', color: 'bg-category-healthy' },
  { name: 'Overweight', range: '25.0 – 29.9', note: 'A signal worth noting alongside other measures, not a verdict on any one person\u2019s health.', color: 'bg-category-over' },
  { name: 'Obesity', range: '30.0 and above', note: 'Linked to higher average risk of some conditions in population studies; individual risk depends on many factors.', color: 'bg-category-obesity' },
]

export default function UnderstandingResult() {
  return (
    <section id="understanding" className="border-t border-line bg-white/60 py-14 sm:py-20">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Understanding your result</h2>
          <p className="mt-3 text-ink-soft">
            These are the four adult BMI categories used by BodyMetric, and what population research says about
            each — described plainly, without turning a number into a verdict.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {categories.map((cat) => (
            <div key={cat.name} className="rounded-xl border border-line bg-paper p-5">
              <div className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${cat.color}`} aria-hidden="true" />
                <h3 className="font-display text-base font-semibold text-ink">{cat.name}</h3>
                <span className="text-sm text-ink-soft">{cat.range}</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{cat.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
