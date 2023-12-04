import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

const { extname,resolve } = require("path")

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export default {
    fileFilter:(req:Request,file:Express.Multer.File,cb:any)=>{
        
        if(file.mimetype !== "video/mp4" )
        {
            return cb(new multer.MulterError("LIMIT_FIELD_KEY"))
        }
        return cb(null,true)
    }
    /*
    storage: multer.diskStorage({
        
        destination:(req,file,cb)=>{
            cb(null,resolve(__dirname,"..","..","uploads"))
        },
        filename:(req,file,cb)=>{
            const {id} = req.user
            cb(null, `${id}_${Date.now()}${extname(file.originalname)}`  )
        }
    })
    */
    
}