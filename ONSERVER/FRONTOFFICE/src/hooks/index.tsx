import React from "react"
import {AuthProvider} from "../hooks/AuthContext"

const AppProvider:React.FC<{children:React.ReactNode}>  = ({children})=>{
    return(
        <AuthProvider>
           
                {children}
           
        </AuthProvider>
    )
}
export default AppProvider