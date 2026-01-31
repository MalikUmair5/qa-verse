import axiosInstance from "../axiosInstance";

export interface PasswordResetRequestPayload {
    email: string;
}

export interface PasswordResetRequestResponse {
    message: string;
}

export interface PasswordResetVerifyPayload {
    email: string;
    otp: string;
}

export interface PasswordResetVerifyResponse {
    message: string;
}

export interface PasswordResetConfirmPayload {
    email: string;
    otp: string;
    new_password: string;
}

export interface PasswordResetConfirmResponse {
    message: string;
}

// Step 1: Request OTP for password reset
export async function requestPasswordReset(payload: PasswordResetRequestPayload): Promise<PasswordResetRequestResponse> {
    try {
        const response = await axiosInstance.post<PasswordResetRequestResponse>(
            "/auth/password-reset/request/",
            payload
        );
        
        if (response.status !== 200 && response.status !== 201) {
            throw new Error("Password reset request failed");
        }

        return response.data;
    } catch (error: unknown) {
        console.error('Password reset request error:', error);
        throw error;
    }
}

// Step 2: Verify OTP for password reset
export async function verifyPasswordResetOTP(payload: PasswordResetVerifyPayload): Promise<PasswordResetVerifyResponse> {
    try {
        const response = await axiosInstance.post<PasswordResetVerifyResponse>(
            "/auth/password-reset/verify/",
            payload
        );
        
        if (response.status !== 200 && response.status !== 201) {
            throw new Error("Password reset OTP verification failed");
        }

        return response.data;
    } catch (error: unknown) {
        console.error('Password reset OTP verification error:', error);
        throw error;
    }
}

// Step 3: Confirm new password with OTP
export async function confirmPasswordReset(payload: PasswordResetConfirmPayload): Promise<PasswordResetConfirmResponse> {
    try {
        const response = await axiosInstance.post<PasswordResetConfirmResponse>(
            "/auth/password-reset/confirm/",
            payload
        );
        
        if (response.status !== 200 && response.status !== 201) {
            throw new Error("Password reset confirmation failed");
        }

        return response.data;
    } catch (error: unknown) {
        console.error('Password reset confirmation error:', error);
        throw error;
    }
}