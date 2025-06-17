'use client'

import { useState, useEffect } from 'react'
import { useDebug } from '@/hooks/useDebug'

export default function DebugWindow() {
  const { isVisible, debugData, toggle, clear } = useDebug()
  const [minimized, setMinimized] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Toggle debug window with Ctrl+D or Cmd+D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        toggle()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [toggle])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={toggle}
        className="fixed bottom-4 right-4 w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors z-50 flex items-center justify-center text-sm font-bold"
        title="Toggle Debug Window (Ctrl+D)"
      >
        🐛
      </button>

      {/* Debug Window */}
      <div className={`fixed bottom-20 right-4 w-96 bg-black text-green-400 rounded-lg shadow-2xl border border-gray-700 ${
        minimized ? 'h-10' : 'h-96'
      } transition-all duration-200 z-40`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <h3 className="text-sm font-bold text-white">Debug Console</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMinimized(!minimized)}
              className="text-yellow-400 hover:text-yellow-300 text-xs"
              title={minimized ? 'Expand' : 'Minimize'}
            >
              {minimized ? '□' : '_'}
            </button>
            <button
              onClick={clear}
              className="text-blue-400 hover:text-blue-300 text-xs"
              title="Clear"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Content */}
        {!minimized && (
          <div className="p-3 overflow-y-auto h-80 text-xs">
            {/* Environment Info */}
            <div className="mb-4">
              <h4 className="text-yellow-400 font-bold mb-2">Environment</h4>
              <div className="space-y-1 text-gray-300">
                <div>NODE_ENV: {process.env.NODE_ENV || 'undefined'}</div>
                <div>URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}</div>
                <div>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 50) + '...' : 'SSR'}</div>
                <div>Timestamp: {new Date().toISOString()}</div>
              </div>
            </div>

            {/* Debug Logs */}
            <div className="mb-4">
              <h4 className="text-yellow-400 font-bold mb-2">Debug Logs ({debugData.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {debugData.length === 0 ? (
                  <div className="text-gray-500 italic">No debug data yet...</div>
                ) : (
                  debugData.slice(-20).reverse().map((entry, index) => (
                    <div key={index} className="border-l-2 border-blue-500 pl-2">
                      <div className="text-blue-400 text-xs">
                        {entry.timestamp} [{entry.level.toUpperCase()}]
                      </div>
                      <div className="text-white">{entry.message}</div>
                      {entry.data && (
                        <pre className="text-gray-400 text-xs mt-1 whitespace-pre-wrap break-all">
                          {typeof entry.data === 'object' 
                            ? JSON.stringify(entry.data, null, 2)
                            : String(entry.data)
                          }
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* System Info */}
            <div>
              <h4 className="text-yellow-400 font-bold mb-2">System Status</h4>
              <div className="space-y-1 text-gray-300">
                <div>Memory: {typeof performance !== 'undefined' && (performance as any).memory 
                  ? `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB used`
                  : 'N/A'}
                </div>
                <div>Online: {typeof navigator !== 'undefined' ? (navigator.onLine ? 'Yes' : 'No') : 'Unknown'}</div>
                <div>Console Errors: Check browser dev tools</div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-2 bg-gray-800 rounded text-gray-400 text-xs">
              <div className="font-bold text-yellow-400 mb-1">Usage:</div>
              <div>• Press Ctrl+D (or Cmd+D) to toggle</div>
              <div>• Use debug() function in your code</div>
              <div>• Check Network tab for API calls</div>
              <div>• Look for console errors in dev tools</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}