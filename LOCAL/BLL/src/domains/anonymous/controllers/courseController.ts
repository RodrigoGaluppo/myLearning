import { Request,Response } from "express";
import api from "../../../global/api"
import ICustomerAuthenticated from "../../../global/ICustomerAuthenticated";


async function get(req:Request, res:Response )
{

    const {id} = req.params
    try{   
        const apiRes = await api.get(`course/${id}`)
         
        return res.json({...apiRes.data})

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

async function list(req:ICustomerAuthenticated, res:Response )
{
    
    
    try{    
    const page = req.query.page
    const search = req.query.search

    
    

    if (page == "")
    {
        return res.status(400).json({
            message:"page id is required"
        })
    }

        let searchString = !!search && search != "null" ? `course/list?page=${page}&search=${search}` : `course/list?page=${page}`
    
        
        const apiRes = await api.get(searchString)

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
    get,list
}