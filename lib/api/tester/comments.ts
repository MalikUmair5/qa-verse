import api from '../axiosInstance'

export interface CommentResponse {
  id: string
  bug_report: string
  user: string
  parent: string | null
  text: string
  created_at: string
  replies: CommentResponse[]
}

export interface CreateCommentRequest {
  bug_report: string
  text: string
  parent?: string
}

export interface UpdateCommentRequest {
  text: string
}

// Get all comments for a bug report
export const getBugComments = async (bugReportId: string): Promise<CommentResponse[]> => {
  const response = await api.get(`/bugs/reports/${bugReportId}/`)
  // Assuming comments are returned with the bug report, or we need a separate endpoint
  return response.data.comments || []
}

// Get a specific comment with its replies
export const getComment = async (commentId: string): Promise<CommentResponse> => {
  const response = await api.get(`/bugs/comments/${commentId}/`)
  return response.data
}

// Create a new comment or reply
export const createComment = async (commentData: CreateCommentRequest): Promise<CommentResponse> => {
  const response = await api.post('/bugs/comments/', commentData)
  return response.data
}

// Update a comment
export const updateComment = async (commentId: string, updateData: UpdateCommentRequest): Promise<CommentResponse> => {
  const response = await api.patch(`/bugs/comments/${commentId}/`, updateData)
  return response.data
}

// Delete a comment
export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/bugs/comments/${commentId}/`)
}