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
            message:"lesson id is required"
        })
    }
        const apiRes = await api.get(`lesson/${id}`)

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

async function list(req:Request, res:Response )
{
    try{    

    const chapterId = req.params.chapterId
    const page = req.query.page
    
    if (page == null)
    {
        return res.status(400).json({
            message:"page is required"
        })
    }

    
    const apiRes = await api.get(`lesson/list/${chapterId}?page=${page}`)

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
            message:"lesson id is required"
        })
    }
        const apiRes = await api.delete(`lesson/${id}`)

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
        title,
        description
    } = req.body
    const id = req.params.id

    if (id == "")
    {
        return res.status(400).json({
            message:"lesson id is required"
        })
    }

    if (title == ""  || description == "")
    {
        return res.status(400).json({
            message:appErrorMessages.parametersError
        })
    }

    const apiRes = await api.put(`lesson/${id}`,{
        title,
        description
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
        chapterId,
        title,
        description
    } = req.body

    if (title == "" || chapterId == "" || description == "")
    {
        return res.status(400).json({
            message:appErrorMessages.parametersError
        })
    }

    const apiRes = await api.post(`lesson`,{
        chapterId,
        title,
        description
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
    list,
    post,
    del
}