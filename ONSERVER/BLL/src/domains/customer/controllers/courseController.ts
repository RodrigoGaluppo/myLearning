import { Request,Response } from "express";
import api from "../../../global/api"
import ICustomerAuthenticated from "../../../global/ICustomerAuthenticated";
import IAuthenticatedInterface from "../../../global/ICustomerAuthenticated";

// method to load user's course page
async function get(req:IAuthenticatedInterface, res:Response )
{
    try{    
        const id = req.params.id
        const customerId = req.customer?.id

        if (id == "" || customerId == "" )
        {
            return res.status(400).json({
                message:"course id and customer id are required"
            })
        }

        const customerCourseRes = await api.get(`customercourse/getbycustomerId?customerId=${customerId}&courseId=${id}`) // verify if user has access to this course

        const getAccomplishedLessons = await api.get(`AccomplisehdLesson/listAccomplishedLesson?customerId=${customerId}&courseId=${id}`) // get accomplisehd and lessons count
                
        if(customerCourseRes !== null)
        {
            const apiRes = await api.get(`course/${id}`)
            return res.json({...apiRes.data,...getAccomplishedLessons.data, customerCourseId:customerCourseRes.data.id})
        }
        else{
            throw new Error()
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

// method to delist user's course
async function del(req:IAuthenticatedInterface, res:Response )
{
    try{    
        const id = req.params.id
        const customerId = req.customer?.id

        if (id == "" || customerId == "" )
        {
            return res.status(400).json({
                message:"course id and customer id are required"
            })
        }

        const customerCourseRes = await api.delete(`customercourse?customerId=${customerId}&courseId=${id}`) // verify if user has access to this course
       
        return res.json(customerCourseRes.data)
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

    let searchString = search !== "" && search !== "null" ? `course/listbyCustomer?page=${page}&customerId=${req.customer?.id}&search=${search}` : `course/listbyCustomer?page=${page}&customerId=${req.customer?.id}`

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

// method to roll user to course
async function post(req:IAuthenticatedInterface, res:Response )
{
    try{    

        const courseId = req.body.courseId
        const customerId = req.customer?.id
       
        if (courseId == "" || customerId == "" )
        {
            return res.status(400).json({
                message:"course id and customer id are required"
            })
        }

        const customerCourse = await api.post(`customerCourse`,{
            CustomerId:customerId,
            CourseId:courseId
        }) 
                
        return res.json({...customerCourse.data})
   
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