import Mux from '@mux/mux-node';
import path from "path"
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }) // get env variables

if(process.env.MUXDEVTOKEN == undefined || process.env.MUXDEVKEY == undefined)  // mux credentials
{
    
    throw new Error("Mux dev variables are unset");
    
}

const { Video, Data } = new Mux(process.env.MUXDEVTOKEN, process.env.MUXDEVKEY);

export default{
    Video, Data 
}
