import axiosInstance from '../axiosInstance'

export interface BugReportPayload {
  project: string
  title: string
  description: string
  steps_to_reproduce: string
  category: 'ui' | 'functionality' | 'performance' | 'security' | 'compatibility' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface BugReportResponse {
  id: string
  project: string
  tester: string
  title: string
  description: string
  steps_to_reproduce: string
  category: string
  severity: string
  status: string
  created_at: string
  updated_at: string
  attachments: any[]
  comments: any[]
}

export interface BugReportsListResponse {
  count: number
  next: string | null
  previous: string | null
  results: BugReportResponse[]
}

export async function createBugReport(payload: BugReportPayload): Promise<BugReportResponse> {
  try {
    const response = await axiosInstance.post<BugReportResponse>(
      '/bugs/reports/',
      payload
    )
    
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Failed to create bug report')
    }
    
    return response.data
  } catch (error: unknown) {
    console.error('Create bug report error:', error)
    throw error
  }
}

export async function getBugReports(): Promise<BugReportsListResponse> {
  try {
    const response = await axiosInstance.get<BugReportsListResponse>(
      '/bugs/reports/'
    )
    
    if (response.status !== 200) {
      throw new Error('Failed to fetch bug reports')
    }
    
    return response.data
  } catch (error: unknown) {
    console.error('Get bug reports error:', error)
    throw error
  }
}

export async function getBugReportById(id: string): Promise<BugReportResponse> {
  try {
    const response = await axiosInstance.get<BugReportResponse>(
      `/bugs/reports/${id}/`
    )
    
    if (response.status !== 200) {
      throw new Error('Failed to fetch bug report')
    }
    
    return response.data
  } catch (error: unknown) {
    console.error('Get bug report by ID error:', error)
    throw error
  }
}

export async function updateBugReport(id: string, payload: Partial<BugReportPayload>): Promise<BugReportResponse> {
  try {
    const response = await axiosInstance.patch<BugReportResponse>(
      `/bugs/reports/${id}/`,
      payload
    )
    
    if (response.status !== 200) {
      throw new Error('Failed to update bug report')
    }
    
    return response.data
  } catch (error: unknown) {
    console.error('Update bug report error:', error)
    throw error
  }
}

export async function deleteBugReport(id: string): Promise<void> {
  try {
    const response = await axiosInstance.delete(
      `/bugs/reports/${id}/`
    )
    
    if (response.status !== 204 && response.status !== 200) {
      throw new Error('Failed to delete bug report')
    }
  } catch (error: unknown) {
    console.error('Delete bug report error:', error)
    throw error
  }
}

// Attachment interface
export interface AttachmentPayload {
  bug_report: string
  file_url: string
  file_name: string
}

export interface AttachmentResponse {
  id: string
  bug_report: string
  file_url: string
  file_name: string
  uploaded_at: string
}

// Add attachment to bug report
export async function addAttachmentToBugReport(bugReportId: string, attachmentData: {
  file_url: string
  file_name: string
}): Promise<AttachmentResponse> {
  try {
    const payload: AttachmentPayload = {
      bug_report: bugReportId,
      file_url: attachmentData.file_url,
      file_name: attachmentData.file_name
    }

    const response = await axiosInstance.post<AttachmentResponse>(
      `/bugs/attachments/`,
      payload
    )
    
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Failed to add attachment')
    }
    
    return response.data
  } catch (error: unknown) {
    console.error('Add attachment error:', error)
    throw error
  }
}

// Remove attachment from bug report
export async function removeAttachmentFromBugReport(attachmentId: string): Promise<void> {
  try {
    const response = await axiosInstance.delete(
      `/bugs/attachments/${attachmentId}/`
    )
    
    if (response.status !== 204 && response.status !== 200) {
      throw new Error('Failed to remove attachment')
    }
  } catch (error: unknown) {
    console.error('Remove attachment error:', error)
    throw error
  }
}

// Update attachment
export async function updateAttachment(attachmentId: string, attachmentData: {
  bug_report: string
  file_url: string
  file_name?: string
}): Promise<AttachmentResponse> {
  try {
    const response = await axiosInstance.patch<AttachmentResponse>(
      `/bugs/attachments/${attachmentId}/`,
      attachmentData
    )
    
    if (response.status !== 200) {
      throw new Error('Failed to update attachment')
    }
    
    return response.data
  } catch (error: unknown) {
    console.error('Update attachment error:', error)
    throw error
  }
}