import { Component } from 'react';

// Last line of defence: if any component throws, show a branded message instead of a blank page.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('TNC UI crashed:', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <section className="crash">
        <img src="/images/pcm-logo.png" alt="" />
        <h1>Something went wrong</h1>
        <p>The page hit an unexpected problem. Please reload. If it keeps happening, contact the TNC communication team.</p>
        <button className="btn btn--primary" onClick={() => window.location.reload()}><span>Reload page</span></button>
        {import.meta.env.DEV && <pre>{String(this.state.error?.stack || this.state.error)}</pre>}
      </section>
    );
  }
}
