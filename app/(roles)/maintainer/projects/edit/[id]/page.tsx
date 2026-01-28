'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { updateProject, getProject } from '@/lib/api/project-owner/projects'
import { CreateProjectFormData } from '@/lib/schemas/project'
import toast from 'react-hot-toast';
import MaintainerCreateProject from '@/components/roles/maintainer/projects/modals/createProject'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditProjectPage({ params }: PageProps) {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)
    const [fetchLoading, setFetchLoading] = React.useState(true)
    const [projectData, setProjectData] = React.useState<CreateProjectFormData | null>(null)
    const [projectId, setProjectId] = React.useState<string>('')

    React.useEffect(() => {
        const fetchProject = async () => {
            try {
                const { id } = await params
                setProjectId(id)
                const project = await getProject(id)
                setProjectData({
                    title: project.title,
                    description: project.description,
                    technology_stack: project.technology_stack,
                    testing_url: project.testing_url,
                    category: project.category as 'web' | 'mobile' | 'api' | 'desktop',
                    status: project.status as 'active' | 'inactive' | 'completed',
                    instructions: project.instructions || ['']
                })
            } catch (error: any) {
                console.error('Error fetching project:', error)
                toast.error('Failed to load project data')
                router.push('/maintainer/projects')
            } finally {
                setFetchLoading(false)
            }
        }

        fetchProject()
    }, [params, router])

    const handleUpdateProject = async (data: CreateProjectFormData) => {
        try {
            setLoading(true)
            await updateProject(projectId, data)
            toast.success('Project updated successfully!')
            router.push('/maintainer/projects')
        } catch (error: any) {
            console.error('Error updating project:', error)
            toast.error(error?.response?.data?.message || 'Failed to update project. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A33C13]"></div>
            </div>
        )
    }

    return (
        <MaintainerCreateProject
            onSubmit={handleUpdateProject}
            loading={loading}
            initialData={projectData || undefined}
            isEdit={true}
            onBack={() => router.push('/maintainer/projects')}
        />
    )
}