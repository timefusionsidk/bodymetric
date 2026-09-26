import { useEffect } from 'react'
import Hero from '../components/Hero'
import Calculator from '../components/Calculator'
import HowItWorks from '../components/HowItWorks'
import UnderstandingResult from '../components/UnderstandingResult'
import Limitations from '../components/Limitations'
import FAQ from '../components/FAQ'
import AdSlot from '../components/AdSlot'

export default function Home() {
  useEffect(() => {
    document.title = 'BMI Calculator – Calculate and Understand Your Result | BodyMetric'
  }, [])

  return (
    <>
      <Hero />
      <section id="calculator" className="container-page pb-14 sm:pb-20">
        <Calculator />
      </section>
      <HowItWorks />
      <div className="container-page">
        <AdSlot label="Between How it works and Understanding your result" className="my-2" />
      </div>
      <UnderstandingResult />
      <Limitations />
      <FAQ />
    </>
  )
}
