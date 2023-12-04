import { NextFunction,Response } from "express"
import api from "../global/api"
const jwt = require('jsonwebtoken');
import ICustomerAUthenticated from "../global/ICustomerAuthenticated"

const auth = async (req:ICustomerAUthenticated, res:Response,next:NextFunction)=>{
    
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
                       
                        req.customer = {
                            id:sub
                        }
                        next()
                      

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


