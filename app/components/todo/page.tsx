'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import useSWR from 'swr'

interface Review {
  id: string
  productName: string
  boughtFromUrl: string
  stars: number
  description?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

// Fetcher for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default function ReviewsPage() {
  const { data: session, status } = useSession()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    productName: '',
    boughtFromUrl: '',
    stars: 5,
    description: '',
    imageUrl: ''
  })

  // Fetch reviews
  const { 
    data: reviews = [], 
    error: fetchError, 
    isLoading, 
    mutate 
  } = useSWR<Review[]>('/api/reviews', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  })

  // Redirect if not authenticated
  if (status === 'loading') return <p>Loading...</p>
  if (status === 'unauthenticated') redirect('/auth/signin')

  // Add new review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.productName.trim() || !formData.stars) {
      setError('Product name and stars are required')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create review')
      }

      const newReview = await response.json()
      mutate([newReview, ...reviews], false) // Optimistic update
      setFormData({ productName: '', boughtFromUrl: '', stars: 5, description: '', imageUrl: '' })
      mutate() // Revalidate
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      mutate() // rollback
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Reviews
            </h1>
            <p className="text-gray-600">Welcome back, {session?.user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg"
          >
            Sign Out
          </button>
        </div>

        {/* Add Review Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Add New Review</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="productName"
              placeholder="Product Name *"
              value={formData.productName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />
            <input
              type="url"
              name="boughtFromUrl"
              placeholder="Bought From URL"
              value={formData.boughtFromUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-xl"
            />
            <input
              type="number"
              name="stars"
              placeholder="Stars (1–5)"
              min="1"
              max="5"
              value={formData.stars}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-xl"
            />
            <textarea
              name="description"
              placeholder="Write your review..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border rounded-xl resize-none"
            />
            <input
              type="url"
              name="imageUrl"
              placeholder="Image URL (optional)"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-xl"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl"
            >
              {submitting ? 'Adding...' : 'Add Review'}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && <p className="text-red-600">{error}</p>}

        {/* Reviews List */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Your Reviews ({reviews.length})</h2>
          {isLoading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p>No reviews yet. Add your first one above!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 border rounded-xl hover:bg-gray-50">
                  <h3 className="text-lg font-medium">{review.productName}</h3>
                  <p className="text-yellow-600">⭐ {review.stars} / 5</p>
                  {review.description && <p className="text-gray-600 mt-2">{review.description}</p>}
                  {review.imageUrl && (
                    <img src={review.imageUrl} alt={review.productName} className="mt-2 w-32 h-32 object-cover rounded-lg" />
                  )}
                  {review.boughtFromUrl && (
                    <a
                      href={review.boughtFromUrl}
                      target="_blank"
                      className="text-indigo-600 underline mt-2 block"
                    >
                      View Product
                    </a>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Created {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
