import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can log the error to an error reporting service
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="p-10 text-center">
                    <h2 className="text-xl font-bold">Something went wrong.</h2>
                    <p className="mt-2">Our team has been notified. Please try refreshing the page.</p>
                    <button 
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => window.location.reload()}
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