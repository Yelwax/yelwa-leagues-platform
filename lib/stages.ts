export const stages = [
  { id: 'brochure_requested', label: 'Brochure requested' },
  { id: 'intake_submitted', label: 'Intake submitted' },
  { id: 'interview_scheduled', label: 'Interview scheduled' },
  { id: 'interview_done', label: 'Interview done' },
  { id: 'price_list_sent', label: 'Price list sent' },
  { id: 'payment_confirmed', label: 'Payment confirmed' },
  { id: 'active', label: 'Active student' },
]
export const stageLabel = (id?: string | null) => stages.find((s) => s.id === id)?.label ?? 'Unknown'
