import { useEffect } from 'react'

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms of Use | BodyMetric'
  }, [])

  return (
    <div className="container-page py-14 sm:py-20">
      <div className="max-w-prose">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Use</h1>
        <p className="mt-2 text-sm text-ink-soft">Last updated: 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-soft [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_p]:mt-3">
          <section>
            <h2>Using BodyMetric</h2>
            <p>
              BodyMetric is a free tool that calculates body mass index (BMI) from height and weight you
              provide. No account or payment is required. By using the site, you agree to these terms.
            </p>
          </section>

          <section>
            <h2>Not medical advice</h2>
            <p>
              BodyMetric is a general information and screening tool, not a medical device, and it does not
              provide medical advice, diagnosis, or treatment. BMI is one simple measure based on height and
              weight; it does not account for muscle mass, body composition, age, sex, or individual health
              history. Always consult a qualified healthcare provider with questions about your health or
              before making decisions based on any result shown here.
            </p>
          </section>

          <section>
            <h2>Accuracy</h2>
            <p>
              BodyMetric aims to calculate BMI correctly from the values you enter, but the result is only as
              accurate as the measurements you provide, and it is provided "as is" without warranties of any
              kind, express or implied.
            </p>
          </section>

          <section>
            <h2>Acceptable use</h2>
            <p>
              You agree not to misuse BodyMetric — for example, by attempting to disrupt the site, reverse
              engineer it for harmful purposes, or use it in a way that violates applicable law.
            </p>
          </section>

          <section>
            <h2>Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, BodyMetric and its operator are not liable for any
              damages arising from your use of, or inability to use, this site or any result it produces.
            </p>
          </section>

          <section>
            <h2>Changes</h2>
            <p>
              These terms may be updated from time to time. Continued use of BodyMetric after a change means
              you accept the revised terms.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about these terms can be sent to the site operator using the contact details published
              alongside this deployment of BodyMetric.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
