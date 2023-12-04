import { Request,Response } from "express";
import api from "../../../global/api"
import ICustomerAuthenticated from "../../../global/ICustomerAuthenticated";
import IAuthenticatedInterface from "../../../global/ICustomerAuthenticated";


async function get(req:IAuthenticatedInterface, res:Response )
{
    try{    
        const id = req.params.id
        const {courseId} = req.query
        const customerId = req.customer?.id

        if (id == "" || customerId == "" )
        {
            return res.status(400).json({
                message:"chapter, course id and customer id are required"
            })
        }

        const customerCourseRes = await api.get(`customercourse/getbycustomerId?customerId=${customerId}&courseId=${courseId}`)

        if(customerCourseRes !== null)
        {
            
            const apiRes = await api.get(`chapter/${id}`)
           
            
            return res.json(apiRes.data)

        }else{
            throw new Error("you can not access this course")
        }
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

    const courseId = req.params.courseId
    const page = req.query.page
    
    if (page == null)
    {
        return res.status(400).json({
            message:"page is required"
        })
    }
    
    const apiRes = await api.get(`chapter/listbyCourseId/${courseId}?page=${page}`)

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