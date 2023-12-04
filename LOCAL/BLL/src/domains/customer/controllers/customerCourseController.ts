import { Request,Response } from "express";
import api from "../../../global/api"
import ICustomerAuthenticated from "../../../global/ICustomerAuthenticated";


async function get(req:Request, res:Response )
{
    try{    
    const id = req.params.id

    if (id == "")
    {
        return res.status(400).json({
            message:"customerCourse id is required"
        })
    }
        const apiRes = await api.get(`customerCourse/${id}`)

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

async function list(req:ICustomerAuthenticated, res:Response )
{
    try{    

    const customerid = req.customer?.id
    const page = req.query.page
    
    if (page == null)
    {
        return res.status(400).json({
            message:"page is required"
        })
    }

    
    const apiRes = await api.get(`customerCourse/list/${customerid}?page=${page}`)

    return res.json(apiRes.data)

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
    get,
    list
}