import React from "react"
import {Route , Navigate} from "react-router-dom"
import { useAuth } from "../hooks/AuthContext";

interface PrivateRouteComponentProps {
   
    component: React.ComponentType;
  }
  
  function PrivateRouteComponent({ component: Component }: PrivateRouteComponentProps) {

    const {user} = useAuth()

    return (
      !!user ? <Component /> : <Navigate to="/" />
    );
  }
  

export default PrivateRouteComponent