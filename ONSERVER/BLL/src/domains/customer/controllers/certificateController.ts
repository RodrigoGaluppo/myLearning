import { Request,Response } from "express";
import api from "../../../global/api"
import ICustomerAuthenticated from "../../../global/ICustomerAuthenticated";
import appErrorMessages from "../../../global/appErrorMessages";
import PdfGenerator from "../../../services/PdfGenerator";
import path from "path"
import containerClient from "../../../services/azureStorage"


async function get(req:Request, res:Response )
{
    try{    
    const id = req.params.id

    if (id == "")
    {
        return res.status(400).json({
            message:"certificate id is required"
        })
    }
        const apiRes = await api.get(`certificate/${id}`)

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

    const page = req.query.page
    
    if (page == null)
    {
        return res.status(400).json({
            message:"page is required"
        })
    }

    
    const apiRes = await api.get(`certificate/list?page=${page}`)

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

async function post(req:ICustomerAuthenticated, res:Response )
{
    try{    
        
        const {
            customercourseId
            
            } = req.body

          
        if (customercourseId == "") // verify if body has the needed parameters
        {
            return res.status(400).json({
                message:appErrorMessages.parametersError
            })
        }
        

        const apiRes = await api.get(`customerCourse/${customercourseId}`)

    
        const {
            courseId
        } = apiRes.data // get customerId and CourseId

        
        const getUser = await api.get(`customer/${req.customer?.id}`) // get user's info to fill certificate

        const getCourse = await api.get(`course/${courseId}`) // get course's info

        const {name} = getCourse.data

        const {firstName, lastName} = getUser.data
        const now = new Date()

        let pdfStream = await PdfGenerator({
            user: firstName + " " + lastName,
            course:name,
            date: `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`
        });     // get srtrem of pdf file generated   

        if(pdfStream == undefined)
            throw new Error("could not generate html");

        const blockBlobClient = containerClient.getBlockBlobClient(`certificate-${now.getTime()}.html`);
        // upload to azure blob storage
        blockBlobClient.uploadStream(pdfStream)
        .then(async uploadResult=>{
            
            if (uploadResult.errorCode) {
                throw new Error("could not upload file")
            }

            try{ // try to delete last pdf file if exists
              
                const responseData = await api.get(`/certificate/${customercourseId}`)
    
                const {url} = responseData.data
    
                const lastFilName = path.basename(url)
    
                const lastBlobClient = containerClient.getBlockBlobClient(lastFilName) // get client of last pdf file
            
                await lastBlobClient.deleteIfExists() // delete it
            }
            catch(e){
                console.log(e);
            }

            const url = blockBlobClient.url;
            
            const apiRes = await api.post(`certificate`,{
                customercourseId,
                url
            })

    
            return res.json(apiRes.data)

        
        })
        .catch((err)=>{
            console.log(err);
            
            return res.status(500).json({message:"could not upload file"})
        })

    
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
        console.log(e);
        
        return res.status(500).json({
            message:"app error"
        })
    }

    
}

export default {
    get,
    post
}