import { Request,Response } from "express";

import api from "../../../global/api"
import appErrorMessages from "../../../global/appErrorMessages";

async function get(req:Request, res:Response )
{
    try{    
    const id = req.params.id

    if (id == "")
    {
        return res.status(400).json({
            message:"rerourceLesson id is required"
        })
    }
        const apiRes = await api.get(`rerourceLesson/${id}`)

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


async function del(req:Request, res:Response )
{
    try{    
    const id = req.params.id

    if (id == "")
    {
        return res.status(400).json({
            message:"rerourceLesson id is required"
        })
    }
    const apiRes = await api.delete(`resourceLesson/${id}`)

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

async function put(req:Request, res:Response )
{
    try{    

    const {
        lessonId,
        title,
        link 
      } = req.body
    const id = req.params.id

    if (id == "")
    {
        return res.status(400).json({
            message:"course id is required"
        })
    }

    if (title == "" || lessonId == "" || link == "")
    {
        return res.status(400).json({
            message:appErrorMessages.parametersError
        })
    }

    const apiRes = await api.put(`ressourceLesson`,{
        lessonId,
        title,
        link 
        })

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

async function post(req:Request, res:Response )
{
    try{    
    const {
        lessonId,
        title,
        link 
      } = req.body

    if (title == "" || lessonId == "" || link == "")
    {
        return res.status(400).json({
            message:appErrorMessages.parametersError
        })
    }

    const apiRes = await api.post(`resourceLesson`,{
        LessonId:lessonId,
        Title:title,
        Link:link 
    })

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
    get,
    put,
 
    post,
    del
}