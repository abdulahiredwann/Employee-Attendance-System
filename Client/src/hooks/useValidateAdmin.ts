import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../Services/api"

const useValidateAdmin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem("x-auth-token");
                if (!token) {
                    throw new Error("No token found");
                }
                const response = await api.get("/admin/validate", { headers: { "x-auth-token": token } });

                if (!response.data.validateAdmin) throw new Error("Invalid Token");
            } catch (error) {
                navigate("/loginadmin");
            }
        };
        verifyToken();
    }, [navigate]);
};

 export default useValidateAdmin;