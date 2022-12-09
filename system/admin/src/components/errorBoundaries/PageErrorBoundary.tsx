import React from 'react';

class PageErrorBoundary extends React.Component<
  { children: any },
  { hasError: boolean; errorMessage: string; stack: string }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '', stack: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error.message || JSON.stringify(error),
      stack: error.stack,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h3>There is a problem. Please refresh the page</h3>
          <br />
          <p>{this.state.errorMessage}</p>
          <p>{this.state.stack}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary;
