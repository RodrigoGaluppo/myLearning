import {Request} from "express"

export default interface IAuthenticatedInterface extends Request{
    customer?:{
        id:string | (() => string); 
    }
}