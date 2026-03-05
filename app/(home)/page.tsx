'use client';

import { HeroSection } from '@/components/layout/HeroSection';
import { FeaturesSection } from '@/components/layout/FeaturesSection';
import { CTASection } from '@/components/layout/CTASection';

export default function HomePage() {
  return (
    <main className="relative">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </main>
  );
}
