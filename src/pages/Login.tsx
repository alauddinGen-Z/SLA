import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { FloatingLabelInput } from '../components/FloatingLabelInput';
import { ArrowRight, Star } from 'lucide-react';

const testimonials = [
    {
        quote: "We recovered $127K in SLA credits in the first quarter alone. Game-changing.",
        author: "Sarah Chen",
        title: "CFO, TechFlow Inc",
        rating: 5
    },
    {
        quote: "The automated detection caught breaches we never would have found manually.",
        author: "Marcus Johnson",
        title: "Legal Director, DataCore",
        rating: 5
    },
    {
        quote: "Our legal team saves 15+ hours per week. ROI was immediate.",
        author: "Elena Rodriguez",
        title: "VP Operations, CloudScale",
        rating: 5
    }
];

export default function Login() {
    const navigate = useNavigate();
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Check auth state
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                navigate('/dashboard');
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex">
            {/* Left Side - Testimonial Slider */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-background via-card to-background p-12 items-center justify-center overflow-hidden">
                {/* Ambient lights */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Trusted by Legal Teams
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Join hundreds of companies recovering lost revenue automatically
                        </p>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTestimonial}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className="glass p-8 rounded-2xl"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                    <Star key={i} size={20} className="fill-primary text-primary" />
                                ))}
                            </div>

                            <blockquote className="text-xl text-white mb-6 leading-relaxed">
                                "{testimonials[currentTestimonial].quote}"
                            </blockquote>

                            <div>
                                <p className="font-semibold text-white">
                                    {testimonials[currentTestimonial].author}
                                </p>
                                <p className="text-gray-400 text-sm">
                                    {testimonials[currentTestimonial].title}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Testimonial indicators */}
                    <div className="flex gap-2 mt-6 justify-center">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentTestimonial(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentTestimonial
                                        ? 'w-8 bg-primary'
                                        : 'w-2 bg-gray-600 hover:bg-gray-500'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400">
                            {isSignUp ? 'Create your account to get started' : 'Sign in to manage your contracts'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        <FloatingLabelInput
                            type="email"
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            error={error && error.includes('email') ? error : ''}
                        />

                        <FloatingLabelInput
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            error={error && !error.includes('email') ? error : ''}
                        />

                        {!isSignUp && (
                            <div className="flex justify-end">
                                <a
                                    href="#"
                                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="glow-green w-full px-6 py-4 bg-primary rounded-xl font-semibold text-lg text-white hover:scale-[1.02] transition-transform duration-200 shadow-lg shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <span>Please wait...</span>
                            ) : (
                                <>
                                    <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                                    <ArrowRight
                                        size={20}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setError('');
                                }}
                                className="text-primary font-semibold hover:text-primary/80 transition-colors"
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>

                    {/* Back to home */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-500 hover:text-gray-400 transition-colors text-sm"
                        >
                            ← Back to Home
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
