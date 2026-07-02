import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import PaginationControls from "../PaginationControls";

const ITEMS_PER_PAGE = 2;

const MedicalRecordList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:3000/patients");
        setPatients(response.data);
      } catch (error) {
        console.error("Erro ao obter dados dos pacientes:", error);
      }
    };

    fetchPatients();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredPatients = patients.filter((patient) => {
    return (
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toString().includes(searchTerm)
    );
  });
  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Listagem de Prontuarios
      </h2>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <label htmlFor="search" className="text-gray-700 font-medium">
          Buscar Paciente:
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Digite o nome ou identificador"
          className="w-full sm:w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
        />
      </div>

      <ul className="space-y-4">
        {filteredPatients.length > 0 ? (
          paginatedPatients.map((patient) => (
            <li
              key={patient.id}
              className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    <strong className="text-gray-700">Registro:</strong> {patient.id}
                  </p>
                  <p className="text-gray-700">
                    <strong>Nome:</strong> {patient.fullName}
                  </p>
                  <p className="text-gray-700">
                    <strong>Convenio:</strong> {patient.healthInsurance || "-"}
                  </p>
                </div>

                <Link
                  to={`/paciente/${patient.id}`}
                  className="self-start sm:self-center bg-cyan-700 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition"
                >
                  Ver detalhes
                </Link>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-600">Nenhum paciente encontrado.</p>
        )}
      </ul>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default MedicalRecordList;
