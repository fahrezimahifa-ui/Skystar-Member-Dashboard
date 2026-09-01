import { Component, type ReactNode } from 'react';
import { Button } from '../ui';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
          <div className="glass-strong max-w-md rounded-3xl p-8 text-center">
            <h1 className="text-lg font-bold text-ink mb-2">Something went wrong</h1>
            <p className="text-sm text-ink-soft mb-4">{this.state.error.message}</p>
            <Button onClick={() => this.setState({ error: null })}>Try again</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
