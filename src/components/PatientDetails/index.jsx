import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PatientDetails = () => {
  const { id } = useParams()
  const [patient, setPatient] = useState({})
  const [consults, setConsults] = useState([])
  const [exams, setExams] = useState([])

  const [editingConsult, setEditingConsult] = useState(null)
  const [editConsultData, setEditConsultData] = useState({
    reason: '',
    date: '',
    time: '',
    description: '',
    medication: '',
    dosagePrecautions: '',
  })
  const [isEditingConsult, setIsEditingConsult] = useState(false)

  const [editingExam, setEditingExam] = useState(null)
  const [editExamData, setEditExamData] = useState({
    name: '',
    date: '',
    time: '',
    type: '',
    laboratory: '',
    documentUrl: '',
    results: '',
  })
  const [isEditingExam, setIsEditingExam] = useState(false)

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const patientRes = await axios.get(`http://localhost:3000/patients/${id}`)
        const consultsRes = await axios.get(`http://localhost:3000/consults?patientId=${id}`)
        const examsRes = await axios.get(`http://localhost:3000/exams?patientId=${id}`)

        setPatient(patientRes.data)
        setConsults(consultsRes.data)
        setExams(examsRes.data)
      } catch (error) {
        console.error('Erro ao obter os detalhes do paciente:', error)
      }
    }

    fetchPatientDetails()
  }, [id])

  const handleEditConsult = (consult) => {
    setEditingConsult(consult)
    setEditConsultData({
      reason: consult.reason,
      date: consult.date,
      time: consult.time,
      description: consult.description,
      medication: consult.medication,
      dosagePrecautions: consult.dosagePrecautions,
    })
    setIsEditingConsult(true)
  }

  const handleUpdateConsult = async (e) => {
    e.preventDefault()
    try {
      if (!editingConsult) return

      const updatedConsult = {
        ...editingConsult,
        ...editConsultData,
      }

      await axios.put(`http://localhost:3000/consults/${editingConsult.id}`, updatedConsult)
      setConsults((prev) =>
        prev.map((c) => (c.id === editingConsult.id ? updatedConsult : c))
      )

      toast.success('Consulta atualizada com sucesso!')
      setIsEditingConsult(false)
      setEditingConsult(null)
    } catch {
      toast.error('Erro ao atualizar a consulta!')
    }
  }

  const handleDeleteConsult = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/consults/${id}`)
      setConsults((prev) => prev.filter((c) => c.id !== id))
      toast.success('Consulta excluída com sucesso!')
    } catch {
      toast.error('Erro ao excluir consulta!')
    }
  }

  const handleEditExam = (exam) => {
    setEditingExam(exam)
    setEditExamData({
      name: exam.name,
      date: exam.date,
      time: exam.time,
      type: exam.type,
      laboratory: exam.laboratory,
      documentUrl: exam.documentUrl,
      results: exam.results,
    })
    setIsEditingExam(true)
  }

  const handleUpdateExam = async (e) => {
    e.preventDefault()
    try {
      if (!editingExam) return

      const updatedExam = {
        ...editingExam,
        ...editExamData,
      }

      await axios.put(`http://localhost:3000/exams/${editingExam.id}`, updatedExam)
      setExams((prev) =>
        prev.map((exam) => (exam.id === editingExam.id ? updatedExam : exam))
      )

      toast.success('Exame atualizado com sucesso!')
      setIsEditingExam(false)
      setEditingExam(null)
    } catch {
      toast.error('Erro ao atualizar o exame!')
    }
  }

  const handleDeleteExam = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/exams/${id}`)
      setExams((prev) => prev.filter((e) => e.id !== id))
      toast.success('Exame excluído com sucesso!')
    } catch {
      toast.error('Erro ao excluir o exame!')
    }
  }

  const formatValue = (value) => value || 'Nao informado'

  const getDateValue = (date) => {
    if (!date) return 0

    const normalizedDate = date.includes('-')
      ? date
      : date.split('/').reverse().join('-')

    const parsedDate = new Date(normalizedDate)
    return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime()
  }

  const getLatestRecord = (records) => {
    if (records.length === 0) return null

    return [...records].sort((a, b) => getDateValue(b.date) - getDateValue(a.date))[0]
  }

  const latestConsult = getLatestRecord(consults)
  const latestExam = getLatestRecord(exams)
  const hasAllergies = Boolean(patient.allergies)
  const hasSpecialCare = Boolean(patient.specialCare)

  const getPatientAddress = () => {
    const address = patient.address || {}

    return [
      address.street,
      address.number,
      address.neighborhood,
      address.city,
      address.state,
      address.cep,
    ].filter(Boolean).join(', ')
  }

  const handleExportPdf = () => {
    window.print()
  }

  if (!patient) return <p>Carregando...</p>

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }

            .printable-medical-record,
            .printable-medical-record * {
              visibility: visible;
            }

            .printable-medical-record {
              color: #1f2937;
              display: block !important;
              font-family: Arial, sans-serif;
              left: 0;
              line-height: 1.5;
              padding: 24px;
              position: absolute;
              top: 0;
              width: 100%;
            }

            .printable-medical-record h1 {
              border-bottom: 2px solid #0e7490;
              color: #155e75;
              font-size: 28px;
              margin: 0 0 24px;
              padding-bottom: 12px;
            }

            .printable-medical-record h2 {
              color: #374151;
              font-size: 20px;
              margin: 28px 0 12px;
            }

            .printable-grid {
              display: grid;
              gap: 8px 24px;
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .printable-record-item {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              margin-bottom: 12px;
              padding: 14px;
            }

            .printable-medical-record p {
              margin: 4px 0;
            }
          }
        `}
      </style>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleExportPdf}
          className="bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition"
        >
          Exportar PDF do prontuario
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{patient.fullName}</h2>
        <p><span className="font-semibold">Convênio:</span> {patient.healthInsurance}</p>
        <p><span className="font-semibold">Alergias:</span> {patient.allergies}</p>
      </div>

      <div className="bg-cyan-50 dark:bg-cyan-950/40 rounded-2xl shadow-md p-6 mb-8 border border-cyan-100 dark:border-cyan-800">
        <h3 className="text-xl font-semibold text-cyan-800 dark:text-cyan-200 mb-4">
          Resumo inteligente do prontuario
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-cyan-100 dark:border-cyan-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Historico registrado</p>
            <p><strong>Consultas:</strong> {consults.length}</p>
            <p><strong>Exames:</strong> {exams.length}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-cyan-100 dark:border-cyan-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Ultimas movimentacoes</p>
            <p><strong>Consulta:</strong> {latestConsult ? `${latestConsult.reason} em ${latestConsult.date}` : 'Nenhuma consulta'}</p>
            <p><strong>Exame:</strong> {latestExam ? `${latestExam.name} em ${latestExam.date}` : 'Nenhum exame'}</p>
          </div>
        </div>

        <div className="mt-4 bg-white dark:bg-gray-900 rounded-xl p-4 border border-cyan-100 dark:border-cyan-800 text-gray-700 dark:text-gray-200">
          <p className="font-semibold text-cyan-800 dark:text-cyan-200 mb-2">Alertas de atendimento</p>
          <p>{hasAllergies ? `Alergias informadas: ${patient.allergies}.` : 'Nenhuma alergia informada.'}</p>
          <p>{hasSpecialCare ? `Cuidados especiais: ${patient.specialCare}.` : 'Nenhum cuidado especial informado.'}</p>
        </div>
      </div>

      {/* Consultas */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">Histórico de Consultas</h3>

        {isEditingConsult ? (
          <form onSubmit={handleUpdateConsult} className="space-y-4">
            {Object.keys(editConsultData).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 capitalize mb-1">
                  {key === 'dosagePrecautions'
                    ? 'Dosagem e Precauções'
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type={key.includes('date') ? 'date' : key.includes('time') ? 'time' : 'text'}
                  value={editConsultData[key]}
                  onChange={(e) =>
                    setEditConsultData({ ...editConsultData, [key]: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  required
                />
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setIsEditingConsult(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : consults.length === 0 ? (
          <p className="text-gray-500">Nenhuma consulta encontrada.</p>
        ) : (
          consults.map((c) => (
            <div
              key={c.id}
              className="border rounded-xl p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <p><strong>Consulta:</strong> {c.reason}</p>
              <p><strong>Data:</strong> {c.date} - {c.time}</p>
              <p><strong>Descrição:</strong> {c.description}</p>
              <p><strong>Medicação:</strong> {c.medication}</p>
              <p><strong>Dosagem e Precauções:</strong> {c.dosagePrecautions}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleEditConsult(c)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteConsult(c.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Exames */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">Histórico de Exames</h3>

        {isEditingExam ? (
          <form onSubmit={handleUpdateExam} className="space-y-4">
            {Object.keys(editExamData).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 capitalize mb-1">
                  {key === 'documentUrl'
                    ? 'URL do Documento'
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                {key === 'results' ? (
                  <textarea
                    value={editExamData[key]}
                    onChange={(e) =>
                      setEditExamData({ ...editExamData, [key]: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    rows="3"
                    required
                  />
                ) : (
                  <input
                    type={key.includes('date') ? 'date' : key.includes('time') ? 'time' : 'text'}
                    value={editExamData[key]}
                    onChange={(e) =>
                      setEditExamData({ ...editExamData, [key]: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    required={key !== 'documentUrl'}
                  />
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setIsEditingExam(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : exams.length === 0 ? (
          <p className="text-gray-500">Nenhum exame encontrado.</p>
        ) : (
          exams.map((exam) => (
            <div
              key={exam.id}
              className="border rounded-xl p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <p><strong>Exame:</strong> {exam.name}</p>
              <p><strong>Data:</strong> {exam.date} - {exam.time}</p>
              <p><strong>Tipo:</strong> {exam.type}</p>
              <p><strong>Laboratório:</strong> {exam.laboratory}</p>
              <p><strong>Documento:</strong> {exam.documentUrl}</p>
              <p><strong>Resultados:</strong> {exam.results}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleEditExam(exam)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteExam(exam.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden printable-medical-record">
        <h1>Prontuario do Paciente</h1>

        <h2>Dados do paciente</h2>
        <section className="printable-grid">
          <p><strong>Nome:</strong> {formatValue(patient.fullName)}</p>
          <p><strong>Registro:</strong> {formatValue(patient.id)}</p>
          <p><strong>Telefone:</strong> {formatValue(patient.phone)}</p>
          <p><strong>Email:</strong> {formatValue(patient.email)}</p>
          <p><strong>Convenio:</strong> {formatValue(patient.healthInsurance)}</p>
          <p><strong>Numero do convenio:</strong> {formatValue(patient.insuranceNumber)}</p>
          <p><strong>Alergias:</strong> {formatValue(patient.allergies)}</p>
          <p><strong>Cuidados especiais:</strong> {formatValue(patient.specialCare)}</p>
          <p><strong>Endereco:</strong> {formatValue(getPatientAddress())}</p>
        </section>

        <h2>Resumo inteligente</h2>
        <section className="printable-record-item">
          <p><strong>Total de consultas:</strong> {consults.length}</p>
          <p><strong>Total de exames:</strong> {exams.length}</p>
          <p><strong>Ultima consulta:</strong> {latestConsult ? `${latestConsult.reason} em ${latestConsult.date}` : 'Nenhuma consulta'}</p>
          <p><strong>Ultimo exame:</strong> {latestExam ? `${latestExam.name} em ${latestExam.date}` : 'Nenhum exame'}</p>
          <p><strong>Alergias:</strong> {hasAllergies ? patient.allergies : 'Nenhuma alergia informada'}</p>
          <p><strong>Cuidados especiais:</strong> {hasSpecialCare ? patient.specialCare : 'Nenhum cuidado especial informado'}</p>
        </section>

        <h2>Historico de Consultas</h2>
        {consults.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">Nenhuma consulta encontrada.</p>
        ) : (
          consults.map((consult) => (
            <article key={consult.id} className="printable-record-item">
              <p><strong>Consulta:</strong> {formatValue(consult.reason)}</p>
              <p><strong>Data:</strong> {formatValue(consult.date)} - {formatValue(consult.time)}</p>
              <p><strong>Descricao:</strong> {formatValue(consult.description)}</p>
              <p><strong>Medicacao:</strong> {formatValue(consult.medication)}</p>
              <p><strong>Dosagem e Precaucoes:</strong> {formatValue(consult.dosagePrecautions)}</p>
            </article>
          ))
        )}

        <h2>Historico de Exames</h2>
        {exams.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">Nenhum exame encontrado.</p>
        ) : (
          exams.map((exam) => (
            <article key={exam.id} className="printable-record-item">
              <p><strong>Exame:</strong> {formatValue(exam.name)}</p>
              <p><strong>Data:</strong> {formatValue(exam.date)} - {formatValue(exam.time)}</p>
              <p><strong>Tipo:</strong> {formatValue(exam.type)}</p>
              <p><strong>Laboratorio:</strong> {formatValue(exam.laboratory)}</p>
              <p><strong>Documento:</strong> {formatValue(exam.documentUrl)}</p>
              <p><strong>Resultados:</strong> {formatValue(exam.results)}</p>
            </article>
          ))
        )}
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </section>
  )
}

export default PatientDetails

