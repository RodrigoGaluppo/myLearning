import { Request,Response } from "express";
import jwt from "jsonwebtoken"
import api from "../../../global/api"
import path from "path"
import containerClient from "../../../services/azureStorage"
import ICustomerAuthenticated from "../../../global/ICustomerAuthenticated";
import mailSender from "../../../services/mailSender";
import tokenService from "../../../services/mongoDB/tokenService";

async function sendChangePasswordEmail(req:Request,res:Response){

    try{
        let {email}:{email:string} = req.body

        if(email == "" ){
            return res.status(400).json({
                message:"required parameters not supplied"
            })
        }

        const apiRes = await api.get(`customer/getCustomerByEmail/${email}`)

        if(!apiRes.data ){
            return res.status(500).json({
                message:"not found"
            })
        }
      
        const tokenId = await tokenService.createToken(apiRes.data?.id)

        await mailSender.sendChangePasswordEmail({
            name: String(apiRes.data?.firstName),
            email:String(apiRes.data?.email),
            tokenId
        })

        return res.json({
            message:"ok"
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

async function login(req:Request,res:Response){

    try{
        let {email,password}:{email:string,password:string} = req.body

        if(email == "" || password == ""){
            return res.status(400).json({
                message:"required parameters not supplied"
            })
        }

        email = email.toLowerCase()
        const JWTSECRET = process.env.JWTSECRET

        api.post("customer/login",{
            email,password
        })
        .then(async (response)=>{

            const {id,active,isConfirmed} = response.data

            if(!active){
                res.status(403)
                return res.json({"message":"your account is not active, it may be suspended"})
            }

            if(!isConfirmed){
                res.status(402)
                return res.json({"message":"your email has not been verified, check your mail box"})
            }

            if(JWTSECRET){
                jwt.sign({user_id:id},JWTSECRET,{subject:id,expiresIn:"1d"},
                (err,token)=>{

                    if(err){
                        return res.json({message:"internal server error"}).status(500)
                    }
                    
                    return res.json({
                        token,
                        customer:response.data
                    })
                })
                
            }else{
                
                return res.json({message:"internal server error"}).status(500)
            }
        })
        .catch((err)=>{
            
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

async function get(req:ICustomerAuthenticated, res:Response )
{
    try{    
    const id = req?.customer?.id

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

async function putImage(req:ICustomerAuthenticated, res:Response )
{
    try{    
        const id = req?.customer?.id

        if (id == "")
        {
            return res.status(400).json({
                message:"customer id is required"
            })
        }

        try{
            // delete last file 
            const responseData = await api.get(`/customer/${id}`) 

            const {imgUrl} = responseData.data // get last customer img name

            const lastFilName = path.basename(imgUrl)

            const blockBlobClient = containerClient.getBlockBlobClient(lastFilName);

            await blockBlobClient.deleteIfExists() // deletes if exist
        }
        catch(e){
            console.log(e);
            
        }
        
        const user = await api.put(`/customer/image/${id}`,{
            imgUrl:req.file?.filename // send the filename which is actually the url to access file
        })

        return res.json(user.data)

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

async function changeActiveStatus(req:ICustomerAuthenticated, res:Response )
{
    try{    

    const id = req?.customer?.id
    
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

async function changeConfirmedStatus(req:ICustomerAuthenticated, res:Response )
{
    try{    

    const id = req?.params?.id
    
    if (id == "" )
    {
        return res.status(400).json({
            message:"required parameters not supplied"
        })
    }
    
    const apiRes = await api.put(`customer/confirm/${id}`,{
        isConfirmed:true
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

async function put(req:ICustomerAuthenticated, res:Response )
{
    try{    

    const id = req?.customer?.id
    
    let {
        firstName,
        lastName,
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

    if (firstName == "" || lastName == ""  || username == "" || gender == "" || birthDate == "")
    {

        return res.status(400).json({
            message:"required parameters not supplied"
        })
    }

    const apiRes = await api.put(`customer/${id}`,{
        firstName,
        lastName,

        username,
        gender,
        birthDate
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

async function changePassword(req:Request, res:Response )
{
    try{    

    const tokenId = req.params.tokenId
    
    let {
        newPassword
    } = req.body

    if (newPassword == "" || tokenId == "")
    {
        return res.status(400).json({
            message:"you must provide token id and new password"
        })
    }

    const isTokenValid = await tokenService.isTokenValid(tokenId)

    if(!isTokenValid){
        return res.status(403).json({
            message:"invalid token"
        })
    }

    const customerId = await tokenService.getCustomerIdByTokenId(tokenId)
    
    const apiRes = await api.put(`customer/changePassword/${customerId}`,{
        Password:newPassword
    })

    await tokenService.setTokenUsed(tokenId)

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

async function list(req:ICustomerAuthenticated, res:Response )
{
    try{    

    const page = req.params.page
    
    if (page == null)
    {
        return res.status(400).json({
            message:"page is required"
        })
    }

    
    const apiRes = await api.get(`customer/list/?page=${page}`)

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



export default {
    post,
    login,
    get,
    changeActiveStatus,
    changeConfirmedStatus,
    changePassword,
    sendChangePasswordEmail,
    put
}