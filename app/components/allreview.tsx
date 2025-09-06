'use client'

import { useState, useEffect } from 'react'

interface Review {
  id: string
  productName: string
  description?: string
  stars?: number
  imageUrl?: string
  boughtFromUrl?: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name?: string
    email: string
  }
}

const renderStars = (rating: number = 0) => {
  return [...Array(5)].map((_, i) => (
    <svg
      key={i}
      className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.945a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.946c.3.92-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.286-3.946a1 1 0 00-.364-1.118L2.075 9.372c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.945z" />
    </svg>
  ))
}

const AllReviewPage = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [visibleCount, setVisibleCount] = useState(6)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/all-reviews')
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews')
        }
        
        const data = await response.json()
        setReviews(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  if (loading) {
    return (
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading reviews...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">Error: {error}</div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return (
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center py-10">No reviews yet.</p>
        </div>
      </section>
    )
  }

  const visibleReviews = reviews.slice(0, visibleCount)

  return (
    <section id="reviews" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Customer Reviews</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{review.productName}</h3>
                  {review.user && (
                    <>
                      {review.user.name && (
                        <p className="text-sm text-gray-700">Customer: {review.user.name}</p>
                      )}
                      <p className="text-sm text-gray-600">Email: {review.user.email}</p>
                    </>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Rating */}
              <div
                className="flex items-center space-x-1 mb-4"
                aria-label={`Rating: ${review.stars || 0} out of 5`}
              >
                {renderStars(review.stars || 0)}
              </div>

              {/* Review Text */}
              {review.description && (
                <p className="text-gray-700 leading-relaxed">{review.description}</p>
              )}

              {/* Image */}
              {review.imageUrl && (
                <img
                  src={review.imageUrl}
                  alt={review.productName}
                  className="mt-4 w-full h-40 object-cover rounded-lg"
                />
              )}

              {/* Bought From */}
              {review.boughtFromUrl && (
                <a
                  href={review.boughtFromUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-indigo-600 underline mt-3"
                >
                  View Product
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < reviews.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default AllReviewPage