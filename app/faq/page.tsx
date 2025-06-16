import { getFAQItems } from '@/lib/cosmic'
import FAQSection from '@/components/FAQSection'
import type { FAQItem, FAQCategory } from '@/types'

export const metadata = {
  title: 'FAQ - Coffee Closer Network',
  description: 'Frequently asked questions about Coffee Closer Network',
}

export default async function FAQPage() {
  const faqItems = await getFAQItems()

  // Group FAQ items by category
  const groupedFAQs = faqItems.reduce((acc, item) => {
    const category = item.metadata?.category?.key || 'PLATFORM'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<FAQCategory, FAQItem[]>)

  const categoryLabels: Record<FAQCategory, string> = {
    ONBOARDING: 'Getting Started',
    SCHEDULING: 'Scheduling & Meetings',
    NETWORKING: 'Networking & Matching',
    PLATFORM: 'Platform Features',
    COMMUNITY: 'Community Guidelines',
    TECHNICAL: 'Technical Support'
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Everything you need to know about Coffee Closer Network. 
            Can't find what you're looking for? Reach out to our support team.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {Object.entries(groupedFAQs).map(([category, items]) => (
            <FAQSection
              key={category}
              title={categoryLabels[category as FAQCategory]}
              items={items}
            />
          ))}

          {/* Contact Support */}
          <div className="text-center mt-16 p-8 bg-coffee-50 rounded-xl">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-neutral-600 mb-6">
              Our support team is here to help you make the most of your Coffee Closer Network experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@coffeecloser.network" 
                className="btn btn-primary"
              >
                Contact Support
              </a>
              <a 
                href="/about" 
                className="btn btn-secondary"
              >
                Learn More About Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}