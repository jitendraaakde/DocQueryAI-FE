'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { ToolsShowcase } from '@/components/landing/tools-showcase';
import { Benefits } from '@/components/landing/benefits';
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
            <Navbar />
            <Hero />
            <Features />
            <ToolsShowcase />
            <Benefits />
            <CTA />
            <Footer />
        </main>
    );
}
