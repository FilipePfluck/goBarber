import React, {createContext, useCallback, useState, useContext, useEffect} from 'react'

import AsyncStorage from '@react-native-community/async-storage'

import api from '../services/api'

interface SignInCredentials {
    email: string,
    password: string
}

interface User {
    id: string,
    avatar_url: string,
    name: string,
    email: string,
}

interface AuthState {
    token: string,
    user: User
}

interface AuthContextData {
    user: User
    loading: boolean
    signIn(credentials: SignInCredentials): Promise<void>
    signOut(): void
    updateUser(user: User): Promise<void>
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider:React.FC = ({children}) => {
    const [data, setData] = useState<AuthState>({} as AuthState)
    const [loading, setLoading] = useState(true)

    const signIn = useCallback(async({email, password})=>{
        const response = await api.post('sessions',{
            email,
            password
        })

        const { token, user } = response.data

        await AsyncStorage.multiSet([
            ['@gobarber:token', token], 
            ['@gobarber:user', JSON.stringify(user)]
        ])

        api.defaults.headers.authorization = `Bearer ${token}`

        console.log('token',api.defaults.headers.authorization)

        setData({token, user})
    },[])

    const signOut = useCallback(async ()=>{
        await AsyncStorage.multiRemove(['@gobarber:token','@gobarber:user'])

        setData({} as AuthState)
    },[])

    const updateUser = useCallback(async (user: User)=>{
        await AsyncStorage.setItem('@gobarber:user', JSON.stringify(user) )

        setData({
            token: data.token,
            user
        })
    }, [setData, data.token])

    useEffect(()=>{
        async function loadStorageItems(): Promise<void>{
            const [token, user] = await AsyncStorage.multiGet(['@gobarber:token', '@gobarber:user'])

            if(token[1] && user[1]){
                api.defaults.headers.authorization = `Bearer ${token[1]}`

                setData({token: token[1], user: JSON.parse(user[1])})
            }

            setLoading(false)
        }

        loadStorageItems()
    },[])

    return(
        <AuthContext.Provider value={{user: data.user, loading, signIn, signOut, updateUser}} >
            {children}          
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextData {
    const context = useContext(AuthContext)

    if(!context){
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}
