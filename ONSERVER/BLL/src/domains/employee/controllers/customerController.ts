import { Request,Response } from "express";
import api from "../../../global/api"
import IEmployyeAuthenticated from "../../../global/IEmployeeAuthenticated";
import mailSender from "../../../services/mailSender";


async function get(req:IEmployyeAuthenticated, res:Response )
{
    try{    
    const id = req?.params?.id

    if (id == "")
    {
        return res.status(400).json({
            message:"customer id is required"
        })
    }
        const apiRes = await api.get(`customer/${id}`)

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

    let {
        firstName,
        lastName,
        email,
        username,
        password,
        gender,
        birthDate
    } = req.body

    if (firstName == "" || lastName == "" || email == "" || username == "" || password == "" || gender == "" || birthDate == "")
    {

        return res.status(400).json({
            message:"required parameters not supplied"
        })
    }

        const apiRes = await api.post("customer",
        {
            firstName,
            lastName,
            email,
            username,
            password,
            gender,
            birthDate
        }
        )

        // send confirmation email
        try{
            await mailSender.sendVerifyEmail({
                name:firstName,
                email,
                id:apiRes.data.id
            })
        }catch(err){
            console.log(err);
            
        }

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

async function del(req:IEmployyeAuthenticated, res:Response )
{
    try{    
        const id = req.params.id

        if (id == "")
        {
            return res.status(400).json({
                message:"customer id is required"
            })
        }
        
        const apiRes = await api.delete(`customer/${id}`)

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

async function changeActiveStatus(req:Request, res:Response )
{
    try{    

        const {id} = req.params
    
        let {
            active
        } = req.body

        if (id == "" || active == null)
        {
            return res.status(400).json({
                message:"required parameters not supplied"
            })
        }
        
        const apiRes = await api.put(`customer/active/${id}`,{
            active
        })

        try{
            if(!!active){
                await mailSender.sendEnabledAccountEmail({
                    email:apiRes?.data?.email,
                    name:apiRes?.data?.firstName
                })
            }
            else{
                await mailSender.sendSuspendedAccountEmail({
                    email:apiRes?.data?.email,
                    name:apiRes?.data?.firstName
                })
            }
        }
        catch{
            console.log("could not send email");
            
        }

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

async function put(req:IEmployyeAuthenticated, res:Response )
{
    try{    

    const id = req?.params.id
    
    let {
        firstName,
        lastName,
        email,
        username,
        gender,
        birthDate
    } = req.body

    if (id == "")
    {
        return res.status(400).json({
            message:"customer id is required"
        })
    }

    if (firstName == "" || lastName == "" || email == "" || username == "" || gender == "" || birthDate == "")
    {

        return res.status(400).json({
            message:"required parameters not supplied"
        })
    }

    const apiRes = await api.put(`customer/${id}`,{
        firstName,
        lastName,
        email,
        username,
        gender,
        birthDate
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

async function list(req:IEmployyeAuthenticated, res:Response )
{
    try{    
        
        
        const page = req.query.page
        const search = req.query.search

        if (page == "" )
        {
            return res.status(400).json({
                message:"page  is required"
            })
        }
      
        let searchString = search !== "" && search !== "null" ? `customer/list?page=${page}&search=${search}` : `customer/list?page=${page}`
   
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

export default {
    list,
    get,
    del,
    changeActiveStatus,
    post,
    put
}