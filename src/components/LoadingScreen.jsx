import React, { useEffect, useState } from 'react';
import { Loader2, Brain, Sparkles } from 'lucide-react';

const LoadingScreen = () => {
    const [tipIndex, setTipIndex] = useState(0);

    const tips = [
        "Analyzing your subjects...",
        "calculating optimal study blocks...",
        "Balancing workload...",
        "Preparing your personalized roadmap...",
        "Did you know? Spaced repetition increases retention by 40%."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setTipIndex(prev => (prev + 1) % tips.length);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-xl animate-fade-in-up">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-slow"></div>
                <Brain size={64} className="text-primary animate-bounce relative z-10" />
            </div>

            <h2 className="mt-8 text-2xl font-bold text-white flex items-center gap-2">
                <Loader2 className="animate-spin text-accent" />
                Generating Plan
            </h2>

            <div className="mt-4 h-16 flex items-center justify-center">
                <p key={tipIndex} className="text-gray-400 text-sm animate-fade-in-up text-center max-w-md px-4">
                    <Sparkles className="inline-block w-4 h-4 text-yellow-400 mr-2" />
                    {tips[tipIndex]}
                </p>
            </div>

            <div className="mt-8 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent w-1/2 animate-[shimmer_1.5s_infinite_linear]"
                    style={{ width: '100%', transform: 'translateX(-100%)', animation: 'slide 2s infinite' }}
                />
            </div>

            <style>{`
                @keyframes slide {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
