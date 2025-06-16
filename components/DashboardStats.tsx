import type { CoffeeChatSession } from '@/types'

interface DashboardStatsProps {
  sessions: CoffeeChatSession[]
}

export default function DashboardStats({ sessions }: DashboardStatsProps) {
  const totalChats = sessions.length
  const completedChats = sessions.filter(session => 
    session.metadata?.status?.key === 'COMPLETED'
  ).length
  const scheduledChats = sessions.filter(session => 
    session.metadata?.status?.key === 'SCHEDULED'
  ).length

  const stats = [
    {
      label: 'Total Chats',
      value: totalChats,
      icon: '☕',
      color: 'bg-coffee-100 text-coffee-700'
    },
    {
      label: 'Completed',
      value: completedChats,
      icon: '✅',
      color: 'bg-green-100 text-green-700'
    },
    {
      label: 'Scheduled',
      value: scheduledChats,
      icon: '📅',
      color: 'bg-blue-100 text-blue-700'
    }
  ]

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6">Your Coffee Chat Stats</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-4 rounded-lg border border-neutral-200">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-neutral-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}