import { createContext,useContext,useState,useEffect, Children } from "react";

const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    const [user,setUser] = useState(null)

    //se ja tiver email no localstorege, mantem o login 

    useEffect(() =>{
        const savedEmail = localStorage.getItem("email")

        if(savedEmail) {
            setUser({email: savedEmail})
        }
    },[])

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

export const useAuth = () => useContext(AuthContext)