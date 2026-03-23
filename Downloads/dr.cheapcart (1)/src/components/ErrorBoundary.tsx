import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong. Please try again later.";
      let details = "";

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Permission Denied: Unable to ${parsed.operationType} at ${parsed.path || 'unknown path'}.`;
            details = `Error: ${parsed.error}`;
          }
        }
      } catch (e) {
        // Not a JSON error message, use default
        if (this.state.error?.message.includes('Missing or insufficient permissions')) {
          errorMessage = "You don't have permission to perform this action.";
        }
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl border border-red-100 p-8 max-w-md w-full text-center space-y-6 shadow-xl shadow-red-50">
            <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">{errorMessage}</h2>
              {details && <p className="text-sm text-red-500 font-mono bg-red-50 p-2 rounded-lg break-all">{details}</p>}
              <p className="text-sm text-gray-500">
                If you are an admin, please ensure your account has the correct permissions.
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-gray-800 transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
