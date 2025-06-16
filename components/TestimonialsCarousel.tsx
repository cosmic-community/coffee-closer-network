'use client'

import { useState, useEffect } from 'react'
import type { Testimonial } from '@/types'

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (testimonials.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  if (testimonials.length === 0) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]
  if (!currentTestimonial) return null

  return (
    <section className="py-20 bg-coffee-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            What Our Members Say
          </h2>
          <p className="text-xl text-neutral-600">
            Real feedback from sales professionals in our community
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
            <div className="text-coffee-600 text-5xl mb-6">"</div>
            
            <blockquote className="text-xl md:text-2xl text-neutral-700 mb-8 leading-relaxed">
              {currentTestimonial.metadata?.quote}
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              {currentTestimonial.metadata?.from_user?.metadata?.profile_picture && (
                <img
                  src={`${currentTestimonial.metadata.from_user.metadata.profile_picture.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
                  alt={currentTestimonial.metadata?.from_user?.metadata?.full_name || 'User'}
                  width="60"
                  height="60"
                  className="rounded-full"
                />
              )}
              <div className="text-left">
                <div className="font-semibold text-neutral-900">
                  {currentTestimonial.metadata?.from_user?.metadata?.full_name}
                </div>
                <div className="text-neutral-600">
                  {currentTestimonial.metadata?.from_user?.metadata?.current_role}
                  {currentTestimonial.metadata?.from_user?.metadata?.company && (
                    <span> at {currentTestimonial.metadata.from_user.metadata.company}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Rating stars */}
            {currentTestimonial.metadata?.rating && (
              <div className="flex justify-center gap-1 mt-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < parseInt(currentTestimonial.metadata?.rating?.key || '0')
                        ? 'text-yellow-400'
                        : 'text-neutral-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Navigation dots */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-coffee-600' : 'bg-neutral-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}