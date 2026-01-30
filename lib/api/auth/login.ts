import axiosInstance from "../axiosInstance";
import { useAuthStore } from "@/store/authStore";

export interface user {
    id: number;
    email: string;
    fullname: string;
    role: string;
    bio: string;
    avatar_url: string;
    github_url: string;
    linkedin_url: string;
}

export interface loginResponse {
    refresh: string;
    access: string;
    user: user;
}

export interface loginPayload {
    email: string;
    password: string;
}

export async function login(payload: loginPayload): Promise<loginResponse> {
    try {
        const res = await axiosInstance.post<loginResponse>(
            "/auth/login/",
            payload
        );
        
        if (res.status !== 200) throw new Error("Invalid Response Status");

        // Update Zustand Store with all tokens and user data
        // This will automatically persist to localStorage (encrypted)
        useAuthStore.getState().setAuth(
            res.data.user, 
            res.data.access, 
            res.data.refresh
        );

        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}