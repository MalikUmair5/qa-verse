import { Suspense } from 'react'
import ReportBugPage from '@/components/roles/tester/ReportBugPage'
import Loader from '@/components/ui/loader'

export default function ReportBugRoute() {
  return (
    <Suspense fallback={<Loader />}>
      <ReportBugPage />
    </Suspense>
  )
}
