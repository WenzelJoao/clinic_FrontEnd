import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useOutletContext, useParams } from 'react-router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const getDateValue = (item) => {
  if (!item?.date) return 0

  const normalizedDate = item.date.includes('/')
    ? item.date.split('/').reverse().join('-')
    : item.date

  return new Date(`${normalizedDate}T${item.time || '00:00'}`).getTime()
}

const formatDate = (item) => {
  if (!item?.date) return '-'

  const normalizedDate = item.date.includes('/')
    ? item.date.split('/').reverse().join('-')
    : item.date
  const date = new Date(`${normalizedDate}T${item.time || '00:00'}`)

  if (Number.isNaN(date.getTime())) return item.date

  return date.toLocaleDateString('pt-BR')
}

const getAddressText = (address = {}) => {
  const streetInfo = [address.street, address.number].filter(Boolean).join(', ')
  const cityInfo = [address.neighborhood, address.city, address.state].filter(Boolean).join(' - ')
  const complementInfo = [address.complement, address.reference].filter(Boolean).join(' | ')

  return [streetInfo, cityInfo, address.cep, complementInfo].filter(Boolean).join(' | ') || '-'
}

const Field = ({ label, value, className = '' }) => (
  <div className={className}>
    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-800">{value || '-'}</dd>
  </div>
)

