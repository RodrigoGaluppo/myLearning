import { Request,Response } from "express";
import api from "../../../global/api"
import ICustomerAuthenticated from "../../../global/ICustomerAuthenticated";
import IAuthenticatedInterface from "../../../global/ICustomerAuthenticated";

async function post(req:IAuthenticatedInterface, res:Response )
{
    try{
        const {questionId,content} = req.body
        const customerId = req.customer?.id
        
        if (questionId == "" || content == "")
        {
            return res.status(400).json({
                message:"questionId and content is required"
            })
        }

        const responseComment = await api.post("comment",{
            Content:content,
            CustomerId:customerId,
            QuestionId:questionId
        })

        return res.json(responseComment.data)
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

export default{
    post
}