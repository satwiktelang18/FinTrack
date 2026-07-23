import ReactDatePicker from 'react-datepicker'
import { Calendar } from 'lucide-react'
import 'react-datepicker/dist/react-datepicker.css'

export default function DatePicker({ value, onChange, borderColor = 'purple' }) {
  const selectedDate = value ? new Date(value + 'T00:00:00') : null

  const handleChange = (date) => {
    if (!date) return onChange('')
    const iso = date.toISOString().split('T')[0]
    onChange(iso)
  }

  return (
    <div className="relative">
      <ReactDatePicker
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="Select date"
        className={`w-full bg-bg border border-border rounded-lg pl-4 pr-10 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-${borderColor} transition`}
        calendarClassName="dark-datepicker"
        wrapperClassName="w-full"
        withPortal
      />
      <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
    </div>
  )
}