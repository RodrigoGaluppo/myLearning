import { NextFunction, Request, Response } from "express"
import fs from "fs"
import multer from "multer"
import multerConfig from "../global/multerConfigVideo"
const upload = multer(multerConfig)
import stream from "stream"
import Mux from "../services/Mux"
import api from "../global/api"

import containerClient from "../services/azureStorage"
import sharp from "sharp"

const { extname,resolve } = require("path")

// middleware to handle video file requests

export default async (req:Request,res:Response,next:NextFunction)=>{

    const uploadSingle = upload.single("video")

    return uploadSingle(req,res,async (errors)=>{
        if(errors || req.file == null)
        {
            return res.status(400).json({
                error:[errors]
            })
        }
        else
        {
            /*
            let upload = await Mux.Video.Uploads.create({
                new_asset_settings: { 
                    playback_policy: 'public' 
                },
            });

            await fetch(upload.url, { method: 'PUT', body: req.file.buffer });
                        
            // The upload may not be updated immediately, but shortly after the upload is finished you'll get a `video.asset.created` event and the upload will now have a status of `asset_created` and a new `asset_id` key.
            let updatedUpload:any = await Mux.Video.Uploads.get(upload.id);

            
            // Or you could decide to go get additional information about that new asset you created.
            let asset = await Mux.Video.Assets.get(updatedUpload['asset_id']);

            
            

            if(asset == undefined){
                
                return res.status(500).json({
                    message:"could not upload file"
                })
            }
            
            if(asset?.playback_ids == undefined)
            {
                return res.status(500).json({
                    message:"could not upload file"
                })
            }

            if(asset.playback_ids[0].id == undefined){
                
                return res.status(500).json({
                    message:"could not upload file"
                })
            }

            /*
            try{    
                const id = req.params.id
            
                if (id == "")
                {
                    return res.status(400).json({
                        message:"videoLesson id is required"
                    })
                }
                
                const apiRes = await api.get(`videoLesson/${id}`)
        
                const {url} = apiRes.data


                // TO DO DELETE OLD VIDEO
            
            }

            catch(e:any)
            {
                
                console.log(e);
                
              
            }

            req.file.filename = `https://stream.mux.com/${asset.playback_ids[0].id}.m3u8`
            next();
*/
        const fileName = `${new Date().getTime()}-${req.file.originalname}`

        const videoStream = new stream.Readable({
            read() {
              this.push(req.file?.buffer); // push buffer into stream
              this.push(null); // signal the end of stream
            }
        });

        if(req.file == null)
            throw new Error("file is not present")
                
        const blobName = fileName; // replace with your desired blob name
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        blockBlobClient.uploadStream(
           videoStream, // stream from sharp
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

