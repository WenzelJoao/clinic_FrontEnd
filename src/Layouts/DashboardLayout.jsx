import { Outlet } from "react-router"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import SideMenu from "../components/SideMenu"


const DashboardLayout = () => {
    const { user, logout } = useAuth()
    const { isDarkMode, toggleTheme } = useTheme()

    return (
        <div className="dashboard-theme flex min-h-screen bg-gray-100 dark:bg-gray-950">
            {/* barra lateral - menu */}

            <SideMenu />

            {/* Conteudo principal */}
            <main className="flex-1 flex flex-col">
                <header className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 shadow">
                    <h1 className="text-xl font-bold text-cyan-800 dark:text-cyan-300">Painel do Sistema</h1>
                    {
                        user && (
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700 dark:text-gray-200">Bem Vindo, {user.email}</span>
                                <button
                                    onClick={toggleTheme}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition"
                                >
                                    {isDarkMode ? "Modo claro" : "Modo escuro"}
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

                {/* Paginas internas do dashboard */}
                <section className="flex-1 p-6 overflow-y-auto dark:text-gray-100">
                    <Outlet />
                </section>
            </main>
        </div>
    )
}

export default DashboardLayout
