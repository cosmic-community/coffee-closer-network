'use client'

import { useState } from 'react'

export default function BlogFilters() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const tags = [
    'Sales Tips',
    'Success Stories',
    'Networking',
    'Career Growth',
    'Platform Updates',
    'Member Spotlight',
    'Industry News',
    'Best Practices'
  ]

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="card sticky top-8">
      <h3 className="text-lg font-semibold mb-4">Filter by Topic</h3>
      
      <div className="space-y-2">
        {tags.map((tag) => (
          <label key={tag} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedTags.includes(tag)}
              onChange={() => toggleTag(tag)}
              className="rounded border-neutral-300 text-coffee-600 focus:ring-coffee-500"
            />
            <span className="text-sm text-neutral-700">{tag}</span>
          </label>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <button
            onClick={() => setSelectedTags([])}
            className="text-sm text-coffee-600 hover:text-coffee-700"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Recent Posts */}
      <div className="mt-8 pt-6 border-t border-neutral-200">
        <h4 className="font-semibold mb-4">Popular This Week</h4>
        <div className="space-y-3">
          <a href="#" className="block text-sm text-neutral-700 hover:text-coffee-600">
            5 Prospecting Strategies That Actually Work
          </a>
          <a href="#" className="block text-sm text-neutral-700 hover:text-coffee-600">
            How I Doubled My Close Rate in 6 Months
          </a>
          <a href="#" className="block text-sm text-neutral-700 hover:text-coffee-600">
            The Art of Following Up Without Being Annoying
          </a>
        </div>
      </div>
    </div>
  )
}