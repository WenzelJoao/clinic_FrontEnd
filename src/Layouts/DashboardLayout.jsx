import { Outlet } from "react-router"
import { useAuth } from "../contexts/AuthContext"
import SideMenu from "../components/SideMenu"
import { useEffect, useState } from "react"
import { MdDarkMode, MdLightMode } from "react-icons/md"


const DashboardLayout = () => {
    const { user, logout } = useAuth()
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark"
    })

    useEffect(() => {
        localStorage.setItem("theme", isDarkMode ? "dark" : "light")
    }, [isDarkMode])

    return (
        <div className={`flex min-h-screen items-stretch bg-gray-100 ${isDarkMode ? "dark-mode" : ""}`}>
            {/* barra lateral - menu */}

            <SideMenu />

            {/* Conteúdo principal */}
            <main className="flex-1 flex flex-col">
                <header className="flex justify-between items-center bg-white p-4 shadow">
                    <h1 className="text-xl font-bold text-cyan-800">Painel do Sistema</h1>
                    {
                        user && (
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700">Bem Vindo, {user.email}</span>
                                <button
                                    type="button"
                                    onClick={() => setIsDarkMode((prev) => !prev)}
                                    className="flex items-center gap-2 px-3 py-1 bg-cyan-700 text-white rounded hover:bg-cyan-600 transition"
                                    title={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
                                >
                                    {isDarkMode ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
                                    {isDarkMode ? "Claro" : "Escuro"}
                                </button>
                                <button
                                    onClick={logout}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                >
                                    Sair

                                </button>

                            </div>
                        )
                    }
                </header>

                {/* Páginas internas do dashboard */}
                <section className="flex-1 p-6">
                    <Outlet context={{ isDarkMode }} />
                </section>
            </main>
        </div>
    )
}

export default DashboardLayout
