import { Request,Response } from "express";

import api from "../../../global/api"

async function get(req:Request, res:Response )
{
    
    try{    
    const id = req.params.id
       
        
    if (id == "")
    {
        return res.status(400).json({
            message:"subject id is required"
        })
    }
        const apiRes = await api.get(`subject/${id}`)

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
        
    const page = req.query.page
    const search = req.query.search
    
    
    if (page == null)
    {
        return res.status(400).json({
            message:"page is required"
        })
    }

    let searchString = !!search && search != "null" ? `subject/list/?page=${page}&search=${search}` : `subject/list/?page=${page}` 
    
    const apiRes = await api.get(searchString)

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
            message:"subject id is required"
        })
    }
        const apiRes = await api.delete(`subject/${id}`)

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
        name,

      } = req.body
    const id = req.params.id
   
    if (id == "")
    {
        return res.status(400).json({
            message:"subject id is required"
        })
    }

    if (name == "" )
    {
        return res.status(400).json({
            message:"required parameters not supplied"
        })
    }

    const apiRes = await api.put(`subject/${id}`,{
        name,

        })
        
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

async function post(req:Request, res:Response )
{
    try{    
    const {
        name,

      } = req.body

    if (name == "" )
    {
        return res.status(400).json({
            message:"required parameters not supplied"
        })
    }

    const apiRes = await api.post(`subject`,{
        name,
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