import axiosInstance from '../axiosInstance'

export interface ProfileUpdateData {
    email?: string
    fullname?: string
    role?: 'tester' | 'maintainer'
    bio?: string
    avatar_url?: string // Cloudinary URL
    github_url?: string
    linkedin_url?: string
}

export const updateProfile = async (profileData: ProfileUpdateData) => {
    try {
        const response = await axiosInstance.patch('/auth/profile/', profileData)
        return response.data
    } catch (error) {
        console.error('Error updating profile:', error)
        throw error
    }
}

export const getProfile = async () => {
    try {
        const response = await axiosInstance.get('/auth/profile/')
        return response.data
    } catch (error) {
        console.error('Error fetching profile:', error)
        throw error
    }
}