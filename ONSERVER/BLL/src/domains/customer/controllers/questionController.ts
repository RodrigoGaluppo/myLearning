import { Request,Response } from "express";
import api from "../../../global/api"
import ICustomerAuthenticated from "../../../global/ICustomerAuthenticated";
import IAuthenticatedInterface from "../../../global/ICustomerAuthenticated";

async function post(req:IAuthenticatedInterface, res:Response )
{
    try{
        const {courseId,title,content} = req.body
        const customerId = req.customer?.id
        
        if (courseId == "" || content == "" || title == "")
        {
            return res.status(400).json({
                message:"courseId, content and title are required"
            })
        }

        const responseQUestion = await api.post("question",{
            Title:title,
            Content:content,
            CustomerId:customerId,
            CourseId:courseId
        })
        
        return res.json(responseQUestion.data)
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

async function get(req:IAuthenticatedInterface, res:Response )
{
    try{    
        const id = req.params.id
        const customerId = req.customer?.id

        if (id == "" || customerId == "" )
        {
            return res.status(400).json({
                message:"question id and customer id are required"
            })
        }

        const questionRes = await api.get(`question/${id}`) // verify if user has access to this course

        return res.json(questionRes.data)
       
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

async function del(req:IAuthenticatedInterface, res:Response )
{
    try{    
        const id = req.params.id
        const customerId = req.customer?.id

        if (id == "" || customerId == "" )
        {
            return res.status(400).json({
                message:"question id and customer id are required"
            })
        }

        const questionRes = await api.delete(`question/${id}`) // verify if user has access to this course

        return res.json(questionRes.data)
       
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
    const courseId = req.query.courseId

        if (page == "" || courseId == "")
        {
            return res.status(400).json({
                message:"page id is required"
            })
        }


        let searchString = !!search && search != "null" ? `question/list?page=${page}&search=${search}&courseId=${courseId}` 
        : `question/list?page=${page}&courseId=${courseId}`
    
        
        
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
    get,list,post,del
}