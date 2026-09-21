import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute('/sell')({
  component: SellPage,
})

function SellPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Post a New Listing</CardTitle>
          <CardDescription>Fill out the details below to sell your item.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">Sell form coming soon...</p>
            <Button>Submit Listing</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
