import { useEffect } from 'react'

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy | BodyMetric'
  }, [])

  return (
    <div className="container-page py-14 sm:py-20">
      <div className="max-w-prose">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-ink-soft">Last updated: 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-soft [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_p]:mt-3">
          <section>
            <h2>The calculator itself</h2>
            <p>
              BodyMetric's BMI calculator runs entirely in your web browser. When you enter your age, height,
              and weight, that information is used only to compute a result on your own device. It is never
              sent to BodyMetric's servers, stored in a database, or shared with any third party. Closing or
              reloading the page clears it.
            </p>
            <p>
              If BodyMetric offers an option to remember your last entry, that option is off by default. If you
              turn it on, your values are saved only in your browser's local storage on your own device — not
              on a server — and you can remove them at any time with the Clear Data control.
            </p>
          </section>

          <section>
            <h2>Optional advertising and analytics</h2>
            <p>
              BodyMetric may show display advertising to help keep the calculator free. Ad scripts are loaded
              only when the site operator has configured a publisher and ad slot ID, and they are limited to
              the informational sections of the page — never the calculator inputs or your result.
            </p>
            <p>
              Height, weight, age, and BMI results are never passed to an advertising or analytics provider as
              targeting data. If an ad or analytics script is active, it may independently collect standard
              technical information (such as your approximate location from your IP address, browser type, or
              general usage patterns) under its own privacy policy, the way most websites' ad scripts do. That
              collection is separate from, and unrelated to, the calculator itself.
            </p>
          </section>

          <section>
            <h2>Cookies and local storage</h2>
            <p>
              BodyMetric does not use cookies for the calculator to function. If advertising is enabled, the ad
              provider's script may set its own cookies or use similar technology, governed by that provider's
              policy rather than this one.
            </p>
          </section>

          <section>
            <h2>Children's privacy</h2>
            <p>
              BodyMetric does not knowingly collect personal information from anyone, including children, and
              the calculator does not ask for a name, email address, or account of any kind.
            </p>
          </section>

          <section>
            <h2>Changes to this policy</h2>
            <p>
              If this policy changes, the updated version will be posted on this page with a new "last updated"
              date.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about this policy can be sent to the site operator using the contact details published
              alongside this deployment of BodyMetric.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
