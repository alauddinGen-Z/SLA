import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GridPatternWithSpotlight } from '../components/GridPattern';
import { BentoGrid, BentoCard } from '../components/BentoGrid';
import { ConnectedSteps } from '../components/BeamLine';
import {
    DollarSign,
    Clock,
    AlertTriangle,
    Shield,
    FileText,
    Zap,
    Upload,
    Brain,
    RefreshCw
} from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <GridPatternWithSpotlight />

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        <motion.h1
                            variants={fadeInUp}
                            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent leading-tight"
                        >
                            Recover Lost Revenue
                            <br />
                            Automatically
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
                        >
                            Stop losing money to SLA breaches. Our AI audits your contracts,
                            tracks violations, and claims refunds in real-time.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <button
                                onClick={() => navigate('/login')}
                                className="glow-green px-8 py-4 bg-primary rounded-xl font-semibold text-lg text-white hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary/50"
                            >
                                Start Recovery (Free Audit)
                            </button>

                            <button
                                onClick={() => {
                                    document.getElementById('how-it-works')?.scrollIntoView({
                                        behavior: 'smooth'
                                    });
                                }}
                                className="glass px-8 py-4 rounded-xl font-semibold text-lg text-white hover:bg-white/10 transition-all duration-200"
                            >
                                View Demo
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-sm"
                    >
                        ↓ Scroll to explore
                    </motion.div>
                </motion.div>
            </section>

            {/* Problem Section - Bento Grid */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            The Cost of{' '}
                            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                Ignored Breaches
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Most companies lose significant revenue to SLA violations they never catch or claim.
                        </p>
                    </motion.div>

                    <BentoGrid>
                        <BentoCard
                            icon={<DollarSign size={32} />}
                            title="9% Revenue Lost"
                            description="Average revenue lost annually to unclaimed SLA credits and refunds across enterprise contracts."
                        />
                        <BentoCard
                            icon={<Clock size={32} />}
                            title="Manual Audits Take Hours"
                            description="Legal teams spend countless hours manually reviewing contracts and incident logs."
                        />
                        <BentoCard
                            icon={<AlertTriangle size={32} />}
                            title="Unclaimed Credits Stack Up"
                            description="Thousands in credits go unclaimed because breaches are never identified or documented."
                        />
                        <BentoCard
                            icon={<Shield size={32} />}
                            title="No Real-Time Monitoring"
                            description="Without automation, SLA breaches are only discovered during quarterly reviews—if at all."
                        />
                        <BentoCard
                            icon={<FileText size={32} />}
                            title="Dispute Resolution Delays"
                            description="Manual processes mean weeks of back-and-forth to prove breaches and claim refunds."
                        />
                        <BentoCard
                            icon={<Zap size={32} />}
                            title="Contract Complexity"
                            description="Complex SLA terms make it nearly impossible to track all obligations manually."
                        />
                    </BentoGrid>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-6 relative">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Recovery in{' '}
                            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                                Three Steps
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400">
                            Automated SLA enforcement that works 24/7
                        </p>
                    </motion.div>

                    <ConnectedSteps
                        steps={[
                            {
                                icon: <Upload size={32} />,
                                title: '1. Upload Your Contract',
                                description: 'Simply upload your SLA contract. Our AI extracts all performance guarantees and breach clauses automatically.'
                            },
                            {
                                icon: <Brain size={32} />,
                                title: '2. Continuous AI Monitoring',
                                description: 'We track incidents in real-time, comparing them against your SLA terms to identify breaches as they happen.'
                            },
                            {
                                icon: <RefreshCw size={32} />,
                                title: '3. Automated Refunds',
                                description: 'When breaches are detected, we automatically calculate credits and submit claims to your vendor.'
                            }
                        ]}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mt-16"
                    >
                        <button
                            onClick={() => navigate('/login')}
                            className="glow-green px-10 py-5 bg-primary rounded-xl font-semibold text-xl text-white hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary/50"
                        >
                            Get Started Now
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">SLA-Sentinel</h3>
                            <p className="text-gray-400">
                                Automated SLA breach detection and revenue recovery.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a href="#" className="hover:text-primary transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a href="#" className="hover:text-primary transition-colors">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary transition-colors">
                                        Contact Us
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center text-gray-500 text-sm pt-8 border-t border-white/5">
                        © {new Date().getFullYear()} SLA-Sentinel. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
