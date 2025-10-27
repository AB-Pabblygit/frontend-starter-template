import { Component } from 'react';

import { Box, Alert, Button, Typography } from '@mui/material';

// ----------------------------------------------------------------------

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children } = this.props;
    
    if (hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            p: 3,
            textAlign: 'center',
          }}
        >
          <Alert severity="error" sx={{ mb: 3, maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={this.handleRetry}
              sx={{ minWidth: 120 }}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{ minWidth: 120 }}
            >
              Refresh Page
            </Button>
          </Box>

          {process.env.NODE_ENV === 'development' && error && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1, maxWidth: 800 }}>
              <Typography variant="h6" color="error" gutterBottom>
                Error Details (Development Only)
              </Typography>
              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
                {error.toString()}
                {errorInfo.componentStack}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
