'use client'

import { useState } from 'react'
import type { FAQItem } from '@/types'

interface FAQSectionProps {
  title: string
  items: FAQItem[]
}

export default function FAQSection({ title, items }: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        {title}
      </h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="card">
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex justify-between items-center text-left"
            >
              <h3 className="text-lg font-semibold text-neutral-900 pr-4">
                {item.metadata?.question || item.title}
              </h3>
              <div className={`transform transition-transform ${
                openItems.has(item.id) ? 'rotate-180' : ''
              }`}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-neutral-600"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
            
            {openItems.has(item.id) && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                {item.metadata?.answer && (
                  <div 
                    className="prose-custom text-neutral-700"
                    dangerouslySetInnerHTML={{ __html: item.metadata.answer }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}