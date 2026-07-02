import { createContext,useContext,useState } from "react";

const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    const [user,setUser] = useState(() => {
        const savedEmail = localStorage.getItem("email")
        return savedEmail ? {email: savedEmail} : null
    })

    const login = (email) =>{
        localStorage.setItem("email", email)
        setUser({email})
    }

    const logout = () =>{
        localStorage.removeItem("email")
        setUser(null)
    }

    return(
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

//hook customizando para consumir o contexto

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
