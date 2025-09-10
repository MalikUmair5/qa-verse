'use client'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '@/components/ui/projectCard'
import { useProjects } from '@/hooks/useProjects'
import { useLoading } from '../../layout'

export default function ProfilePage() {
  const { projects, isLoading: projectsLoading, fetchProjects, joinProject, reportBug } = useProjects();
  const { setIsLoading } = useLoading();

  // Fetch projects on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchProjects();
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchProjects, setIsLoading]);

  const handleViewProject = async (projectId: string) => {
    console.log(`Viewing project: ${projectId}`);
    // Add navigation logic here
  };

  const handleJoinProject = async (projectId: string) => {
    setIsLoading(true);
    const result = await joinProject(projectId);
    setIsLoading(false);
    
    if (result.success) {
      console.log(result.message);
      // Show success toast/notification
    } else {
      console.error(result.message);
      // Show error toast/notification
    }
  };

  const handleRefreshProjects = async () => {
    setIsLoading(true);
    await fetchProjects();
    setIsLoading(false);
  };

  return (
    <div className="flex-1 p-8 bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Available Projects</h1>
            <p className="text-muted">Discover and participate in testing projects that match your skills</p>
          </div>
          
          {/* Refresh Button */}
          <motion.button
            onClick={handleRefreshProjects}
            className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={projectsLoading}
          >
            <motion.span
              animate={{ rotate: projectsLoading ? 360 : 0 }}
              transition={{ duration: 1, repeat: projectsLoading ? Infinity : 0 }}
            >
              🔄
            </motion.span>
            <span>Refresh</span>
          </motion.button>
        </div>

        {/* Projects Counter */}
        <motion.div 
          className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{projects.length}</p>
                <p className="text-sm text-muted">Total Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-test-green">
                  {projects.filter(p => p.status === 'active').length}
                </p>
                <p className="text-sm text-muted">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-test-yellow">
                  {projects.filter(p => p.status === 'pending').length}
                </p>
                <p className="text-sm text-muted">Pending</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-muted">Last updated</p>
              <p className="text-sm font-medium text-foreground">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  category={project.category}
                  difficulty={project.difficulty}
                  participants={project.participants}
                  bugs={project.bugs}
                  image={project.image}
                  onView={() => handleViewProject(project.id)}
                  className={project.status === 'completed' ? 'opacity-75' : ''}
                />
                
                {/* Additional action buttons */}
                <motion.div 
                  className="mt-3 flex space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                >
                  {project.status === 'active' && (
                    <motion.button
                      onClick={() => handleJoinProject(project.id)}
                      className="flex-1 bg-test-green text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-test-green/90 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Join Project
                    </motion.button>
                  )}
                  
                  <motion.button
                    className="flex-1 bg-test-yellow text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-test-yellow/90 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Report Bug
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Projects Available</h3>
            <p className="text-muted mb-6">There are no projects to display at the moment.</p>
            <motion.button
              onClick={handleRefreshProjects}
              className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
