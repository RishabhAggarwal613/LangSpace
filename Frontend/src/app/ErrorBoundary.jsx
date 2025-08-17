import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      try {
        // Log only safe, primitive strings
        console.error("[ErrorBoundary]", error?.message || String(error));
        if (error?.stack) console.error("[Stack]", error.stack);
        if (info?.componentStack) console.error("[ComponentStack]", info.componentStack);
      } catch {
        // ignore logging errors
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // Accept a ready-made element via `fallback`, or a component via `FallbackComponent`
      const { fallback, FallbackComponent } = this.props;
      if (fallback) return fallback;
      if (FallbackComponent) return <FallbackComponent error={this.state.error} />;
      return null;
    }
    return this.props.children;
  }
}
