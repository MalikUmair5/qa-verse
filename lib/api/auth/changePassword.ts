import axiosInstance from "../axiosInstance";

export interface ChangePasswordPayload {
    old_password: string;
    new_password: string;
}

export interface ChangePasswordResponse {
    message: string;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<ChangePasswordResponse> {
    try {
        const response = await axiosInstance.post<ChangePasswordResponse>(
            "/auth/change-password/",
            payload
        );
        
        if (response.status !== 200 && response.status !== 201) {
            throw new Error("Password change failed");
        }

        return response.data;
    } catch (error: unknown) {
        console.error('Change password error:', error);
        throw error;
    }
}