import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-black/50 text-white rounded-xl backdrop-blur-md border border-red-500/20">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong.</h2>
                    <p className="text-gray-300 mb-4">A critical error occurred while rendering this component.</p>
                    <div className="bg-black/80 p-4 rounded-lg text-xs font-mono text-red-300 overflow-auto max-w-full max-h-64 mb-6 w-full">
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
