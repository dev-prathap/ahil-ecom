"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="festive-card max-w-md w-full">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">😔</div>
          <CardTitle className="text-xl font-serif festive-text-maroon">
            Something went wrong!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            We're sorry, but something unexpected happened. Please try again.
          </p>
          <Button 
            onClick={reset}
            className="festive-button w-full"
          >
            Try again
          </Button>
          <p className="text-xs text-muted-foreground">
            If the problem persists, please contact us at (214) 223-7740
          </p>
        </CardContent>
      </Card>
    </div>
  )
}