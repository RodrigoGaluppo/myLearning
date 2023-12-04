import { Request,Response } from "express";
import IEmployyeAuthenticated from "../../../global/IEmployeeAuthenticated";

import api from "../../../global/api"

async function get(req:IEmployyeAuthenticated, res:Response )
{
    try{    
        
      
        const apiRes = await api.get(`Data`)

        if(req.employee?.employeeRole.toString().toLowerCase() == "admin")
            return res.json(apiRes.data)
        else
            return res.json({
                ...apiRes.data
            })
    }
    catch(e:any)
    {
        console.log(e);
        if(e.response != null && e?.response?.status != null && e?.response?.data != null)
        {  
            return res
                .status(e?.response?.status)
                .json({
                    message:e.response.data
                })
        }
        
        return res.status(500).json({
            message:"app error"
        })
    }

    
}

export default {
    get
}