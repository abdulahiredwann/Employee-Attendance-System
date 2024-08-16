import api from "./api"

interface Data{
    id:number
}
async function AttendanceService(data:Data){
    const {id} =data

    const employeeId = {
        employeeId: id
    }

    try {
        await api.post('/attendance', employeeId)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export default AttendanceService