import { Request,Response } from "express";
import api from "../../../global/api"

async function get(req:Request, res:Response )
{
    try{    
        const id = req.params.id
        const {courseId} = req.query

        if (id == "" || courseId == "" )
        {
            return res.status(400).json({
                message:"chapter, course id and customer id are required"
            })
        }

        const apiRes = await api.get(`chapter/${id}`)
           
            
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

async function list(req:Request, res:Response )
{
    try{    

    const courseId = req.params.courseId
    const page = req.query.page
    
    if (page == null)
    {
        return res.status(400).json({
            message:"page is required"
        })
    }

    
    const apiRes = await api.get(`chapter/list/${courseId}?page=${page}`)

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