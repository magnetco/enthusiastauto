import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User, Mail, Phone, Calendar, Car, FileText, Clock, CheckCircle, XCircle, MessageSquare, ArrowLeft } from './Icons'
import { fetchData, updateField } from '../lib/api'
import { slideIn, slideOut } from '../lib/animations'

interface ServiceRequest {
  id: string
  serviceType: string
  name: string
  email: string
  phone: string
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  vin: string | null
  description: string
  existingCustomer: boolean
  status: string
  createdAt: string
  updatedAt: string
}

interface ServiceRequestDetailProps {
  requestId: string
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'contacted', label: 'Contacted', color: 'blue' },
  { value: 'scheduled', label: 'Scheduled', color: 'purple' },
  { value: 'in-progress', label: 'In Progress', color: 'orange' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
]

const serviceTypeLabels: Record<string, string> = {
  'maintenance': 'Maintenance & Repair',
  'inspection': 'Pre-Purchase Inspection',
  'restoration': 'Restoration',
  'performance': 'Performance Upgrades',
  'detailing': 'Detailing',
  'storage': 'Storage',
  'other': 'Other Services',
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

export function ServiceRequestDetail({ requestId }: ServiceRequestDetailProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [request, setRequest] = useState<ServiceRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  
  const viewMode = location.state?.viewMode || 'table'

  const loadRequest = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchData<ServiceRequest>(`/service-requests/${requestId}`)
      setRequest(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load request')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId])
  
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
    if (!request) return
    
    setUpdating(true)
    try {
      await updateField('/service-requests', request.id, 'status', newStatus)
      setRequest({ ...request, status: newStatus, updatedAt: new Date().toISOString() })
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setUpdating(false)
    }
  }

  const handleFieldUpdate = async (field: string, value: string) => {
    if (!request) return
    
    setUpdating(true)
    try {
      await updateField('/service-requests', request.id, field, value)
      setRequest({ ...request, [field]: value, updatedAt: new Date().toISOString() })
    } catch (err) {
      console.error('Failed to update field:', err)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <>
        <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-semibold text-white">Service Request</h2>
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

  if (error || !request) {
    return (
      <>
        <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-semibold text-white">Service Request</h2>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8 max-w-md">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <XCircle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Error</h3>
            </div>
            <p className="text-zinc-400 mb-6">{error || 'Request not found'}</p>
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

  const statusColor = getStatusColor(request.status)
  const timeSinceCreated = Math.floor((Date.now() - new Date(request.createdAt).getTime()) / (1000 * 60 * 60))

  return (
    <>
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Service Request</h2>
              <p className="text-sm text-zinc-500 mt-1">ID: {request.id}</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:divide-x divide-zinc-800">
              {/* Left Column - Customer & Vehicle Info */}
              <div className="lg:col-span-2 p-6 space-y-6">
                {/* Status & Timeline */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Status</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{timeSinceCreated}h ago</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        disabled={updating || request.status === option.value}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          request.status === option.value
                            ? `bg-${option.color}-500/20 text-${option.color}-400 ring-2 ring-${option.color}-500/30`
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Created {formatDate(request.createdAt)}</span>
                    <span>Updated {formatDate(request.updatedAt)}</span>
                  </div>
                </div>

                <div className="border-t border-zinc-800/50" />

                {/* Customer Information */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Customer Information</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-zinc-500 uppercase tracking-wide">Name</label>
                      <p className="text-white font-medium">{request.name}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                          <Mail className="w-3 h-3" />
                          Email
                        </label>
                        <a
                          href={`mailto:${request.email}`}
                          className="text-blue-400 hover:text-blue-300 font-medium block"
                        >
                          {request.email}
                        </a>
                      </div>
                      
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                          <Phone className="w-3 h-3" />
                          Phone
                        </label>
                        <a
                          href={`tel:${request.phone}`}
                          className="text-blue-400 hover:text-blue-300 font-medium block"
                        >
                          {request.phone}
                        </a>
                      </div>
                    </div>

                    <div className="pt-1">
                      {request.existingCustomer ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Existing Customer
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs font-medium">
                          New Customer
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-800/50" />

                {/* Vehicle Information */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Car className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Vehicle Information</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-zinc-500 uppercase tracking-wide">Vehicle</label>
                      <p className="text-white font-medium text-lg">
                        {request.vehicleYear} {request.vehicleMake} {request.vehicleModel}
                      </p>
                    </div>
                    
                    {request.vin && (
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-wide">VIN</label>
                        <p className="text-zinc-300 font-mono text-sm">{request.vin}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-zinc-800/50" />

                {/* Service Details */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Service Details</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-zinc-500 uppercase tracking-wide">Service Type</label>
                      <p className="text-white font-medium">
                        {serviceTypeLabels[request.serviceType] || request.serviceType}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-xs text-zinc-500 uppercase tracking-wide">Description</label>
                      <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {request.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Actions & Notes */}
              <div className="p-6 space-y-6">
                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">Quick Actions</h3>
                  
                  <div className="space-y-2">
                    <a
                      href={`mailto:${request.email}?subject=Re: Service Request - ${request.vehicleYear} ${request.vehicleMake} ${request.vehicleModel}`}
                      className="flex items-center gap-2 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Send Email
                    </a>
                    
                    <a
                      href={`tel:${request.phone}`}
                      className="flex items-center gap-2 w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call Customer
                    </a>
                    
                    <button
                      onClick={() => {
                        const text = `Service Request Details\n\nCustomer: ${request.name}\nEmail: ${request.email}\nPhone: ${request.phone}\nVehicle: ${request.vehicleYear} ${request.vehicleMake} ${request.vehicleModel}\nService: ${serviceTypeLabels[request.serviceType] || request.serviceType}\n\nDescription:\n${request.description}`
                        navigator.clipboard.writeText(text)
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Copy Details
                    </button>
                  </div>
                </div>

                <div className="border-t border-zinc-800/50" />

                {/* Internal Notes */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Internal Notes</h3>
                  </div>
                  
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add internal notes about this request..."
                    className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                  />
                  
                  <button
                    onClick={() => {
                      // TODO: Implement notes saving
                      console.log('Save notes:', notes)
                    }}
                    className="mt-3 w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Save Notes
                  </button>
                  
                  <p className="text-xs text-zinc-600 mt-3">
                    Notes are for internal use only and not visible to customers.
                  </p>
                </div>

                <div className="border-t border-zinc-800/50" />

                {/* Workflow Timeline */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
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
                        <p className="text-sm text-white font-medium">Request Submitted</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{formatDate(request.createdAt)}</p>
                      </div>
                    </div>
                    
                    {request.updatedAt !== request.createdAt && (
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full bg-${statusColor}-500`} />
                          <div className="w-px h-full bg-zinc-800 mt-1" />
                        </div>
                        <div className="flex-1 pb-3">
                          <p className="text-sm text-white font-medium">Status Updated</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{formatDate(request.updatedAt)}</p>
                          <p className="text-xs text-zinc-400 mt-1">
                            Changed to <span className="font-medium">{statusOptions.find(s => s.value === request.status)?.label}</span>
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
              </div>
            </div>
          </div>
      </main>
    </>
  )
}
