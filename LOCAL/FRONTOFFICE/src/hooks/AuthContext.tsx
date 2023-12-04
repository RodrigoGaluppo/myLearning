import React,{createContext, useCallback,useState,useContext} from "react"
import api from "../services/apiClient"

interface Iuser{
    id:string
    email:string
    firstName:string
    username:string
}

interface IAuthContext{
    token:string
    user:Iuser
    signIn(credentials:Idata): Promise<void>
    signOut():void
    updateUser(Newuser:Iuser):void
}

interface Idata{
    email:string
    password:string
}

interface IAuthState{
    user:Iuser
    token:string
}


const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export const AuthProvider:React.FC<{children:React.ReactNode}> = ({children})=>{

        const [data,setData] = useState<IAuthState>(()=>{
        const token = localStorage.getItem("@LearnMe:token")
        const user = localStorage.getItem("@LearnMe:customer")
        
        if (token && user){
            return { token , user:JSON.parse(user)}
        }else{
            return {} as IAuthState
        }
    })


    const signIn = useCallback( async ({email,password}:Idata)=>{
        const res = await api.post("login",{
            email,password
        })
        const {token,customer} = res.data
        
        localStorage.setItem("@LearnMe:token",token)
        localStorage.setItem("@LearnMe:customer",JSON.stringify(customer))

        api.defaults.headers.authorization = `Bearer ${token}`
                                                                                                                                                     
        setData({token,user:customer})
        
        /* eslint-disable react-hooks/exhaustive-deps */       
    },[data.token,data.user])

    const signOut = useCallback(()=>{
        localStorage.removeItem("@LearnMe:token")
        localStorage.removeItem("@LearnMe:customer")

        setData({} as IAuthState)
        /* eslint-disable react-hooks/exhaustive-deps */       
    },[])

    const updateUser = useCallback((Newuser:Iuser)=>{

        localStorage.setItem("@LearnMe:customer",JSON.stringify(data.user))
      
        
        setData({user:Newuser,token:data.token})
        
        /* eslint-disable react-hooks/exhaustive-deps */       
    },[setData,localStorage])


    return(
        <AuthContext.Provider value={{user:data.user,token:data.token,signIn,signOut,updateUser}} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ():IAuthContext=>{
    const context = useContext(AuthContext)
    if(!context){
        throw new Error("useAuth must be used within an auth provider")
    }else{
        return context
    }

}
