import axiosInstance from '../axiosInstance';

export interface LeaderboardEntry {
    id: string;
    email: string;
    fullname: string;
    role: string;
    total_xp: number;
    badges_count: number;
}

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    try {
        const response = await axiosInstance.get('/gamification/leaderboard/');
        return response.data;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
};