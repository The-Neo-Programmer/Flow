import React from 'react';
import { ArrowRight, BarChart3, Calendar, CheckCircle2 } from 'lucide-react';

const Landing = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12">
            {/* Hero */}
            <div className="space-y-6 max-w-3xl">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    Your AI Engineering <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                        Study Coach
                    </span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Personalized schedules that adapt to your <span className="text-white font-medium">weak areas</span>,
                    <span className="text-white font-medium"> deadlines</span> & <span className="text-white font-medium">energy levels</span>.
                </p>
            </div>

            {/* CTA */}
            <button
                onClick={onStart}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-primary font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.5)] animate-pulse-slow"
            >
                Generate My Plan
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-12">
                <FeatureCard
                    icon={<BarChart3 className="w-6 h-6 text-accent" />}
                    title="Smart Allocation"
                    desc="Credits + Confidence analysis"
                />
                <FeatureCard
                    icon={<Calendar className="w-6 h-6 text-secondary" />}
                    title="Visual Calendar"
                    desc="Color-coded cognitive blocks"
                />
                <FeatureCard
                    icon={<CheckCircle2 className="w-6 h-6 text-success" />}
                    title="Next 7 Days"
                    desc="Actionable daily checklist"
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm text-left">
        <div className="mb-4 p-3 bg-white/5 w-fit rounded-lg">{icon}</div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{desc}</p>
    </div>
);

export default Landing;
