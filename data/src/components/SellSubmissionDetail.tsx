import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User, Mail, Phone, Calendar, Car, FileText, Clock, CheckCircle, XCircle, MessageSquare, ArrowLeft, DollarSign } from './Icons'
import { fetchData, updateField } from '../lib/api'
import { slideIn, slideOut } from '../lib/animations'

interface SellSubmission {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  make: string
  model: string
  year: string
  mileage: string
  vin: string
  notes: string | null
  sellOption: string
  existingCustomer: boolean
  newsletter: boolean
  status: string
  createdAt: string
  updatedAt: string
}

interface SellSubmissionDetailProps {
  submissionId: string
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'contacted', label: 'Contacted', color: 'blue' },
  { value: 'evaluating', label: 'Evaluating', color: 'purple' },
  { value: 'offer-made', label: 'Offer Made', color: 'orange' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
]

const sellOptionLabels: Record<string, { label: string; icon: string }> = {
  'sell': { label: 'Outright Sale', icon: '💰' },
  'consign': { label: 'Consignment', icon: '🤝' },
  'auction': { label: 'Auction', icon: '🔨' },
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

function getStatusColor(status: string): string {
  const option = statusOptions.find(s => s.value === status)
  return option?.color || 'zinc'
}

export function SellSubmissionDetail({ submissionId }: SellSubmissionDetailProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [submission, setSubmission] = useState<SellSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [internalNotes, setInternalNotes] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  
  const viewMode = location.state?.viewMode || 'table'

  const loadSubmission = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchData<SellSubmission>(`/sell-submissions/${submissionId}`)
      setSubmission(data)
      setInternalNotes(data.notes || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submission')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubmission()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId])
  
  useEffect(() => {
    if (!loading && contentRef.current) {
      slideIn(contentRef.current)
    }
  }, [loading])
  
  const handleBack = () => {
    if (contentRef.current) {
      slideOut(contentRef.current, {
        onComplete: () => navigate(-1)
      })
    } else {
      navigate(-1)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!submission) return
    
    setUpdating(true)
    try {
      await updateField('/sell-submissions', submission.id, 'status', newStatus)
      setSubmission({ ...submission, status: newStatus, updatedAt: new Date().toISOString() })
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setUpdating(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!submission) return
    
    setUpdating(true)
    try {
      await updateField('/sell-submissions', submission.id, 'notes', internalNotes)
      setSubmission({ ...submission, notes: internalNotes, updatedAt: new Date().toISOString() })
    } catch (err) {
      console.error('Failed to save notes:', err)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <>
        <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-semibold text-white">Sell Submission</h2>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-zinc-600 border-t-red-500 rounded-full" />
          </div>
        </main>
      </>
    )
  }

  if (error || !submission) {
    return (
      <>
        <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-semibold text-white">Sell Submission</h2>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8 max-w-md">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <XCircle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Error</h3>
            </div>
            <p className="text-zinc-400 mb-6">{error || 'Submission not found'}</p>
            <button
              onClick={handleBack}
              className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </main>
      </>
    )
  }

  const statusColor = getStatusColor(submission.status)
  const timeSinceCreated = Math.floor((Date.now() - new Date(submission.createdAt).getTime()) / (1000 * 60 * 60))
  const sellOptionInfo = sellOptionLabels[submission.sellOption] || { label: submission.sellOption, icon: '📋' }

  return (
    <>
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Sell/Consign Submission</h2>
              <p className="text-sm text-zinc-500 mt-1">ID: {submission.id}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8" ref={contentRef}>
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {viewMode === 'kanban' ? 'Board' : 'List'}</span>
        </button>

        {/* Main Content */}
        <div className="bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Left Column - Customer & Vehicle Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Status & Type */}
                <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Status & Type</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{timeSinceCreated}h ago</span>
                    </div>
                  </div>
                  
                  {/* Sell Option Badge */}
                  <div className="mb-4 pb-4 border-b border-zinc-800">
                    <label className="text-xs text-zinc-500 uppercase tracking-wide block mb-2">Submission Type</label>
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                      submission.sellOption === 'sell' ? 'bg-blue-500/20 text-blue-400' :
                      submission.sellOption === 'consign' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      <span>{sellOptionInfo.icon}</span>
                      {sellOptionInfo.label}
                    </span>
                  </div>
                  
                  {/* Status Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        disabled={updating || submission.status === option.value}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          submission.status === option.value
                            ? `bg-${option.color}-500/20 text-${option.color}-400 ring-2 ring-${option.color}-500/30`
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Submitted</span>
                      <span className="text-zinc-400">{formatDate(submission.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-zinc-500">Last Updated</span>
                      <span className="text-zinc-400">{formatDate(submission.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Customer Information</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-zinc-500 uppercase tracking-wide">Name</label>
                      <p className="text-white font-medium mt-1">{submission.firstName} {submission.lastName}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                          <Mail className="w-3 h-3" />
                          Email
                        </label>
                        <a
                          href={`mailto:${submission.email}`}
                          className="text-blue-400 hover:text-blue-300 font-medium mt-1 block break-all"
                        >
                          {submission.email}
                        </a>
                      </div>
                      
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                          <Phone className="w-3 h-3" />
                          Phone
                        </label>
                        <a
                          href={`tel:${submission.phone}`}
                          className="text-blue-400 hover:text-blue-300 font-medium mt-1 block"
                        >
                          {submission.phone}
                        </a>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-2">
                      {submission.existingCustomer && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Existing Customer
                        </span>
                      )}
                      {submission.newsletter && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">
                          📧 Newsletter Subscriber
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Car className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Vehicle Information</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-zinc-500 uppercase tracking-wide">Vehicle</label>
                      <p className="text-white font-medium text-lg mt-1">
                        {submission.year} {submission.make} {submission.model}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-wide">Mileage</label>
                        <p className="text-zinc-300 font-medium mt-1">{submission.mileage.toLocaleString()} miles</p>
                      </div>
                      
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-wide">VIN</label>
                        <p className="text-zinc-300 font-mono text-sm mt-1">{submission.vin}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Notes */}
                {submission.notes && (
                  <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4 text-zinc-500" />
                      <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Customer Notes</h3>
                    </div>
                    
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {submission.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Actions & Notes */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-5">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Quick Actions</h3>
                  
                  <div className="space-y-2">
                    <a
                      href={`mailto:${submission.email}?subject=Re: ${sellOptionInfo.label} Inquiry - ${submission.year} ${submission.make} ${submission.model}`}
                      className="flex items-center gap-2 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Send Email
                    </a>
                    
                    <a
                      href={`tel:${submission.phone}`}
                      className="flex items-center gap-2 w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call Customer
                    </a>
                    
                    <button
                      onClick={() => {
                        const text = `Sell/Consign Submission Details\n\nType: ${sellOptionInfo.label}\nCustomer: ${submission.firstName} ${submission.lastName}\nEmail: ${submission.email}\nPhone: ${submission.phone}\nVehicle: ${submission.year} ${submission.make} ${submission.model}\nMileage: ${submission.mileage}\nVIN: ${submission.vin}\n\nNotes:\n${submission.notes || 'None'}`
                        navigator.clipboard.writeText(text)
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Copy Details
                    </button>

                    <a
                      href={`https://www.carfax.com/VIN/${submission.vin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Car className="w-4 h-4" />
                      View CARFAX
                    </a>
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Internal Notes</h3>
                  </div>
                  
                  <textarea
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Add internal notes about this submission..."
                    className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                  />
                  
                  <button
                    onClick={handleSaveNotes}
                    disabled={updating}
                    className="mt-3 w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                  >
                    {updating ? 'Saving...' : 'Save Notes'}
                  </button>
                  
                  <p className="text-xs text-zinc-600 mt-3">
                    Notes are for internal use only and not visible to customers.
                  </p>
                </div>

                {/* Workflow Timeline */}
                <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Timeline</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <div className="w-px h-full bg-zinc-800 mt-1" />
                      </div>
                      <div className="flex-1 pb-3">
                        <p className="text-sm text-white font-medium">Submission Received</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{formatDate(submission.createdAt)}</p>
                        <p className="text-xs text-zinc-400 mt-1">
                          {sellOptionInfo.icon} {sellOptionInfo.label}
                        </p>
                      </div>
                    </div>
                    
                    {submission.updatedAt !== submission.createdAt && (
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full bg-${statusColor}-500`} />
                          <div className="w-px h-full bg-zinc-800 mt-1" />
                        </div>
                        <div className="flex-1 pb-3">
                          <p className="text-sm text-white font-medium">Status Updated</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{formatDate(submission.updatedAt)}</p>
                          <p className="text-xs text-zinc-400 mt-1">
                            Changed to <span className="font-medium">{statusOptions.find(s => s.value === submission.status)?.label}</span>
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-zinc-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-zinc-500">Awaiting next action...</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Valuation Estimate */}
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Next Steps</h3>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">1.</span>
                      <span>Review vehicle history report</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">2.</span>
                      <span>Schedule inspection if needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">3.</span>
                      <span>Prepare valuation estimate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">4.</span>
                      <span>Contact customer with offer</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
      </main>
    </>
  )
}
