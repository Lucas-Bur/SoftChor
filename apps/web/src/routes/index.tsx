import {
  FeatureSection,
  FooterSection,
  HeroSection,
  ProcessSection,
  ShowcaseSection,
} from '@/components/landing'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <HeroSection />
      <FeatureSection />
      <ProcessSection />
      <ShowcaseSection />
      <FooterSection />
    </div>
  )
}
