import { useState, useEffect } from "react"
import axios from "axios"
import { FaHospitalUser } from 'react-icons/fa'

const PatientsCounter = () => {
    const [patientCounter, setPatienteCounter] = useState(0)

    useEffect(() => {
        const fetcPatientes = async () => {
            try {
                const response = await axios.get('http://localhost:3000/patients')
                setPatienteCounter(response.data.length)
            } catch (error) {
                console.error("Erro ao obter dados do paciente", error);
                
            }
        }
        fetcPatientes()
    }, [])
    return (
        <div className="bg-white shadow rounded-lg p-6 flex-col items-center w-60">
            <h2 className="text-x1 font-bold flex items-center gap-2">
                <FaHospitalUser className="text-blue-600"/> {patientCounter}
            </h2>
        </div>
    )
}

export default PatientsCounter