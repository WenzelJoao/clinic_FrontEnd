import { useState } from 'react'
import { toast } from 'react-toastify'

import { useNavigate } from "react-router"
import axios from 'axios'

import { useAuth } from '../../contexts/AuthContext'

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const { login } = useAuth()

    //validação login

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.get('http://localhost:3000/users', {
                params: { email }
            })

            const user = response.data[0]

            if (!user || user.password !== password) {
                toast.error('Usuário ou senha inválidos')
                return
            }

            console.log("response", response);

            if (response.data.length === 0) {
                toast.error('Usuário não encontrado. Verifique o email e senha',
                    {
                        autoClose: 3000,
                        hideProgressBar: true
                    }
                )
                return;
            }
            
            login(email)

            toast.success('login realizado com sucesso!',
                {
                    autoClose: 2000
                }
            )

            setTimeout(() => navigate('/dashboard'), 2000)

        }
        catch (error) {
            console.error('Erro ao verificar usuário', error)
        }

    }


    return (
        <div className='max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg'>
            <h2 className='text-2xl font-bold text-center mb-6'>Login</h2>

            <form onSubmit={handleLogin} className='space-y-4'>
                <fieldset >
                    <label htmlFor="email" className='block text-sm font-medium 
                    mb-1'>Email</label>
                    <input
                        type="email"
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='w-full p-2 border rounded-lg focus:outline-none
                    focus:ring-blue-500'
                    />
                </fieldset>

                <fieldset >
                    <label htmlFor="password" className='block text-sm font-medium 
                    mb-1'>Senha</label>
                    <input
                        type="password"
                        id='password'
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className='w-full p-2 border rounded-lg focus:outline-none
                    focus:ring-blue-500'
                    />
                </fieldset>

                <button
                    type='submit'
                    className='w-full bg-cyan-700 text-white p-2 rounded-lg
                 hover:bg-cyan-800 transition-colors'>
                    Entrar
                </button>

            </form>
        </div>
    )
}

export default LoginForm