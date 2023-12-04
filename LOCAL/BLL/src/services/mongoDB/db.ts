
import mongoose,{Document,Schema,model} from 'mongoose';
import path from "path"
import {v4} from "uuid"
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }) // get env variables

// interface to document is the type used on program
 export interface IToken{
    tokenId:string,
    used:boolean,
    customerId:string,
    timeStamp:number
  }

  // interface to schema is the "blueprint" of table on mongodb
  const TokenSchema = new Schema({
    tokenId:{
        type:String,
        default:v4()
    },
    used:{
      type:Boolean,
      default:false
    },
    customerId:String,
    timeStamp: {
      type: Number,
      default: Date.now()
    }
  });

  export interface ITokenDocument extends IToken, Document {}
  export const tokenModel = model<ITokenDocument>(String(process.env.MONGODBCOLLECTIONTOKEN), TokenSchema);




    

    
  
