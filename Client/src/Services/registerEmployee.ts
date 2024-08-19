import { RegisterEmployeeForm } from "../Components/Admin/RegisterEmployee";
import api from "./api";

export interface Response{
    id:string
    firstName:string
    lastName:string
    email:string
    qrCode:string
}


async function RegisterEmployeeService(data:RegisterEmployeeForm) {
    const {email,firstName,lastName} = data
    const newEmployee = {
        email,firstName,lastName
    }
    try {
        const response = await api.post<Response>('/employee', newEmployee )
        
        return response.data
    } catch (error) {
        console.log("Error during register", error)
        throw error
    }
}

export default RegisterEmployeeService