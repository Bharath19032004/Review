"use client"
import React, { AnyActionArg, useState } from 'react'

const CustomerReviewPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignIn = () => {
    window.location.href = '/auth/signin'
  }

  const handleGetStarted = () => {
    window.location.href = '/auth/signin'
  }

  // Sample review data
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      rating: 5,
      review: "TaskFlow has completely transformed how I manage my daily tasks. The interface is intuitive and the progress tracking keeps me motivated. I've seen a 40% increase in my productivity since using it.",
      avatar: "SJ",
      verified: true,
      date: "2 days ago"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Software Engineer",
      company: "StartupXYZ",
      rating: 5,
      review: "The team collaboration features are outstanding. We can now track project progress in real-time and everyone stays on the same page. The mobile app is just as good as the desktop version.",
      avatar: "MC",
      verified: true,
      date: "1 week ago"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Freelance Designer",
      company: "Self-employed",
      rating: 5,
      review: "As a freelancer, I need to juggle multiple clients and projects. TaskFlow's smart categorization and priority system helps me stay organized and never miss a deadline. Highly recommended!",
      avatar: "ER",
      verified: true,
      date: "3 days ago"
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Marketing Director",
      company: "GrowthCo",
      rating: 4,
      review: "Great tool for managing marketing campaigns and team tasks. The analytics dashboard gives us valuable insights into our productivity patterns. The only minor issue is the learning curve for new team members.",
      avatar: "DT",
      verified: true,
      date: "5 days ago"
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "Student",
      company: "University",
      rating: 5,
      review: "Perfect for managing my coursework and assignments. The deadline reminders and progress tracking help me stay on top of everything. The free tier has everything I need as a student.",
      avatar: "LW",
      verified: true,
      date: "1 week ago"
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Consultant",
      company: "Wilson & Associates",
      rating: 5,
      review: "I've tried many task management tools, but TaskFlow stands out for its simplicity and power. The cross-platform sync is flawless, and I can access my tasks from anywhere. The customer support is also excellent.",
      avatar: "JW",
      verified: true,
      date: "4 days ago"
    }
  ]

  const stats = [
    { label: "Happy Customers", value: "50,000+" },
    { label: "Tasks Completed", value: "2M+" },
    { label: "Average Rating", value: "4.9/5" },
    { label: "Countries", value: "120+" }
  ]

  // @ts-ignore
  const renderStars = (rating: any) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">vibecutomers</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#reviews" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <button 
                onClick={handleSignIn}
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#reviews" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
                <button 
                  onClick={handleSignIn}
                  className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors text-left"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-left"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              What Our <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Customers</span> Say
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their productivity with TaskFlow. 
              Read their stories and see why they love our platform.
            </p>
            
            {/* Overall Rating */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="flex items-center space-x-1">
                {renderStars(5)}
              </div>
              <span className="text-2xl font-bold text-gray-900">4.9</span>
              <span className="text-gray-600">out of 5</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
     <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {['all', '5-star', '4-star', '3-star'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedFilter === filter
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all' ? 'All Reviews' : `${filter.replace('-', ' ')} Reviews`}
                </button>
              ))}
            </div>
          </div>
        </section>


      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{review.name}</h3>
                        {review.verified && (
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{review.role} at {review.company}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {renderStars(review.rating)}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed">{review.review}</p>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
              Load More Reviews
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to join our happy customers?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Start your productivity journey today and see why thousands of users trust TaskFlow 
            to manage their tasks and boost their efficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </button>
            <button 
              onClick={handleSignIn}
              className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-200 font-semibold text-lg"
            >
              Sign In
            </button>
          </div>
          
          <p className="text-indigo-100 text-sm mt-6">
            Free 14-day trial. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">TaskFlow</span>
              </div>
              <p className="text-gray-400">
                Simplifying productivity, one task at a time.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">Crafted with ❤ by <a href="https://github.com/HithxDevs" className="text-blue-600 hover:text-blue-700 transition-colors duration-200">HithxDevs</a></p>
            <br />
            <p className="text-gray-400">
              © 2024 TaskFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CustomerReviewPage