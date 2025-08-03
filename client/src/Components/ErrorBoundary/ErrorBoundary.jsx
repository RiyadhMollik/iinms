import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to console
        console.error('Error caught by boundary:', error, errorInfo);
        
        // Update state with error details
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                        <div className="text-center">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                Something went wrong
                            </h1>
                            <p className="text-gray-600 mb-6">
                                We're sorry, but something unexpected happened. Please try refreshing the page.
                            </p>
                            
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="text-left bg-gray-50 p-4 rounded-lg mb-4">
                                    <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                                        Error Details (Development)
                                    </summary>
                                    <div className="text-sm text-gray-600">
                                        <p className="font-semibold">Error:</p>
                                        <pre className="whitespace-pre-wrap break-words">
                                            {this.state.error.toString()}
                                        </pre>
                                        {this.state.errorInfo && (
                                            <>
                                                <p className="font-semibold mt-2">Stack Trace:</p>
                                                <pre className="whitespace-pre-wrap break-words text-xs">
                                                    {this.state.errorInfo.componentStack}
                                                </pre>
                                            </>
                                        )}
                                    </div>
                                </details>
                            )}
                            
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Refresh Page
                                </button>
                                <button
                                    onClick={() => window.history.back()}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 