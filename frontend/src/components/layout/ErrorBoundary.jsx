import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details to services like Sentry, LogRocket, or console
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-text">
          <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-medium text-center">
            <h1 className="text-xl font-bold text-error mb-4">Something went wrong</h1>
            <p className="text-sm text-text-muted mb-6">
              An unexpected error occurred in the application. Please try reloading or resetting the session.
            </p>
            {this.state.error && (
              <pre className="mb-6 max-h-40 overflow-y-auto rounded bg-background p-3 text-left text-xs font-mono text-error border border-border">
                {this.state.error.toString()}
              </pre>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/95 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-border/50"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
