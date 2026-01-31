import axiosInstance from '../axiosInstance'

export interface TotalXPResponse {
  total_xp: number
}

/**
 * Get total XP for the current user
 */
export const getTotalXP = async (): Promise<TotalXPResponse> => {
  try {
    const response = await axiosInstance.get<TotalXPResponse>('/gamification/transactions/total/')
    return response.data
  } catch (error) {
    console.error('Error fetching total XP:', error)
    throw error
  }
}