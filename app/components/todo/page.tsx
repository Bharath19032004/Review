// app/components/Dashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import useSWR from 'swr'

interface Review {
  id: string
  customerName: string
  mobileNumber: string
  productType: string
  productName: string
  stars: number
  productQuality: string
  serviceQuality: string
  wouldRecommend: boolean
  description?: string
  imageUrl?: string
  boughtFromUrl?: string
  createdAt: string
  updatedAt: string
}

interface Analytics {
  totalReviews: number
  averageRating: number
  recommendationRate: number
  productTypeDistribution: Record<string, number>
  qualityDistribution: {
    product: Record<string, number>
    service: Record<string, number>
  }
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes in seconds
  const [analytics, setAnalytics] = useState<Analytics | null>(null)

  const { 
    data: reviews = [], 
    error: fetchError, 
    isLoading, 
    mutate 
  } = useSWR<Review[]>('/api/mobile-reviews', fetcher)

  // Redirect if not authenticated
  if (status === 'loading') return <p>Loading...</p>
  if (status === 'unauthenticated') redirect('/auth/signin')

  // Calculate analytics when reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      const totalReviews = reviews.length
      const averageRating = reviews.reduce((sum, review) => sum + (review.stars || 0), 0) / totalReviews
      const recommendationRate = (reviews.filter(review => review.wouldRecommend).length / totalReviews) * 100
      
      const productTypeDistribution: Record<string, number> = {}
      const productQualityDistribution: Record<string, number> = {}
      const serviceQualityDistribution: Record<string, number> = {}

      reviews.forEach(review => {
        // Product type distribution
        productTypeDistribution[review.productType] = (productTypeDistribution[review.productType] || 0) + 1
        
        // Product quality distribution
        productQualityDistribution[review.productQuality] = (productQualityDistribution[review.productQuality] || 0) + 1
        
        // Service quality distribution
        serviceQualityDistribution[review.serviceQuality] = (serviceQualityDistribution[review.serviceQuality] || 0) + 1
      })

      setAnalytics({
        totalReviews,
        averageRating,
        recommendationRate,
        productTypeDistribution,
        qualityDistribution: {
          product: productQualityDistribution,
          service: serviceQualityDistribution
        }
      })
    }
  }, [reviews])

  // Timer for review form
  useEffect(() => {
    if (showReviewForm && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setShowReviewForm(false)
    }
  }, [showReviewForm, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAddReview = () => {
    setShowReviewForm(true)
    setTimeLeft(120)
  }

  const handleCloseForm = () => {
    setShowReviewForm(false)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Customer Feedback Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {session?.user?.email}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleAddReview}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700"
            >
              + Add Customer Review
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Analytics Section */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Reviews Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Reviews</h3>
              <p className="text-3xl font-bold text-indigo-600">{analytics.totalReviews}</p>
            </div>

            {/* Average Rating Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Rating</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {analytics.averageRating.toFixed(1)}/5
              </p>
            </div>

            {/* Recommendation Rate Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Recommendation Rate</h3>
              <p className="text-3xl font-bold text-green-600">
                {analytics.recommendationRate.toFixed(1)}%
              </p>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
              <button
                onClick={handleAddReview}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg mb-2"
              >
                Add Review
              </button>
              <button
                onClick={() => mutate()}
                className="w-full bg-gray-500 text-white py-2 rounded-lg"
              >
                Refresh Data
              </button>
            </div>
          </div>
        )}

        {/* Detailed Analytics */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Product Type Distribution */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Type Distribution</h3>
              <div className="space-y-2">
                {Object.entries(analytics.productTypeDistribution).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-gray-600">{type}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Ratings */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Quality Ratings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Product Quality</h4>
                  {Object.entries(analytics.qualityDistribution.product).map(([quality, count]) => (
                    <div key={quality} className="flex justify-between">
                      <span>{quality}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Service Quality</h4>
                  {Object.entries(analytics.qualityDistribution.service).map(([quality, count]) => (
                    <div key={quality} className="flex justify-between">
                      <span>{quality}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Customer Review</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Time left: </span>
                  <span className={`font-bold ${timeLeft <= 30 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              
              {timeLeft > 0 ? (
                <ReviewForm 
                  onClose={handleCloseForm}
                  onSuccess={() => {
                    setShowReviewForm(false)
                    mutate()
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-600 font-semibold mb-4">Time's up! Form has been discarded.</p>
                  <button
                    onClick={handleCloseForm}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Customer Reviews ({reviews.length})</h2>
            <button
              onClick={() => mutate()}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm"
            >
              Refresh
            </button>
          </div>
          
          {isLoading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p>No reviews yet. Add your first one above!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="p-6 border rounded-xl hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{review.productName}</h3>
                      <p className="text-gray-600">Type: {review.productType}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {review.customerName && (
                    <p className="text-sm text-gray-600 mt-2">Customer: {review.customerName}</p>
                  )}
                  {review.mobileNumber && (
                    <p className="text-sm text-gray-600">Mobile: {review.mobileNumber}</p>
                  )}
                  
                  <div className="mt-3">
                    <p className="text-yellow-600">⭐ {review.stars} / 5</p>
                    <p className="text-sm text-gray-600">Product Quality: {review.productQuality}</p>
                    <p className="text-sm text-gray-600">Service Quality: {review.serviceQuality}</p>
                    <p className="text-sm text-gray-600">
                      Would Recommend: {review.wouldRecommend ? 'Yes' : 'No'}
                    </p>
                  </div>
                  
                  {review.description && (
                    <p className="text-gray-600 mt-3">{review.description}</p>
                  )}
                  
                  {review.imageUrl && (
                    <img
                      src={review.imageUrl}
                      alt={review.productName}
                      className="mt-3 w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                  
                  {review.boughtFromUrl && (
                    <a
                      href={review.boughtFromUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline mt-3 block"
                    >
                      View Product
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Review Form Component (separate component for better organization)
function ReviewForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    productType: '',
    productName: '',
    stars: 5,
    productQuality: '',
    serviceQuality: '',
    wouldRecommend: null as boolean | null,
    description: '',
    imageUrl: '',
    boughtFromUrl: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleRadioChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.productType || !formData.productName || !formData.productQuality || 
        !formData.serviceQuality || formData.wouldRecommend === null) {
      setError('Please fill all required fields')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/mobile-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create review')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name (optional)</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (optional)</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
        <select
          name="productType"
          value={formData.productType}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Select product type</option>
          <option value="Grocery">Grocery</option>
          <option value="Accessories">Accessories</option>
          <option value="Service">Service</option>
          <option value="Beauty & Personal Care">Beauty & Personal Care</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5) *</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, stars: star }))}
              className={`text-2xl ${star <= formData.stars ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Quality *</label>
          <select
            name="productQuality"
            value={formData.productQuality}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select quality</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Average">Average</option>
            <option value="Poor">Poor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Quality *</label>
          <select
            name="serviceQuality"
            value={formData.serviceQuality}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select quality</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Average">Average</option>
            <option value="Poor">Poor</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Would Recommend? *</label>
        <select
          name="wouldRecommend"
          value={formData.wouldRecommend === null ? '' : formData.wouldRecommend.toString()}
          onChange={(e) => handleRadioChange('wouldRecommend', e.target.value === 'true')}
          required
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Select option</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product URL (optional)</label>
          <input
            type="url"
            name="boughtFromUrl"
            value={formData.boughtFromUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-500 text-white py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}