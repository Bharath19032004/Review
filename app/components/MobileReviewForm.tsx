// app/components/MobileReviewForm.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

interface ReviewFormData {
  customerName: string
  mobileNumber: string
  productType: string
  productName: string
  stars: number
  productQuality: string
  serviceQuality: string
  wouldRecommend: boolean | null
  description: string
  imageUrl: string
}

export default function MobileReviewForm() {
  const { data: session, status } = useSession()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState<ReviewFormData>({
    customerName: '',
    mobileNumber: '',
    productType: '',
    productName: '',
    stars: 5,
    productQuality: '',
    serviceQuality: '',
    wouldRecommend: null,
    description: '',
    imageUrl: ''
  })

  // Redirect if not authenticated
  if (status === 'loading') return <p>Loading...</p>
  if (status === 'unauthenticated') redirect('/auth/signin')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        throw new Error(errorData.error || 'Failed to submit review')
      }

      setSuccess(true)
      // Reset form
      setFormData({
        customerName: '',
        mobileNumber: '',
        productType: '',
        productName: '',
        stars: 5,
        productQuality: '',
        serviceQuality: '',
        wouldRecommend: null,
        description: '',
        imageUrl: ''
      })
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">📋 Customer Review Form</h1>
      <h2 className="text-lg font-semibold text-center mb-8 text-gray-600">Mobile Shop Experience</h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Thank you for your review! Your feedback has been submitted successfully.
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            1. Customer Name (optional)
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your name"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            2. Mobile Number (optional)
          </label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your mobile number"
          />
        </div>

        {/* Product Purchased */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            3. Product Purchased *
          </label>
          <select
            name="productType"
            value={formData.productType}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select product type</option>
            <option value="Mobile Phone">Mobile Phone</option>
            <option value="Accessories">Accessories</option>
            <option value="Repair Service">Repair Service</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., iPhone 15, Samsung Repair, etc."
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            4. Rate Your Experience (1 = Very Poor, 5 = Excellent) *
          </label>
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

        {/* Product Quality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            5. How was the product quality? *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Excellent', 'Good', 'Average', 'Poor'].map((quality) => (
              <label key={quality} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="productQuality"
                  checked={formData.productQuality === quality}
                  onChange={() => handleRadioChange('productQuality', quality)}
                  required
                  className="text-indigo-600"
                />
                <span>{quality}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Service Quality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            6. How was the service at our shop? *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Excellent', 'Good', 'Average', 'Poor'].map((quality) => (
              <label key={quality} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="serviceQuality"
                  checked={formData.serviceQuality === quality}
                  onChange={() => handleRadioChange('serviceQuality', quality)}
                  required
                  className="text-indigo-600"
                />
                <span>{quality}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Would Recommend */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            7. Would you recommend us to others? *
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="wouldRecommend"
                checked={formData.wouldRecommend === true}
                onChange={() => handleRadioChange('wouldRecommend', true)}
                required
                className="text-indigo-600"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="wouldRecommend"
                checked={formData.wouldRecommend === false}
                onChange={() => handleRadioChange('wouldRecommend', false)}
                required
                className="text-indigo-600"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* Additional Comments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            8. Additional Comments / Suggestions
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Share your thoughts or suggestions..."
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL (optional)
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}