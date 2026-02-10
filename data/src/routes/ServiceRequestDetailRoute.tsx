import { useParams } from 'react-router-dom'
import { ServiceRequestDetail } from '../components/ServiceRequestDetail'

export function ServiceRequestDetailRoute() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <div>Invalid request ID</div>
  }

  return <ServiceRequestDetail requestId={id} />
}
