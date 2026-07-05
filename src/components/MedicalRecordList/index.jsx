import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";

const MedicalRecordList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [insuranceFilter, setInsuranceFilter] = useState("");
  const [allergiesFilter, setAllergiesFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");

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
  };

  const handleInsuranceFilterChange = (event) => {
    setInsuranceFilter(event.target.value);
  };

  const handleAllergiesFilterChange = (event) => {
    setAllergiesFilter(event.target.value);
  };

  const handlePhoneFilterChange = (event) => {
    setPhoneFilter(event.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setInsuranceFilter("");
    setAllergiesFilter("");
    setPhoneFilter("");
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toString().includes(searchTerm);

    const matchesInsurance = (patient.healthInsurance || "")
      .toLowerCase()
      .includes(insuranceFilter.toLowerCase());

    const matchesAllergies = (patient.allergies || "")
      .toLowerCase()
      .includes(allergiesFilter.toLowerCase());

    const normalizedPatientPhone = (patient.phone || "").replace(/\D/g, "");
    const normalizedPhoneFilter = phoneFilter.replace(/\D/g, "");
    const matchesPhone =
      normalizedPatientPhone.includes(normalizedPhoneFilter) ||
      (patient.phone || "").includes(phoneFilter);

    return matchesSearch && matchesInsurance && matchesAllergies && matchesPhone;
  });

  return (
    <section className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Listagem de Prontuarios
      </h2>

      {/* Campo de busca */}
      <div className="mb-6 space-y-4">
        <div>
          <label htmlFor="search" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Buscar Paciente:
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Digite o nome ou identificador"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor="insuranceFilter" className="block text-sm text-gray-700 dark:text-gray-200 font-medium mb-1">
              Convenio
            </label>
            <input
              type="text"
              id="insuranceFilter"
              value={insuranceFilter}
              onChange={handleInsuranceFilterChange}
              placeholder="Ex: Unimed"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label htmlFor="allergiesFilter" className="block text-sm text-gray-700 dark:text-gray-200 font-medium mb-1">
              Alergias
            </label>
            <input
              type="text"
              id="allergiesFilter"
              value={allergiesFilter}
              onChange={handleAllergiesFilterChange}
              placeholder="Ex: Dipirona"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label htmlFor="phoneFilter" className="block text-sm text-gray-700 dark:text-gray-200 font-medium mb-1">
              Telefone
            </label>
            <input
              type="text"
              id="phoneFilter"
              value={phoneFilter}
              onChange={handlePhoneFilterChange}
              placeholder="Ex: 48999999999"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {filteredPatients.length} paciente(s) encontrado(s)
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      {/* Lista de pacientes */}
      <ul className="space-y-4">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <li
              key={patient.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <p className="text-sm text-gray-500 dark:text-gray-300">
                <strong className="text-gray-700 dark:text-gray-100">Registro:</strong> {patient.id}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                <strong>Nome:</strong> {patient.fullName}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                <strong>Convenio:</strong> {patient.healthInsurance || "Nao informado"}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                <strong>Alergias:</strong> {patient.allergies || "Nao informado"}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                <strong>Telefone:</strong> {patient.phone || "Nao informado"}
              </p>
              <Link
                to={`/paciente/${patient.id}`}
                className="inline-block mt-2 text-cyan-700 font-semibold hover:underline"
              >
                Ver detalhes
              </Link>
            </li>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Nenhum paciente encontrado.</p>
        )}
      </ul>
    </section>
  );
};

export default MedicalRecordList;
