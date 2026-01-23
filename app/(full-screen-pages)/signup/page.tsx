import SignUpPage from '@/components/auth/signup'
import AuthWrapper from '@/components/auth/AuthWrapper'
import React from 'react'

function page() {
  return (
    <AuthWrapper authRoute={true}>
      <SignUpPage />
    </AuthWrapper>
  )
}

export default page