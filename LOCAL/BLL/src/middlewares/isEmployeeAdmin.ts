import { NextFunction,Response } from "express"
import api from "../global/api"
const jwt = require('jsonwebtoken');
import IEmployeeAuthenticated from "../global/IEmployeeAuthenticated"

const isEmployeeAdmin = async (req:IEmployeeAuthenticated, res:Response,next:NextFunction)=>{
    
   
    try{
    
        
        if(String(req?.employee?.employeeRole).toLowerCase() == "admin")
        {
            return  next()
        }
        else{
         
            return res.status(401).json("you must have a valid credential")
        }
    }catch(e){
       
        return res.json({message:"Invalid Token"}).status(401)
    }
     

}

export default isEmployeeAdmin


