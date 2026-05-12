import axios from 'axios'
import React, { use, useEffect, useState } from 'react'
import { FaFileMedical } from "react-icons/fa";


const ExamsCounter = () => {
    const [ExamCounter, setExamCounter] = useState(0)

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get('http:/localhost:3000/exams')
                setExamCounter(response.data.length)
            } catch (error) {
                console.error("Erro ao obter dados do exame", error)
            }
        }
        fetchExams()
    }, [])

    return (

        <div className='bg-white shadow rounded-lg p-6 flex-col items-center w-60'>
            <h2 className='text-x1 font-bold flex items-center gap-2'>
                <FaFileMedical className='text-blue-600' />
            </h2>
            <p className='text-gray-600 mt-2'>Exames</p> {ExamCounter}
        </div>

    )
}

export default ExamsCounter