'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { aclonica } from '@/app/layout';
import ThemeButton from '@/components/ui/button';
import { createProject } from '@/lib/api/projects/create';
import { createProjectSchema, CreateProjectFormData } from '@/lib/schemas/project';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function MaintainerCreateProject() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      technology_stack: '',
      testing_url: '',
      category: 'web',
      status: 'active'
    }
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    setLoading(true);
    
    const loadingToast = toast.loading('Creating project...', {
      style: {
        background: '#2d1810',
        color: '#ffffff',
        border: '1px solid #A33C13',
      },
    });

    try {
      const response = await createProject(data);
      
      toast.dismiss(loadingToast);
      
      toast.success(`Project "${response.title}" created successfully!`, {
        duration: 4000,
        style: {
          background: '#1f4a2d',
          color: '#ffffff',
          border: '1px solid #22c55e',
        },
        iconTheme: {
          primary: '#22c55e',
          secondary: '#ffffff',
        },
      });

      reset();
      
      setTimeout(() => {
        router.push('/maintainer/projects');
      }, 1000);
      
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      
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

      toast.error(errorMessage, {
        duration: 5000,
        style: {
          background: '#4a1f1f',
          color: '#ffffff',
          border: '1px solid #ef4444',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#ffffff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold text-white mb-2 ${aclonica.className}`}>
            Create New Project
          </h1>
          <p className="text-gray-300">Add a new project for testing</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#A33C13]/30"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white font-medium mb-2">Project Title *</label>
              <input
                {...register('title')}
                type="text"
                placeholder="Enter project title"
                className={`w-full p-3 bg-transparent border-2 rounded-md outline-none transition-colors ${
                  errors.title 
                    ? 'border-red-500 focus:border-red-400' 
                    : dirtyFields.title && !errors.title
                    ? 'border-green-500 focus:border-green-400'
                    : 'border-white/30 focus:border-[#A33C13]'
                } text-white placeholder-gray-400`}
              />
              {errors.title && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.title.message}
                </motion.p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-medium mb-2">Description *</label>
              <textarea
                {...register('description')}
                placeholder="Describe your project..."
                rows={4}
                className={`w-full p-3 bg-transparent border-2 rounded-md outline-none transition-colors resize-none ${
                  errors.description 
                    ? 'border-red-500 focus:border-red-400' 
                    : dirtyFields.description && !errors.description
                    ? 'border-green-500 focus:border-green-400'
                    : 'border-white/30 focus:border-[#A33C13]'
                } text-white placeholder-gray-400`}
              />
              {errors.description && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.description.message}
                </motion.p>
              )}
            </div>

            {/* Technology Stack */}
            <div>
              <label className="block text-white font-medium mb-2">Technology Stack *</label>
              <input
                {...register('technology_stack')}
                type="text"
                placeholder="e.g., React, Node.js, MongoDB"
                className={`w-full p-3 bg-transparent border-2 rounded-md outline-none transition-colors ${
                  errors.technology_stack 
                    ? 'border-red-500 focus:border-red-400' 
                    : dirtyFields.technology_stack && !errors.technology_stack
                    ? 'border-green-500 focus:border-green-400'
                    : 'border-white/30 focus:border-[#A33C13]'
                } text-white placeholder-gray-400`}
              />
              {errors.technology_stack && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.technology_stack.message}
                </motion.p>
              )}
            </div>

            {/* Testing URL */}
            <div>
              <label className="block text-white font-medium mb-2">Testing URL *</label>
              <input
                {...register('testing_url')}
                type="url"
                placeholder="https://your-project-url.com"
                className={`w-full p-3 bg-transparent border-2 rounded-md outline-none transition-colors ${
                  errors.testing_url 
                    ? 'border-red-500 focus:border-red-400' 
                    : dirtyFields.testing_url && !errors.testing_url
                    ? 'border-green-500 focus:border-green-400'
                    : 'border-white/30 focus:border-[#A33C13]'
                } text-white placeholder-gray-400`}
              />
              {errors.testing_url && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.testing_url.message}
                </motion.p>
              )}
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Category *</label>
                <select
                  {...register('category')}
                  className={`w-full p-3 bg-gray-800 border-2 rounded-md outline-none transition-colors ${
                    errors.category 
                      ? 'border-red-500 focus:border-red-400' 
                      : 'border-white/30 focus:border-[#A33C13]'
                  } text-white`}
                >
                  <option value="web">Web Application</option>
                  <option value="mobile">Mobile Application</option>
                  <option value="api">API/Backend</option>
                  <option value="desktop">Desktop Application</option>
                </select>
                {errors.category && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.category.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Status *</label>
                <select
                  {...register('status')}
                  className={`w-full p-3 bg-gray-800 border-2 rounded-md outline-none transition-colors ${
                    errors.status 
                      ? 'border-red-500 focus:border-red-400' 
                      : 'border-white/30 focus:border-[#A33C13]'
                  } text-white`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Completed</option>
                </select>
                {errors.status && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.status.message}
                  </motion.p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <ThemeButton
                variant="primary"
                type="submit"
                disabled={loading || !isValid}
                className={`flex-1 ${loading || !isValid ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Project'
                )}
              </ThemeButton>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}