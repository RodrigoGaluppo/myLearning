import { Request,Response } from "express";

import api from "../../../global/api"


async function list(req:Request, res:Response )
{
    try{    

    const apiRes = await api.get(`employeeRole/list/`)

    return res.json(apiRes.data)

    }
    catch(e:any)
    {
        
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
    list
}