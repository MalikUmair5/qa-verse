import axiosInstance from "../axiosInstance";

export interface RegisterPayload {
    fullname: string;
    email: string;
    role: "tester" | "maintainer";
    password: string;
    password2: string;
    avatar_url?: string; // Changed from File to string URL
    bio: string;
    github_url?: string;
    linkedin_url?: string;
}

export interface RegisterResponse {
    message: string;
    // Note: The actual API only returns message, not user data or tokens
    // user?: user;
    // access?: string;
    // refresh?: string;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
    try {
        // Create FormData for the request
        const formData = new FormData();
        
        // Append all text fields
        formData.append('fullname', payload.fullname);
        formData.append('email', payload.email);
        formData.append('role', payload.role);
        formData.append('password', payload.password);
        formData.append('password2', payload.password2);
        formData.append('bio', payload.bio);
        
        if (payload.github_url) {
            formData.append('github_url', payload.github_url);
        }
        
        if (payload.linkedin_url) {
            formData.append('linkedin_url', payload.linkedin_url);
        }
        
        // Append avatar URL if provided
        if (payload.avatar_url) {
            formData.append('avatar_url', payload.avatar_url);
        }

        const response = await axiosInstance.post<RegisterResponse>(
            "/auth/register/",
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        
        if (response.status !== 200 && response.status !== 201) {
            throw new Error("Registration failed");
        }

        return response.data;
    } catch (error: unknown) {
        console.error('Registration error:', error);
        throw error;
    }
}