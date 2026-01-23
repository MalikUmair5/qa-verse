import React from 'react'
import Dashboard from '@/components/roles/tester/dashboard'
import AuthWrapper from '@/components/auth/AuthWrapper'

function Page() {
  return (
    <AuthWrapper protectedRoute={true} requiredRole="tester">
      <Dashboard />
    </AuthWrapper>
  )
}

export default Page