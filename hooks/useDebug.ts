'use client'

import { useState, useCallback, useEffect } from 'react'

interface DebugEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  data?: any
}

let debugStore: DebugEntry[] = []
let listeners: ((entries: DebugEntry[]) => void)[] = []

// Global debug function that can be used anywhere
declare global {
  interface Window {
    debug: (message: string, data?: any, level?: 'info' | 'warn' | 'error' | 'debug') => void
  }
}

const addDebugEntry = (message: string, data?: any, level: 'info' | 'warn' | 'error' | 'debug' = 'debug') => {
  const entry: DebugEntry = {
    timestamp: new Date().toLocaleTimeString(),
    level,
    message,
    data
  }
  
  debugStore.push(entry)
  
  // Keep only last 100 entries
  if (debugStore.length > 100) {
    debugStore = debugStore.slice(-100)
  }
  
  // Notify all listeners
  listeners.forEach(listener => listener([...debugStore]))
  
  // Also log to console for convenience
  console.log(`[DEBUG ${entry.timestamp}] ${message}`, data || '')
}

export function useDebug() {
  const [isVisible, setIsVisible] = useState(false)
  const [debugData, setDebugData] = useState<DebugEntry[]>(debugStore)

  // Setup global debug function
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.debug = addDebugEntry
    }
  }, [])

  // Subscribe to debug updates
  useEffect(() => {
    const listener = (entries: DebugEntry[]) => {
      setDebugData(entries)
    }
    
    listeners.push(listener)
    
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }, [])

  const toggle = useCallback(() => {
    setIsVisible(prev => !prev)
  }, [])

  const clear = useCallback(() => {
    debugStore = []
    setDebugData([])
    listeners.forEach(listener => listener([]))
  }, [])

  const log = useCallback((message: string, data?: any, level: 'info' | 'warn' | 'error' | 'debug' = 'debug') => {
    addDebugEntry(message, data, level)
  }, [])

  return {
    isVisible,
    debugData,
    toggle,
    clear,
    log
  }
}

// Export the debug function for use in other modules
export const debug = addDebugEntry