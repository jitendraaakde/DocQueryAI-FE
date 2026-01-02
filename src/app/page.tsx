'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { DocumentFlowBeam } from '@/components/landing/document-flow-beam';
import { HowItWorks } from '@/components/landing/how-it-works';
import { DemoScreenshot } from '@/components/landing/demo-screenshot';
import { Testimonials } from '@/components/landing/testimonials';
import { CTA } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';

export default function Home() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Redirect if authenticated
    if (!isLoading && isAuthenticated) {
        router.push('/dashboard');
        return null;
    }

    return (
        <main className="min-h-screen bg-dark-950 overflow-x-hidden">
            {/* Navigation */}
            <Navbar />

            {/* Hero Section - Bold headline, CTAs, demo preview */}
            <Hero />

            {/* Document Flow Beam - Visual representation of AI processing */}
            <DocumentFlowBeam />

            {/* Feature Highlights - 4 key benefits with hover effects */}
            <Features />

            {/* How It Works - 3-step process */}
            <HowItWorks />

            {/* Demo Screenshot - Product UI showcase */}
            <DemoScreenshot />

            {/* Testimonials - Social proof */}
            <Testimonials />

            {/* Call to Action */}
            <CTA />

            {/* Footer - Simplified links */}
            <Footer />
        </main>
    );
}
