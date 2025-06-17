interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select'
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  error?: string
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  rows?: number
  className?: string
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  options,
  rows = 3,
  className = ''
}: FormFieldProps) {
  const baseInputClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
    error ? 'border-red-300' : 'border-neutral-300'
  }`

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            rows={rows}
            className={baseInputClasses}
          />
        )
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={baseInputClasses}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className={baseInputClasses}
          />
        )
    }
  }

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}