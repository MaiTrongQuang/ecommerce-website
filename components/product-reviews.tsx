"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Review {
  id: string
  rating: number
  title: string | null
  comment: string | null
  created_at: string
  profiles: {
    full_name: string | null
  }
}

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
  averageRating: number
}

export function ProductReviews({ productId, reviews, averageRating }: ProductReviewsProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("Please login to leave a review")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          rating,
          title,
          comment,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit review")

      toast.success("Review submitted successfully")
      setShowForm(false)
      setTitle("")
      setComment("")
      setRating(5)
      router.refresh()
    } catch (error) {
      toast.error("Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">{averageRating.toFixed(1)} out of 5</span>
            <span className="text-muted-foreground">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      {user && !showForm && <Button onClick={() => setShowForm(true)}>Write a Review</Button>}

      {!user && (
        <p className="text-sm text-muted-foreground">
          Please{" "}
          <Button variant="link" className="p-0 h-auto" asChild>
            <a href="/auth/login">login</a>
          </Button>{" "}
          to leave a review
        </p>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Write Your Review</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} type="button" onClick={() => setRating(value)} className="focus:outline-none">
                      <Star
                        className={`h-8 w-8 cursor-pointer transition-colors ${
                          value <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground hover:text-yellow-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sum up your review"
                />
              </div>

              <div>
                <Label htmlFor="comment">Review</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    {review.title && <h4 className="font-semibold">{review.title}</h4>}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && <p className="text-muted-foreground mt-2">{review.comment}</p>}
                <p className="text-sm text-muted-foreground mt-2">By {review.profiles?.full_name || "Anonymous"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