const PatientDetails = () => {
  const { id } = useParams()
  const { isDarkMode = false } = useOutletContext() || {}
  const [patient, setPatient] = useState(null)
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
        const consultsRes = await axios.get('http://localhost:3000/consults')
        const examsRes = await axios.get('http://localhost:3000/exams')

        setPatient(patientRes.data)
        setConsults(consultsRes.data.filter((consult) => String(consult.patientId) === String(id)))
        setExams(examsRes.data.filter((exam) => String(exam.patientId) === String(id)))
      } catch (error) {
        console.error('Erro ao obter os detalhes do paciente:', error)
        toast.error('Erro ao carregar o prontuario.')
      }
    }

    fetchPatientDetails()
  }, [id])

  const handleEditConsult = (consult) => {
    setEditingConsult(consult)
    setEditConsultData({
      reason: consult.reason || '',
      date: consult.date || '',
      time: consult.time || '',
      description: consult.description || '',
      medication: consult.medication || '',
      dosagePrecautions: consult.dosagePrecautions || '',
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
        prev.map((consult) => (consult.id === editingConsult.id ? updatedConsult : consult))
      )

      toast.success('Consulta atualizada com sucesso!')
      setIsEditingConsult(false)
      setEditingConsult(null)
    } catch {
      toast.error('Erro ao atualizar a consulta!')
    }
  }

  const handleDeleteConsult = async (consultId) => {
    try {
      await axios.delete(`http://localhost:3000/consults/${consultId}`)
      setConsults((prev) => prev.filter((consult) => consult.id !== consultId))
      toast.success('Consulta excluida com sucesso!')
    } catch {
      toast.error('Erro ao excluir consulta!')
    }
  }

  const handleEditExam = (exam) => {
    setEditingExam(exam)
    setEditExamData({
      name: exam.name || '',
      date: exam.date || '',
      time: exam.time || '',
      type: exam.type || '',
      laboratory: exam.laboratory || '',
      documentUrl: exam.documentUrl || '',
      results: exam.results || '',
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

  const handleDeleteExam = async (examId) => {
    try {
      await axios.delete(`http://localhost:3000/exams/${examId}`)
      setExams((prev) => prev.filter((exam) => exam.id !== examId))
      toast.success('Exame excluido com sucesso!')
    } catch {
      toast.error('Erro ao excluir o exame!')
    }
  }

  const handleExportPdf = () => {
    const previousTitle = document.title
    document.title = `Prontuario-${patient.fullName || patient.id}`

    const restoreTitle = () => {
      document.title = previousTitle
      window.removeEventListener('afterprint', restoreTitle)
    }

    window.addEventListener('afterprint', restoreTitle)
    setTimeout(() => window.print(), 300)
  }

  if (!patient) return <p>Carregando...</p>

  const sortedConsults = [...consults].sort((a, b) => getDateValue(b) - getDateValue(a))
  const sortedExams = [...exams].sort((a, b) => getDateValue(b) - getDateValue(a))
  const timelineItems = [
    ...sortedConsults.map((consult) => ({
      id: `consult-${consult.id}`,
      type: 'Consulta',
      title: consult.reason,
      date: consult.date,
      time: consult.time,
      description: consult.description,
      dateValue: getDateValue(consult),
    })),
    ...sortedExams.map((exam) => ({
      id: `exam-${exam.id}`,
      type: 'Exame',
      title: exam.name,
      date: exam.date,
      time: exam.time,
      description: exam.results,
      dateValue: getDateValue(exam),
    })),
  ].sort((a, b) => b.dateValue - a.dateValue)
  const summaryCardClass = isDarkMode
    ? 'bg-slate-800 border border-slate-600 rounded-lg p-4'
    : 'bg-cyan-50 border border-cyan-100 rounded-lg p-4'
  const summaryValueClass = isDarkMode
    ? 'text-2xl font-bold text-cyan-300'
    : 'text-2xl font-bold text-cyan-800'
  const summaryTextClass = isDarkMode
    ? 'text-sm text-slate-200'
    : 'text-sm text-gray-600'
  const summaryPlanClass = isDarkMode
    ? 'text-base font-semibold text-cyan-300'
    : 'text-base font-semibold text-cyan-800'

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <div className="print-only print-report">
        <div className="print-report-header">
          <div>
            <p className="print-report-kicker">Clinica +</p>
            <h1>Prontuario do paciente</h1>
          </div>
          <div className="print-report-meta">
            <p><strong>Registro:</strong> #{patient.id}</p>
            <p><strong>Emissao:</strong> {new Date().toLocaleDateString('pt-BR')} as {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        <section className="print-report-section">
          <h2>Identificacao do paciente</h2>
          <div className="print-report-grid">
            <p><strong>Nome:</strong> {patient.fullName || '-'}</p>
            <p><strong>Data de nascimento:</strong> {patient.birthdate || '-'}</p>
            <p><strong>Genero:</strong> {patient.gender || '-'}</p>
            <p><strong>CPF:</strong> {patient.cpf || '-'}</p>
            <p><strong>RG:</strong> {patient.rg || '-'}</p>
            <p><strong>Estado civil:</strong> {patient.maritalStatus || '-'}</p>
            <p><strong>Naturalidade:</strong> {patient.birthplace || '-'}</p>
            <p><strong>Telefone:</strong> {patient.phone || '-'}</p>
            <p><strong>Email:</strong> {patient.email || '-'}</p>
            <p><strong>Contato de emergencia:</strong> {patient.emergencyContact || '-'}</p>
            <p className="print-report-wide"><strong>Endereco:</strong> {getAddressText(patient.address)}</p>
          </div>
        </section>

        <section className="print-report-section">
          <h2>Informacoes clinicas</h2>
          <div className="print-report-grid">
            <p><strong>Convenio:</strong> {patient.healthInsurance || '-'}</p>
            <p><strong>Numero do convenio:</strong> {patient.insuranceNumber || '-'}</p>
            <p><strong>Validade do convenio:</strong> {patient.insuranceValidity || '-'}</p>
            <p><strong>Alergias:</strong> {patient.allergies || '-'}</p>
            <p className="print-report-wide"><strong>Cuidados especiais:</strong> {patient.specialCare || '-'}</p>
          </div>
        </section>

        <section className="print-report-section">
          <h2>Consultas</h2>
          {sortedConsults.length === 0 ? (
            <p className="print-report-empty">Nenhuma consulta registrada.</p>
          ) : (
            sortedConsults.map((consult) => (
              <article key={consult.id} className="print-report-card">
                <div className="print-report-card-title">
                  <strong>{consult.reason || 'Consulta'}</strong>
                  <span>{formatDate(consult)} - {consult.time || '-'}</span>
                </div>
                <p><strong>Descricao:</strong> {consult.description || '-'}</p>
                <p><strong>Medicacao:</strong> {consult.medication || '-'}</p>
                <p><strong>Dosagem e precaucoes:</strong> {consult.dosagePrecautions || '-'}</p>
              </article>
            ))
          )}
        </section>

        <section className="print-report-section">
          <h2>Exames</h2>
          {sortedExams.length === 0 ? (
            <p className="print-report-empty">Nenhum exame registrado.</p>
          ) : (
            sortedExams.map((exam) => (
              <article key={exam.id} className="print-report-card">
                <div className="print-report-card-title">
                  <strong>{exam.name || 'Exame'}</strong>
                  <span>{formatDate(exam)} - {exam.time || '-'}</span>
                </div>
                <p><strong>Tipo:</strong> {exam.type || '-'}</p>
                <p><strong>Laboratorio:</strong> {exam.laboratory || '-'}</p>
                <p><strong>Resultados:</strong> {exam.results || '-'}</p>
                <p><strong>Documento:</strong> {exam.documentUrl || '-'}</p>
              </article>
            ))
          )}
        </section>
      </div>

      <div className="screen-only">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100 print-section">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-700">Registro #{patient.id}</p>
            <h2 className="text-2xl font-semibold text-gray-800 mt-1">{patient.fullName}</h2>
            <p className="text-sm text-gray-600 mt-2">
              {patient.email || '-'} | {patient.phone || '-'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportPdf}
            className="no-print bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition"
          >
            Exportar PDF completo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className={summaryCardClass}>
            <p className={summaryValueClass}>{consults.length}</p>
            <p className={summaryTextClass}>Consultas registradas</p>
          </div>
          <div className={summaryCardClass}>
            <p className={summaryValueClass}>{exams.length}</p>
            <p className={summaryTextClass}>Exames registrados</p>
          </div>
          <div className={summaryCardClass}>
            <p className={summaryPlanClass}>{patient.healthInsurance || '-'}</p>
            <p className={summaryTextClass}>Convenio</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100 print-section">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Dados do paciente</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Field label="Nome completo" value={patient.fullName} />
            <Field label="Genero" value={patient.gender} />
            <Field label="Data de nascimento" value={patient.birthdate} />
            <Field label="CPF" value={patient.cpf} />
            <Field label="RG" value={patient.rg} />
            <Field label="Estado civil" value={patient.maritalStatus} />
            <Field label="Naturalidade" value={patient.birthplace} />
            <Field label="Telefone" value={patient.phone} />
            <Field label="Email" value={patient.email} />
            <Field label="Contato de emergencia" value={patient.emergencyContact} />
            <Field label="Convenio" value={patient.healthInsurance} />
            <Field label="Numero do convenio" value={patient.insuranceNumber} />
            <Field label="Validade do convenio" value={patient.insuranceValidity} />
            <Field label="Endereco" value={getAddressText(patient.address)} className="md:col-span-2" />
          </dl>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 print-section">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Alertas clinicos</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Alergias</p>
              <p className="mt-1 text-sm text-gray-800">{patient.allergies || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Cuidados especiais</p>
              <p className="mt-1 text-sm text-gray-800">{patient.specialCare || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100 print-section">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Informacoes das consultas</h3>

        {isEditingConsult ? (
          <form onSubmit={handleUpdateConsult} className="space-y-4">
            {Object.keys(editConsultData).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {key === 'dosagePrecautions'
                    ? 'Dosagem e precaucoes'
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type={key.includes('date') ? 'date' : key.includes('time') ? 'time' : 'text'}
                  value={editConsultData[key]}
                  onChange={(e) =>
                    setEditConsultData({ ...editConsultData, [key]: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                  required
                />
              </div>
            ))}

            <div className="no-print flex gap-3 pt-2">
              <button type="submit" className="bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition">
                Salvar
              </button>
              <button type="button" onClick={() => setIsEditingConsult(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition">
                Cancelar
              </button>
            </div>
          </form>
        ) : consults.length === 0 ? (
          <p className="text-gray-500">Nenhuma consulta encontrada.</p>
        ) : (
          <div className="space-y-4">
            {sortedConsults.map((consult) => (
              <article key={consult.id} className="border rounded-xl p-4 bg-gray-50">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{consult.reason || 'Consulta'}</p>
                    <p className="text-sm text-gray-600">{formatDate(consult)} - {consult.time || '-'}</p>
                  </div>

                  <div className="no-print flex gap-2">
                    <button onClick={() => handleEditConsult(consult)} className="bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-1 rounded-md text-sm">
                      Editar
                    </button>
                    <button onClick={() => handleDeleteConsult(consult.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">
                      Deletar
                    </button>
                  </div>
                </div>

                <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm">
                  <Field label="Descricao" value={consult.description} />
                  <Field label="Medicacao" value={consult.medication} />
                  <Field label="Dosagem e precaucoes" value={consult.dosagePrecautions} className="md:col-span-2" />
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 print-section">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Linha do tempo</h3>
          {timelineItems.length === 0 ? (
            <p className="text-gray-500">Nenhum registro encontrado para este paciente.</p>
          ) : (
            <ol className="space-y-4">
              {timelineItems.map((item) => (
                <li key={item.id} className="border-l-4 border-cyan-700 pl-4 py-1">
                  <p className="font-semibold text-gray-800">{item.type}: {item.title || '-'}</p>
                  <p className="text-sm text-gray-600">{formatDate(item)} {item.time ? `- ${item.time}` : ''}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.description || '-'}</p>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 print-section">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Historico de exames</h3>

          {isEditingExam ? (
            <form onSubmit={handleUpdateExam} className="space-y-4">
              {Object.keys(editExamData).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                    {key === 'documentUrl' ? 'URL do Documento' : key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  {key === 'results' ? (
                    <textarea
                      value={editExamData[key]}
                      onChange={(e) => setEditExamData({ ...editExamData, [key]: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                      rows="3"
                      required
                    />
                  ) : (
                    <input
                      type={key.includes('date') ? 'date' : key.includes('time') ? 'time' : 'text'}
                      value={editExamData[key]}
                      onChange={(e) => setEditExamData({ ...editExamData, [key]: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                      required={key !== 'documentUrl'}
                    />
                  )}
                </div>
              ))}

              <div className="no-print flex gap-3 pt-2">
                <button type="submit" className="bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition">
                  Salvar
                </button>
                <button type="button" onClick={() => setIsEditingExam(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition">
                  Cancelar
                </button>
              </div>
            </form>
          ) : exams.length === 0 ? (
            <p className="text-gray-500">Nenhum exame encontrado.</p>
          ) : (
            <div className="space-y-4">
              {sortedExams.map((exam) => (
                <article key={exam.id} className="border rounded-xl p-4 bg-gray-50">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{exam.name}</p>
                      <p className="text-sm text-gray-600">{formatDate(exam)} - {exam.time || '-'}</p>
                    </div>
                    <div className="no-print flex gap-2">
                      <button onClick={() => handleEditExam(exam)} className="bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-1 rounded-md text-sm">
                        Editar
                      </button>
                      <button onClick={() => handleDeleteExam(exam.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">
                        Deletar
                      </button>
                    </div>
                  </div>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm">
                    <Field label="Tipo" value={exam.type} />
                    <Field label="Laboratorio" value={exam.laboratory} />
                    <Field label="Documento" value={exam.documentUrl} className="md:col-span-2" />
                    <Field label="Resultados" value={exam.results} className="md:col-span-2" />
                  </dl>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </section>
  )
}

export default PatientDetails
