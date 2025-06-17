interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'small' | 'medium' | 'large'
  hover?: boolean
}

export default function Card({ 
  children, 
  className = '', 
  padding = 'medium',
  hover = false
}: CardProps) {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  }

  const baseClasses = 'bg-white rounded-xl shadow-sm border border-neutral-200'
  const hoverClasses = hover ? 'hover:shadow-md hover:border-neutral-300 transition-all duration-200' : ''

  return (
    <div className={`${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  )
}