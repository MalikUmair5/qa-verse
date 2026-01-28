'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import { createProjectSchema, CreateProjectFormData } from '@/lib/schemas/project';
import { useRouter } from 'next/navigation';

interface MaintainerCreateProjectProps {
  onBack?: () => void;
  onSubmit: (data: CreateProjectFormData) => void;
  loading?: boolean;
  initialData?: CreateProjectFormData;
  isEdit?: boolean;
}

export default function MaintainerCreateProject({ 
  onBack, 
  onSubmit, 
  loading = false, 
  initialData, 
  isEdit = false 
}: MaintainerCreateProjectProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset,
    control
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      title: '',
      description: '',
      instructions: [''],
      technology_stack: '',
      testing_url: '',
      category: 'web',
      status: 'active'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'instructions'
  } as any);

  const handleFormSubmit = (data: CreateProjectFormData) => {
    onSubmit(data);
  };

  return (
    <div className="min-h-screen bg-[#FFFCFB]">
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={() => onBack ? onBack() : router.back()}
          className="flex items-center gap-2 text-[#171717] mb-4 sm:mb-6 hover:text-[#A33C13] transition-colors"
          whileHover={{ x: -5 }}
        >
          <FiArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Title */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171717] mb-4">
                {isEdit ? 'Edit Project' : 'Create New Project'}
              </h1>
              <p className="text-[#171717] text-sm sm:text-base lg:text-lg leading-relaxed">
                {isEdit 
                  ? 'Update your project details and settings'
                  : 'Add a new project for testing and collaboration'
                }
              </p>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-[#171717] font-medium mb-2">Project Title *</label>
                  <input
                    {...register('title')}
                    type="text"
                    placeholder="Enter project title"
                    className={`w-full p-3 bg-[#F5F5F5] border-2 rounded-lg outline-none transition-colors ${
                      errors.title 
                        ? 'border-red-500 focus:border-red-400' 
                        : dirtyFields.title && !errors.title
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-gray-300 focus:border-[#A33C13]'
                    } text-[#171717] placeholder-gray-500`}
                  />
                  {errors.title && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.title.message}
                    </motion.p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[#171717] font-medium mb-2">Description *</label>
                  <textarea
                    {...register('description')}
                    placeholder="Describe your project..."
                    rows={4}
                    className={`w-full p-3 bg-[#F5F5F5] border-2 rounded-lg outline-none transition-colors resize-none ${
                      errors.description 
                        ? 'border-red-500 focus:border-red-400' 
                        : dirtyFields.description && !errors.description
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-gray-300 focus:border-[#A33C13]'
                    } text-[#171717] placeholder-gray-500`}
                  />
                  {errors.description && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.description.message}
                    </motion.p>
                  )}
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-[#171717] font-medium mb-2">Testing Instructions *</label>
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <input
                          {...register(`instructions.${index}` as const)}
                          placeholder={`Instruction ${index + 1}`}
                          className={`flex-1 p-3 bg-[#F5F5F5] border-2 rounded-lg outline-none transition-colors ${
                            errors.instructions?.[index] 
                              ? 'border-red-500 focus:border-red-400' 
                              : 'border-gray-300 focus:border-[#A33C13]'
                          } text-[#171717] placeholder-gray-500`}
                        />
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => append('')}
                      className="flex items-center gap-2 text-[#A33C13] hover:text-[#8a2f0f] transition-colors text-sm"
                    >
                      <FiPlus size={16} />
                      Add Instruction
                    </button>
                  </div>
                  {errors.instructions && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.instructions.message || errors.instructions.root?.message}
                    </motion.p>
                  )}
                </div>

                {/* Technology Stack */}
                <div>
                  <label className="block text-[#171717] font-medium mb-2">Technology Stack *</label>
                  <input
                    {...register('technology_stack')}
                    type="text"
                    placeholder="e.g., React, Node.js, MongoDB"
                    className={`w-full p-3 bg-[#F5F5F5] border-2 rounded-lg outline-none transition-colors ${
                      errors.technology_stack 
                        ? 'border-red-500 focus:border-red-400' 
                        : dirtyFields.technology_stack && !errors.technology_stack
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-gray-300 focus:border-[#A33C13]'
                    } text-[#171717] placeholder-gray-500`}
                  />
                  {errors.technology_stack && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.technology_stack.message}
                    </motion.p>
                  )}
                </div>

                {/* Testing URL */}
                <div>
                  <label className="block text-[#171717] font-medium mb-2">Testing URL *</label>
                  <input
                    {...register('testing_url')}
                    type="url"
                    placeholder="https://your-project-url.com"
                    className={`w-full p-3 bg-[#F5F5F5] border-2 rounded-lg outline-none transition-colors ${
                      errors.testing_url 
                        ? 'border-red-500 focus:border-red-400' 
                        : dirtyFields.testing_url && !errors.testing_url
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-gray-300 focus:border-[#A33C13]'
                    } text-[#171717] placeholder-gray-500`}
                  />
                  {errors.testing_url && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.testing_url.message}
                    </motion.p>
                  )}
                </div>

                {/* Category and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#171717] font-medium mb-2">Category *</label>
                    <select
                      {...register('category')}
                      className={`w-full p-3 bg-[#F5F5F5] border-2 rounded-lg outline-none transition-colors ${
                        errors.category 
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-gray-300 focus:border-[#A33C13]'
                      } text-[#171717]`}
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
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.category.message}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#171717] font-medium mb-2">Status *</label>
                    <select
                      {...register('status')}
                      className={`w-full p-3 bg-[#F5F5F5] border-2 rounded-lg outline-none transition-colors ${
                        errors.status 
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-gray-300 focus:border-[#A33C13]'
                      } text-[#171717]`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="completed">Completed</option>
                    </select>
                    {errors.status && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.status.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <motion.button
                    type="submit"
                    disabled={loading || !isValid}
                    className={`px-6 py-3 bg-[#A33C13] text-white rounded-lg font-medium hover:bg-[#8a2f0f] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
                      loading || !isValid ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                    whileHover={{ scale: loading || !isValid ? 1 : 1.02 }}
                    whileTap={{ scale: loading || !isValid ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      isEdit ? 'Update Project' : 'Create Project'
                    )}
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => onBack ? onBack() : router.back()}
                    className="px-6 py-3 border-2 border-[#171717] text-[#171717] rounded-lg font-medium hover:bg-[#171717] hover:text-white transition-colors text-sm sm:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Form Tips */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-24">
              <h3 className="text-lg sm:text-xl font-bold text-[#171717] mb-4 sm:mb-6 flex items-center gap-2">
                <span>💡</span>
                Tips for Success
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg sm:text-xl">📝</span>
                    <span className="text-[#171717] font-medium text-sm sm:text-base">Clear Title</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Use a descriptive and concise project title</p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg sm:text-xl">🔗</span>
                    <span className="text-[#171717] font-medium text-sm sm:text-base">Valid URL</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Ensure your testing URL is accessible</p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg sm:text-xl">⚡</span>
                    <span className="text-[#171717] font-medium text-sm sm:text-base">Tech Stack</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">List main technologies used in your project</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}