import { Request,Response } from "express";
import api from "../../../global/api"
import ICustomerAuthenticated from "../../../global/ICustomerAuthenticated";
import IAuthenticatedInterface from "../../../global/ICustomerAuthenticated";

async function del(req:IAuthenticatedInterface, res:Response )
{
    try{    
        
        const id = req.params.id

        if (id == "")
        {
            return res.status(400).json({
                message:"lesson id is required"
            })
        }
        
        const apiRes = await api.delete(`AccomplisehdLesson/${req.customer?.id}/${id}`)
        
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

async function get(req:IAuthenticatedInterface, res:Response )
{
    try{    
        
        const id = req.params.id
        const {courseId} = req.query
        const customerId = req.customer?.id
        
        if (id == "")
        {
            return res.status(400).json({
                message:"lesson id is required"
            })
        }
        
        const customerCourseRes = await api.get(`customercourse/getbycustomerId?customerId=${customerId}&courseId=${courseId}`)

        if(customerCourseRes !== null)
        {
          
            const apiRes = await api.get(`lesson/${id}?customerId=${req.customer?.id}`)
            
            return res.json(apiRes.data)

        }else{
            throw new Error("you can not access this course")
        }
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

async function post(req:ICustomerAuthenticated, res:Response){
    try{    
        
       
        const id = req.body.id

        if (id == "")
        {
            return res.status(400).json({
                message:"lesson id is required"
            })
        }
        
        const apiRes = await api.post(`AccomplisehdLesson`,{
            CustomerId:req.customer?.id,
            LessonId:id
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

async function list(req:ICustomerAuthenticated, res:Response )
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



export default {
    get,list,post,del
}