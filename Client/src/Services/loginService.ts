import api from "./api";

interface LoginResponse {
    token?: string;
    message?: string;
    id: number;
}

async function LoginService(data: any) {
    const { email, password } = data;
    try {
        const response = await api.post<LoginResponse>('/employee/login', { email, password });
        if (response.data.token && response.data.id) {
            localStorage.setItem('x-auth-token', response.data.token);
            return { id: response.data.id };
        } else {
            throw new Error(response.data.message || "No token received");
        }
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message); // Extract and throw server error message
        } else {
            // Fallback for unknown errors
            throw new Error("Something went wrong");
        }
    }
}

export default LoginService;
