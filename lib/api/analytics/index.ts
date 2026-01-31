import axiosInstance from '../axiosInstance';

export interface TesterAnalytics {
  email: string;
  total_xp: number;
  bug_reports_count: number;
  approved_bugs_count: number;
  success_rate: number;
}

export interface MaintainerAnalytics {
  total_active_projects: number;
  total_testers: number;
  total_bugs: number;
  approved_bugs: number;
}

export const getTesterAnalytics = async (): Promise<TesterAnalytics> => {
  const response = await axiosInstance.get('/analytics/tester/');
  return response.data;
};

export const getMaintainerAnalytics = async (): Promise<MaintainerAnalytics> => {
  const response = await axiosInstance.get('/analytics/maintainer/');
  return response.data;
};