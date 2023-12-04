import { Request,Response } from "express";

import api from "../../../global/api"

async function get(req:Request, res:Response )
{
    try{    
        const id = req.params.id

        if (id == "")
        {
            return res.status(400).json({
                message:"textLesson id is required"
            })
        }
        
        const apiRes = await api.get(`textLesson/${id}`)

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
                message:"textLesson id is required"
            })
        }

        
        const apiRes = await api.delete(`textLesson/${id}`)

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

async function put(req:Request, res:Response )
{
    try{    

    const {
        lessonId,
        title,
        content 
      } = req.body
    const id = req.params.id

    if (id == "")
    {
        return res.status(400).json({
            message:"id is required"
        })
    }

    if (title == "" || lessonId == "" || content == "")
    {
        return res.status(400).json({
            message:"required parameters not supplied"
        })
    }

    const apiRes = await api.put(`ressourceLesson`,{
        lessonId,
        title,
        content 
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
        content 
      } = req.body

    if (title == "" || lessonId == "" || content == "")
    {
        return res.status(400).json({
            message:"required parameters not supplied"
        })
    }

    const apiRes = await api.post(`textLesson`,{
        LessonId:lessonId,
        Title:title,
        Content:content 
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