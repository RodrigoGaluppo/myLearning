import { NextFunction, Request, Response } from "express"

import multer from "multer"
import multerConfig from "../global/multerConfigImg"
const upload = multer(multerConfig)
import sharp from "sharp"
import containerClient from "../services/azureStorage"


// middleware to handle image file requests

export default async (req:Request,res:Response,next:NextFunction)=>{

    const uploadSingle = upload.single("img")

    const id = req.body

    return uploadSingle(req,res,(errors)=>{
        if(errors || req.file == null)
        {
            return res.status(400).json({
                error:[errors]
            })
        }
        else
        {
            
            const fileName = `${new Date().getTime()}-${req.file.originalname}`

            /* resizing image */
            const sharpStream = sharp(req.file.buffer)
            .resize(800,800)
           
            if(req.file == null)
                throw new Error("file is not present")
                    
            const blobName = fileName; // replace with your desired blob name
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            
            blockBlobClient.uploadStream(
                sharpStream, // stream from sharp
            )
            .then(uploadResult=>{
            
                if (uploadResult.errorCode) {
                    throw new Error("could not upload file")
                }

                if(req.file == null)
                    throw new Error("could not upload file")
    
                req.file.filename = blockBlobClient.url;
                next();  
            })
            .catch((err)=>{
                console.log(err);
                
                return res.status(500).json({message:"could not upload file"})
            })
                
            
        }

        
    })
}

