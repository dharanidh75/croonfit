import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] p-6 text-center">
          <h2 className="text-2xl font-bold text-[#111111] mb-2">Something went wrong.</h2>
          <p className="text-sm text-[#666666] mb-6 max-w-md">
            We couldn't load this page. If the server restarted, you might just need to refresh.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#111111] text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
