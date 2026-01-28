'use client'
import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { getMaintainedProjects, ProjectInterface, deleteProject } from '@/lib/api/project-owner/projects'
import { showToast } from '@/lib/utils/toast'
import Loader from '@/components/ui/loader'
import ConfirmDeleteModal from '../../common/modals/confirmDelete'
import { MaintainerProjectCard } from './modals/projectCard'

function ProjectsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(true)
    const [deleteLoading, setDeleteLoading] = useState(false)
    
    // Data states
    const [projectToDelete, setProjectToDelete] = useState<{ id: string, title: string } | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [projects, setProjects] = useState<ProjectInterface[]>([])

    // Handle URL parameters for delete actions
    useEffect(() => {
        const deleteId = searchParams.get('delete')
        
        if (deleteId && projects.length > 0) {
            const project = projects.find(p => p.id === deleteId)
            if (project) {
                setProjectToDelete({ id: project.id, title: project.title })
                setShowDeleteModal(true)
            }
        }
    }, [searchParams, projects])

    // Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true)
                const response = await getMaintainedProjects()
                setProjects(response || [])
            } catch (error) {
                console.error('Error fetching maintained projects:', error)
                showToast.error('Failed to load projects')
            } finally {
                setIsLoading(false)
            }
        }
        fetchProjects()
    }, [])

    const handleCreateProject = () => {
        router.push('/maintainer/projects/create')
    }

    const handleEdit = (project: ProjectInterface) => {
        router.push(`/maintainer/projects/edit/${project.id}`)
    }

    const handleDeleteProject = async (id: string, title: string) => {
        // Set project to delete and show modal
        setProjectToDelete({ id, title });
        setShowDeleteModal(true);
    };

    const confirmDeleteProject = async () => {
        if (!projectToDelete) return

        setDeleteLoading(true)
        const loadingToast = showToast.loading('Deleting project...')

        try {
            await deleteProject(projectToDelete.id)
            showToast.dismiss(loadingToast)
            showToast.success(`Project "${projectToDelete.title}" deleted successfully!`)
            
            // Remove project from list and close modal
            setProjects(prev => prev.filter(p => p.id !== projectToDelete.id))
            setShowDeleteModal(false)
            setProjectToDelete(null)
            // Clear URL parameters
            router.replace('/maintainer/projects')
        } catch (error: unknown) {
            showToast.dismiss(loadingToast)
            showToast.error('Failed to delete project. Please try again.')
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleViewDetails = (id: string) => {
       router.push(`/maintainer/project-details/${id}?from=projects`)
    }

    // Show loader while loading
    if (isLoading) {
        return <Loader />
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
                            onClick={handleCreateProject}
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
                                    <MaintainerProjectCard
                                        {...project}
                                        onViewDetails={handleViewDetails}
                                        onEdit={handleEdit}
                                        onDelete={handleDeleteProject}
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
                                onClick={handleCreateProject}
                                className="bg-[#A33C13] hover:bg-[#8a2f0f] text-white px-6 py-3 rounded-lg transition-colors"
                            >
                                Create Your First Project
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => {
                    if (!deleteLoading) {
                        setShowDeleteModal(false)
                        setProjectToDelete(null)
                        // Clear URL parameters
                        router.replace('/maintainer/projects')
                    }
                }}
                onConfirm={confirmDeleteProject}
                projectName={projectToDelete?.title || ''}
                loading={deleteLoading}
            />
        </div>
    )
}

export default ProjectsPage
