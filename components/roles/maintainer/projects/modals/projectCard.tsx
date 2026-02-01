import {
  FiArrowRight,
  FiCalendar,
  FiCode,
  FiEdit2,
  FiLayers,
  FiTrash2,
  FiUser,
  FiUsers,
  FiAlertCircle
} from 'react-icons/fi'
import { motion } from 'framer-motion'
import { ProjectInterface } from '@/lib/api/project-owner/projects'
import { useAuthStore } from '@/store/authStore'

interface ProjectCardProps {
  id: string
  title: string
  description: string
  instructions: string[]
  technology_stack: string
  category: string
  status: string
  testing_url: string
  created_at: string
  total_bugs_reported?: number
  total_active_testers?: number
  maintainer: {
    id: string
    email: string
    fullname: string
    role: string
    bio: string | null
    avatar_url: string | null
    github_url: string | null
    linkedin_url: string | null
  }
  onViewDetails: (id: string) => void
  onEdit?: (project: ProjectInterface) => void
  onDelete?: (id: string, title: string) => void
}

export const MaintainerProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  instructions,
  technology_stack,
  category,
  status,
  testing_url,
  created_at,
  maintainer,
  total_active_testers = 0,
  total_bugs_reported = 0,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const user = useAuthStore().user

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'inactive': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleEdit = () => {
    onEdit && onEdit({
      id,
      title,
      description,
      instructions: instructions || [],
      technology_stack,
      category,
      status,
      testing_url,
      created_at,
      maintainer,
      updated_at: created_at,
      total_active_testers,
      total_bugs_reported,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#A33C13]/30 transition-all duration-300 flex flex-col h-full"
    >
      {/* Action Icons */}
      {user?.role === 'maintainer' && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(); }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(id, title); }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 pr-16">
        <div className="flex items-center gap-3 mb-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-1 group-hover:text-[#A33C13] transition-colors">
          {title}
        </h3>
      </div>

      {/* Stats Summary Section */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
          <FiUsers className="text-blue-600" size={14} />
          <span className="text-xs font-bold text-blue-700">{total_active_testers} Testers</span>
        </div>
        <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
          <FiAlertCircle className="text-red-600" size={14} />
          <span className="text-xs font-bold text-red-700">{total_bugs_reported} Bugs</span>
        </div>
      </div>

      {/* Meta Data */}
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
      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">
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
          <span className="text-gray-600 capitalize">{category}</span>
        </div>
      </div>

      {/* Footer Action */}
      <button
        onClick={() => onViewDetails(id)}
        className="w-full mt-auto flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 px-4 rounded-lg hover:bg-[#A33C13] active:scale-95 transition-all duration-200 text-sm font-medium"
      >
        View Details
        <FiArrowRight />
      </button>
    </motion.div>
  )
}