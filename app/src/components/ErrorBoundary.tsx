import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-dark-50 border border-red-500/20 rounded-2xl p-8 text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
                            <p className="text-sm text-gray-400 mb-4 max-h-32 overflow-auto">
                                {this.state.error?.message || "An unexpected error occurred in the application."}
                            </p>
                        </div>
                        <Button
                            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                            onClick={() => window.location.href = '/'}
                        >
                            Return Home
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
