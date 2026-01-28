'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { createProject } from '@/lib/api/project-owner/projects'
import { CreateProjectFormData } from '@/lib/schemas/project'
import toast from 'react-hot-toast';
import MaintainerCreateProject from '@/components/roles/maintainer/projects/modals/createProject'

export default function CreateProjectPage() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)

    const handleCreateProject = async (data: CreateProjectFormData) => {
        try {
            setLoading(true)
            await createProject(data)
            toast.success('Project created successfully!')
            router.push('/maintainer/projects')
        } catch (error: any) {
            console.error('Error creating project:', error)
            toast.error(error?.response?.data?.message || 'Failed to create project. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <MaintainerCreateProject
            onSubmit={handleCreateProject}
            loading={loading}
            onBack={() => router.push('/maintainer/projects')}
        />
    )
}