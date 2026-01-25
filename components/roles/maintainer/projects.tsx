'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { aclonica } from '@/app/layout'
import MaintainerCreateProject from './createProject'
import ProjectDetailPage from './ProjectDetailPage'
import { createProject } from '@/lib/api/projects/create'
import { getProjects, ProjectResponse } from '@/lib/api/project-owner/projects'
import { CreateProjectFormData } from '@/lib/schemas/project'
import { showToast } from '@/lib/utils/toast'
import Loader from '@/components/ui/loader'

interface ProjectCardProps {
    id: number
    title: string
    description: string
    technology_stack: string
    category: string
    status: string
    testing_url: string
    created_at: string
    maintainer: {
        id: number
        email: string
        fullname: string
        role: string
        bio: string
        avatar: string | null
        github_url: string
        linkedin_url: string
    }
    onViewDetails: (id: number) => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    id,
    title,
    description,
    technology_stack,
    category,
    status,
    testing_url,
    created_at,
    maintainer,
    onViewDetails,
}) => {
    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    const handleViewDetails = () => {
        onViewDetails(id)
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-[#A33C13]/30 hover:border-[#A33C13] transition-colors"
        >
            {/* Header with title and status */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{title}</h3>
                    <p className="text-xs text-gray-600">{formatDate(created_at)} • by {maintainer.fullname}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    status === 'active' ? 'bg-green-500/20 text-green-400' :
                    status === 'inactive' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                }`}>
                    {status.toUpperCase()}
                </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-3 text-sm line-clamp-2">{description}</p>

            {/* Tech and Category - inline */}
            <div className="flex items-center gap-4 mb-3 text-xs">
                <div className="flex items-center gap-1">
                    <span className="text-[#A33C13] font-medium">Tech:</span>
                    <span className="text-gray-700 truncate">{technology_stack}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-[#A33C13] font-medium">Type:</span>
                    <span className="text-gray-700 capitalize">{category}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button 
                    onClick={handleViewDetails}
                    className="flex-1 bg-[#A33C13] text-white py-2 px-3 rounded hover:bg-[#8a2f0f] transition-colors text-sm"
                >
                    View Details
                </button>
                <button 
                    onClick={() => window.open(testing_url, '_blank')}
                    className="bg-gray-600 text-white py-2 px-3 rounded hover:bg-gray-700 transition-colors text-sm"
                >
                    Test
                </button>
            </div>
        </motion.div>
    )
}

function ProjectsPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [createLoading, setCreateLoading] = useState(false)
    const [currentView, setCurrentView] = useState<'list' | 'create' | 'details'>('list')
    const [selectedProject, setSelectedProject] = useState<number | null>(null)
    const [projects, setProjects] = useState<ProjectResponse[]>([])

    // Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true)
                const data = await getProjects()
                setProjects(data)
            } catch (error) {
                console.error('Error fetching projects:', error)
                showToast.error('Failed to load projects')
            } finally {
                setIsLoading(false)
            }
        }

        if (currentView === 'list') {
            fetchProjects()
        }
    }, [currentView])

    const handleCreateProject = async (data: CreateProjectFormData) => {
        setCreateLoading(true);

        const loadingToast = showToast.loading('Creating project...');

        try {
            const response = await createProject(data);

            showToast.dismiss(loadingToast);
            showToast.success(`Project "${response.title}" created successfully!`);

            // Refresh projects list and switch to list view
            setCurrentView('list');

        } catch (error: unknown) {
            showToast.dismiss(loadingToast);

            let errorMessage = 'Failed to create project. Please try again.';

            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number; data?: Record<string, unknown> } };

                if (axiosError.response?.status === 400) {
                    const errorData = axiosError.response.data;
                    if (typeof errorData === 'object' && errorData !== null) {
                        const firstError = Object.values(errorData)[0];
                        if (Array.isArray(firstError)) {
                            errorMessage = firstError[0];
                        } else if (typeof firstError === 'string') {
                            errorMessage = firstError;
                        }
                    }
                } else if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
                    errorMessage = String(axiosError.response.data.message);
                }
            }

            showToast.error(errorMessage);
        } finally {
            setCreateLoading(false);
        }
    };

    // Show loader while loading
    if (isLoading) {
        return <Loader />
    }

    // Show create project view
    if (currentView === 'create') {
        return (
            <MaintainerCreateProject
                onBack={() => setCurrentView('list')}
                onSubmit={handleCreateProject}
                loading={createLoading}
            />
        )
    }

    // Show project details view
    if (currentView === 'details' && selectedProject) {
        const projectData = projects.find(p => p.id === selectedProject)
        return (
            <ProjectDetailPage 
                projectId={selectedProject.toString()}
                projectData={projectData}
                onBack={() => {
                    setCurrentView('list')
                    setSelectedProject(null)
                }}
            />
        )
    }

    // Show projects list view
    return (
        <div className="min-h-screen bg-[#FFFCFB]">
            <div className="p-4 sm:p-6 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-2">
                                My Projects
                            </h1>
                            <p className="text-sm sm:text-base text-[#171717]">Manage your testing projects</p>
                        </div>
                        <button
                            onClick={() => setCurrentView('create')}
                            className="bg-[#A33C13] hover:bg-[#8a2f0f] text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            + Create Project
                        </button>
                    </div>

                    {/* Projects Grid */}
                    {projects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <ProjectCard
                                        {...project}
                                        onViewDetails={(id) => {
                                            setSelectedProject(id)
                                            setCurrentView('details')
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
                            <p className="text-gray-600 mb-4">Create your first project to get started with testing.</p>
                            <button
                                onClick={() => setCurrentView('create')}
                                className="bg-[#A33C13] hover:bg-[#8a2f0f] text-white px-6 py-3 rounded-lg transition-colors"
                            >
                                Create Your First Project
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default ProjectsPage
