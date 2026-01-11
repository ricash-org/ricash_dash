import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError() {
    // Met à jour le state pour afficher l'UI de fallback
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log l'erreur pour debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback personnalisée
      return (
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Une erreur s'est produite
            </CardTitle>
            <CardDescription>
              Une erreur inattendue s'est produite dans cette partie de l'application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={this.handleReset}
              variant="outline"
              className="w-full"
            >
              Réessayer
            </Button>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer">Détails de l'erreur (dev only)</summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
