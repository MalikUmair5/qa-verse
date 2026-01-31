import axiosInstance from "../axiosInstance";

export interface VerifyAccountPayload {
    email: string;
    otp: string;
}

export interface VerifyAccountResponse {
    message: string;
}

export async function verifyAccount(payload: VerifyAccountPayload): Promise<VerifyAccountResponse> {
    try {
        const response = await axiosInstance.post<VerifyAccountResponse>(
            "/auth/verify-account/",
            payload
        );
        
        if (response.status !== 200 && response.status !== 201) {
            throw new Error("Account verification failed");
        }

        return response.data;
    } catch (error: unknown) {
        console.error('Account verification error:', error);
        throw error;
    }
}