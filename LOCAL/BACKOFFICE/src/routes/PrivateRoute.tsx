import React from "react"
import {Route , Navigate} from "react-router-dom"
import { useAuth } from "../hooks/AuthContext";

interface PrivateRouteCOmponentProps {
   
    component: React.ComponentType;
  }
  
  function PrivateRouteCOmponent({ component: Component }: PrivateRouteCOmponentProps) {

    const {user} = useAuth()

    return (
      !!user ? <Component /> : <Navigate to="/" />
    );
  }
  

export default PrivateRouteCOmponent