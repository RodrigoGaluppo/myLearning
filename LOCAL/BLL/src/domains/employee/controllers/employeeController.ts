import { Request,Response } from "express";
import jwt from "jsonwebtoken"
import api from "../../../global/api"
import IEmployeeAuthenticated from "../../../global/IEmployeeAuthenticated";
import appErrorMessages from "../../../global/appErrorMessages";


async function login(req:Request,res:Response){

    try{
        let {email,password}:{email:string,password:string} = req.body

        if(email == "" || password == ""){
            return res.status(400).json({
                message:appErrorMessages.parametersError
            })
        }

        email = email.toLowerCase()
        const JWTSECRET = process.env.JWTSECRET

        api.post("employee/login",{
            email,password
        })
        .then((response)=>{

            const {id} = response.data
            
            if(JWTSECRET){
                jwt.sign({user_id:id},JWTSECRET,{subject:id,expiresIn:"1d"},
                (err,token)=>{

                    if(err){
                        return res.json({message:"internal server error"}).status(500)
                    }
                    
                    return res.json({
                        token,
                        employee:response.data
                    })
                })
                
            }else{
                
                return res.json({message:"internal server error"}).status(500)
            }
        })
        .catch((err)=>{
            console.log(err);
            
            if(err.response.status == 400)
            {
                res.status(400)
                return res.json({"message":err.response.data})
            }
            else{
                res.status(500)
                return res.json({"message":"could not connect to the server"})
            }
        })

    }
    catch(e:any){
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

async function get(req:IEmployeeAuthenticated, res:Response )
{
    try{    

        const employeeRole = req.employee?.employeeRole

        if(employeeRole == undefined){
            return res.status(400).json({
                message:appErrorMessages.parametersError
            })
        }

        const {id} = req.params

        if (id == "")
        {
            return res.status(400).json({
                message:"employee id is required"
            })
        }


        const apiRes = await api.get(`employee/${id}`)

        if( employeeRole <= apiRes.data.employeeroleId){
            return res.status(400).json({
                message:appErrorMessages.permissionError
            })
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

async function del(req:IEmployeeAuthenticated, res:Response )
{
    try{    


        const {id} = req.params

        if (id == "")
        {
            return res.status(400).json({
                message:"employee id is required"
            })
        }
       
        

        if(id == req.employee?.id){
            return res.status(400).json({
                message:"you can not delete yourself"
            })
        }



        const apiRes = await api.delete(`employee/${id}`)

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

async function put(req:IEmployeeAuthenticated, res:Response )
{
    try{    

        const {id} = req.params
        
        let {
            name,
            email,
            employeeRole,
            gender,
            birthDate,
        
        } = req.body


        if (name == "" || email == "" || employeeRole == "" || gender == "" || birthDate == "" || id == "")
        {

            return res.status(400).json({
                message:appErrorMessages.parametersError
            })
        }

        if(id == req.employee?.id && employeeRole != req.employee.employeeRole){
            return res.status(400).json({
                message:"can not change your own role"
            })
        }
        
     
        const apiRes = await api.put(`employee/${id}`,{
            Name:name,
            Email:email,
            EmployeeRole:employeeRole,
            Gender:gender,
            Birthdate:birthDate
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

async function list(req:IEmployeeAuthenticated, res:Response )
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
      
        let searchString = search !== "" && search !== "null" ? `employee/list?page=${page}&search=${search}` : `employee/list?page=${page}`
   
    
    
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

async function post(req:IEmployeeAuthenticated, res:Response )
{
    try{ 
        
        
        let {
         
            name,
            email,
            password,
            gender,
            birthDate,
            employeeRole
        } = req.body

        if ( name == "" || email == ""  || password == "" || gender == "" || birthDate == "" || employeeRole == "")
        {

            return res.status(400).json({
                message:appErrorMessages.parametersError
            })
        }

            const apiRes = await api.post("employee",
                {
                    Name:name,
                    Email:email,
                    Password:password,
                    Gender:gender,
                    BirthDate:birthDate,
                    EmployeeRole:employeeRole
                }
            )

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
    post,
    login,
    get,
    put,
    list,
    del
}