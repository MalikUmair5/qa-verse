'use client'
import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { aclonica } from '@/app/layout'
import MaintainerCreateProject from './createProject'
import ProjectDetailPage from './ProjectDetailPage'
import { createProject } from '@/lib/api/projects/create'
import { getProjects, ProjectResponse, updateProject, deleteProject, ProjectPayload } from '@/lib/api/project-owner/projects'
import { CreateProjectFormData } from '@/lib/schemas/project'
import { showToast } from '@/lib/utils/toast'
import Loader from '@/components/ui/loader'
import ConfirmDeleteModal from '../common/modals/confirmDelete'
import { FiArrowRight, FiCalendar, FiCode, FiEdit2, FiLayers, FiTrash2, FiUser } from 'react-icons/fi'

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
    onEdit: (project: ProjectResponse) => void
    onDelete: (id: number, title: string) => void
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
    onEdit,
    onDelete,
}) => {
    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'inactive': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const handleViewDetails = () => {
        onViewDetails(id)
    }

    const handleEdit = () => {
        onEdit({
            id,
            title,
            description,
            technology_stack,
            category,
            status,
            testing_url,
            created_at,
            maintainer,
            updated_at: created_at // Use created_at as fallback for updated_at
        })
    }

    const handleDelete = () => {
        onDelete(id, title)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#A33C13]/30 transition-all duration-300 flex flex-col h-full"
        >
            {/* Top Right Action Icons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit"
                >
                    <FiEdit2 size={16} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                >
                    <FiTrash2 size={16} />
                </button>
            </div>

            {/* Header Section */}
            <div className="mb-4 pr-16"> {/* pr-16 prevents title overlapping icons */}
                <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(status)}`}>
                        {status}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-1 group-hover:text-[#A33C13] transition-colors">
                    {title}
                </h3>
            </div>

            {/* Meta Data (Date & Maintainer) */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                    <FiCalendar className="text-gray-400" />
                    <span>{formatDate(created_at)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <FiUser className="text-gray-400" />
                    <span className="truncate max-w-[100px]">{maintainer.fullname}</span>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                {description}
            </p>

            {/* Tags Section */}
            <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs">
                    <FiCode className="text-[#A33C13]" />
                    <span className="font-semibold text-gray-700">Tech:</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] truncate max-w-[180px]">
                        {technology_stack}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <FiLayers className="text-[#A33C13]" />
                    <span className="font-semibold text-gray-700">Type:</span>
                    <span className="text-gray-600 capitalize">
                        {category}
                    </span>
                </div>
            </div>

            {/* Footer Action */}
            <button
                onClick={handleViewDetails}
                className="w-full mt-auto flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 px-4 rounded-lg hover:bg-[#A33C13] active:scale-95 transition-all duration-200 text-sm font-medium"
            >
                View Details
                <FiArrowRight />
            </button>
        </motion.div>
    )
}

function ProjectsPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [createLoading, setCreateLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [projectToDelete, setProjectToDelete] = useState<{ id: number, title: string } | null>(null)
    const [currentView, setCurrentView] = useState<'list' | 'create' | 'details' | 'edit'>('list')
    const [selectedProject, setSelectedProject] = useState<number | null>(null)
    const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null)
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

    const handleUpdateProject = async (data: CreateProjectFormData) => {
        if (!editingProject) return;

        setUpdateLoading(true);
        const loadingToast = showToast.loading('Updating project...');

        try {
            const response = await updateProject(editingProject.id, data);

            showToast.dismiss(loadingToast);
            showToast.success(`Project "${response.title}" updated successfully!`);

            // Update the project in the projects list
            setProjects(prev => prev.map(p => p.id === editingProject.id ? response : p));

            // Switch back to list view
            setCurrentView('list');
            setEditingProject(null);

        } catch (error: unknown) {
            showToast.dismiss(loadingToast);

            let errorMessage = 'Failed to update project. Please try again.';

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
            setUpdateLoading(false);
        }
    };

    const handleDeleteProject = async (id: number, title: string) => {
        // Set project to delete and show modal
        setProjectToDelete({ id, title });
        setShowDeleteModal(true);
    };

    const confirmDeleteProject = async () => {
        if (!projectToDelete) return;

        setDeleteLoading(true);
        const loadingToast = showToast.loading('Deleting project...');

        try {
            await deleteProject(projectToDelete.id);

            showToast.dismiss(loadingToast);
            showToast.success(`Project "${projectToDelete.title}" deleted successfully!`);

            // Remove the project from the projects list
            setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));

            // Close modal and reset state
            setShowDeleteModal(false);
            setProjectToDelete(null);

        } catch (error: unknown) {
            showToast.dismiss(loadingToast);

            let errorMessage = 'Failed to delete project. Please try again.';

            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number; data?: Record<string, unknown> } };

                if (axiosError.response?.status === 404) {
                    errorMessage = 'Project not found or already deleted.';
                } else if (axiosError.response?.status === 403) {
                    errorMessage = 'You do not have permission to delete this project.';
                } else if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
                    errorMessage = String(axiosError.response.data.message);
                }
            }

            showToast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCloseDeleteModal = () => {
        if (!deleteLoading) {
            setShowDeleteModal(false);
            setProjectToDelete(null);
        }
    };

    // Show loader while loading
    if (isLoading) {
        return <Loader />
    }

    const handleEdit = (project: ProjectResponse) => {
        setEditingProject(project);
        setCurrentView('edit');
    };

    // Show create project view
    if (currentView === 'create') {
        return (
            <AnimatePresence>
                <MaintainerCreateProject
                    onBack={() => setCurrentView('list')}
                    onSubmit={handleCreateProject}
                    loading={createLoading}
                />
            </AnimatePresence>
        )
    }

    // Show edit project view
    if (currentView === 'edit' && editingProject) {
        return (
            <MaintainerCreateProject
                onBack={() => {
                    setCurrentView('list')
                    setEditingProject(null)
                }}
                onSubmit={handleUpdateProject}
                loading={updateLoading}
                initialData={{
                    title: editingProject.title,
                    description: editingProject.description,
                    technology_stack: editingProject.technology_stack,
                    testing_url: editingProject.testing_url,
                    category: editingProject.category as 'web' | 'mobile' | 'api' | 'desktop',
                    status: editingProject.status as 'active' | 'inactive' | 'completed'
                }}
                isEdit={true}
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
                                onClick={() => setCurrentView('create')}
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
                onClose={handleCloseDeleteModal}
                onConfirm={confirmDeleteProject}
                projectName={projectToDelete?.title || ''}
                loading={deleteLoading}
            />
        </div>
    )
}

export default ProjectsPage
