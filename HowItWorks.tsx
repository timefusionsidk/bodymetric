const steps = [
  {
    title: 'Measure height and weight',
    body: 'BMI only needs two inputs: your height and your weight, in either metric or imperial units.',
  },
  {
    title: 'Divide weight by height squared',
    body: 'The formula is weight in kilograms divided by height in metres, squared. Pounds and inches are converted internally before the same formula runs.',
  },
  {
    title: 'Compare to a category range',
    body: 'For adults 20 and older, the result is compared against four standard ranges. Younger ages are interpreted differently, using percentiles instead of fixed ranges.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container-page py-14 sm:py-20">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How BMI works</h2>
        <p className="mt-3 text-ink-soft">
          Body mass index is a simple ratio, not a body scan. Here's the full calculation, with nothing hidden.
        </p>
      </div>
      <ol className="mt-10 grid gap-8 sm:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title} className="border-t border-line pt-5">
            <span className="text-sm font-medium text-accent">{i + 1}</span>
            <h3 className="mt-2 font-display text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
