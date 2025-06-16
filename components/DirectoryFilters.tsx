'use client'

import { useState } from 'react'

export default function DirectoryFilters() {
  const [filters, setFilters] = useState({
    industry: '',
    seniority: '',
    timezone: '',
    topics: [] as string[]
  })

  const industries = [
    'SaaS',
    'Fintech',
    'Healthcare',
    'EdTech',
    'E-commerce',
    'MarTech',
    'Cybersecurity',
    'Other'
  ]

  const seniorityLevels = [
    'SDR (Sales Development Rep)',
    'BDR (Business Development Rep)',
    'AE (Account Executive)',
    'Senior Account Executive',
    'Account Manager',
    'Customer Success Manager',
    'Sales Manager',
    'Sales Director',
    'VP of Sales'
  ]

  const timezones = [
    'Eastern Time (EST/EDT)',
    'Central Time (CST/CDT)',
    'Mountain Time (MST/MDT)',
    'Pacific Time (PST/PDT)',
    'Greenwich Mean Time (GMT)',
    'Central European Time (CET)'
  ]

  const topics = [
    'Prospecting Strategies',
    'Objection Handling',
    'Deal Closing',
    'Sales Tools & Tech',
    'Career Development',
    'Team Management',
    'Customer Success',
    'Industry Trends',
    'Work-Life Balance',
    'Networking Tips'
  ]

  const clearFilters = () => {
    setFilters({
      industry: '',
      seniority: '',
      timezone: '',
      topics: []
    })
  }

  return (
    <div className="card sticky top-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Filter Members</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-coffee-600 hover:text-coffee-700"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Industry
          </label>
          <select
            value={filters.industry}
            onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-coffee-500"
          >
            <option value="">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        {/* Seniority Level */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Seniority Level
          </label>
          <select
            value={filters.seniority}
            onChange={(e) => setFilters(prev => ({ ...prev, seniority: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-coffee-500"
          >
            <option value="">All Levels</option>
            {seniorityLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Timezone
          </label>
          <select
            value={filters.timezone}
            onChange={(e) => setFilters(prev => ({ ...prev, timezone: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-coffee-500"
          >
            <option value="">All Timezones</option>
            {timezones.map(timezone => (
              <option key={timezone} value={timezone}>{timezone}</option>
            ))}
          </select>
        </div>

        {/* Topics of Interest */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Topics of Interest
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {topics.map(topic => (
              <label key={topic} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.topics.includes(topic)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({ ...prev, topics: [...prev.topics, topic] }))
                    } else {
                      setFilters(prev => ({ ...prev, topics: prev.topics.filter(t => t !== topic) }))
                    }
                  }}
                  className="rounded border-neutral-300 text-coffee-600 focus:ring-coffee-500"
                />
                <span className="text-sm text-neutral-700">{topic}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Search Button */}
      <button className="btn btn-primary w-full mt-6">
        Apply Filters
      </button>
    </div>
  )
}