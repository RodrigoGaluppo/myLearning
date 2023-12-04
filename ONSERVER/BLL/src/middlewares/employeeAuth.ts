import { NextFunction,Response } from "express"
import api from "../global/api"
const jwt = require('jsonwebtoken');
import IEmployeeAuthenticated from "../global/IEmployeeAuthenticated"

const auth = async (req:IEmployeeAuthenticated, res:Response,next:NextFunction)=>{
    
    const JWTSECRET = process.env.JWTSECRET
    const authToken = req.headers["authorization"]

    if(!!authToken){
        const bearer = authToken.split(" ")
        const token = bearer[1]
        
        if(JWTSECRET){
            try{
                const decoded = await jwt.verify(token,JWTSECRET)   
                         
                if(decoded){
                    const { sub } = decoded 

                    if(sub != undefined)
                    {
                       
                        api.get(`employee/${sub}`)       
                        .then((response)=>{
                            
                            const employee = response.data
                
                            req.employee  = {
                                id:sub,
                                employeeRole:employee.employeeRole
                            }
                            next()
                        })
                        .catch((err)=>{
                            
                            if(err?.response?.status == 400)
                            {
                                
                                return res.status(err?.response?.status).json({"message":err.response.data})
                            }
                            else{
                                res.status(500)
                                return res.json({"message":"could not connect to the server"})
                            }
                        })

                    }

                    
                    
                }
            }catch(e){
                return res.json({message:"Invalid Token"}).status(401)
            }
        }
        
    }else{
        res.status(401)
        return res.json({message:"authentication is required"})
    }

}

export default auth


