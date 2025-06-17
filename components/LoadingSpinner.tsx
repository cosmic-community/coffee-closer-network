interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'medium', 
  color = 'coffee-600',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  return (
    <div className={`animate-spin rounded-full border-b-2 border-${color} ${sizeClasses[size]} ${className}`}></div>
  )
}