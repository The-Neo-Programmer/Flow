import React from 'react';
import { Github } from 'lucide-react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Mandatory Logo - Top Left Fixed */}
            <div className="fixed top-6 left-6 z-50">
                <img
                    src="/logo.png"
                    alt="Flow"
                    className="w-10 h-10 rounded-xl shadow-2xl hover:scale-110 transition-all duration-300 ring-2 ring-primary/20"
                />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-24 py-5 flex items-center justify-center">
                    {/* Centered Title Group */}
                    <div className="flex flex-col items-center">
                        <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent pb-2" style={{ fontFamily: '"Dancing Script", cursive' }}>
                            Flow
                        </span>
                        <span className="text-sm text-gray-400 uppercase tracking-[0.25em] -mt-1">
                            Your Study Future, Engineered
                        </span>
                    </div>

                    {/* Right-aligned Actions */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg hover:bg-white/5 transition-colors group block"
                        >
                            <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        </a>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
                <div className="glass-card min-h-[80vh] p-8 animate-fade-in-up">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-sm text-gray-500 border-t border-white/5 bg-background/50 backdrop-blur-sm z-10">
                <p>Copyright 2026 Flow. All rights reserved.</p>
            </footer>

            {/* Background Decor */}
            <div className="fixed top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none -z-0" />
            <div className="fixed bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-0" />
        </div>
    );
};

export default Layout;
