import { useParams } from 'react-router-dom'
import { SellSubmissionDetail } from '../components/SellSubmissionDetail'

export function SellSubmissionDetailRoute() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <div>Invalid submission ID</div>
  }

  return <SellSubmissionDetail submissionId={id} />
}
