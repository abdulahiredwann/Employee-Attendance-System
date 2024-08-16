import api from "./api";

interface LoginResponse {
    token?: string;
    message?: string;
}

async function AdminLoginService(data: any) {
    const { email, password } = data;
    try {
        const response = await api.post<LoginResponse>('/admin/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('x-auth-token', response.data.token);
            
        } else {
            throw new Error(response.data.message || "No token received");
        }
    } catch (error: any) {
        throw error
        console.log(error)
    }
}

export default AdminLoginService;
