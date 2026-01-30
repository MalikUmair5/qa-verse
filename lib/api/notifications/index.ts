import axiosInstance from '../axiosInstance'

export interface NotificationResponse {
  id: number
  actor_email: string
  verb: string
  target_object_id: string
  is_read: boolean
  created_at: string
}

export interface NotificationsListResponse {
  count: number
  next: string | null
  previous: string | null
  results: NotificationResponse[]
}

// Get all notifications for the current user
export const getNotifications = async (): Promise<NotificationsListResponse> => {
  try {
    const response = await axiosInstance.get('/notifications/')
    return response.data
  } catch (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }
}

// Get a specific notification by ID
export const getNotificationById = async (id: number): Promise<NotificationResponse> => {
  try {
    const response = await axiosInstance.get(`/notifications/${id}/`)
    return response.data
  } catch (error) {
    console.error('Error fetching notification:', error)
    throw error
  }
}

// Mark a specific notification as read
export const markNotificationAsRead = async (id: number): Promise<NotificationResponse> => {
  try {
    const response = await axiosInstance.post(`/notifications/${id}/mark_as_read/`, {
      is_read: true
    })
    return response.data
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await axiosInstance.post('/notifications/mark_all_as_read/', {
      is_read: true
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    throw error
  }
}