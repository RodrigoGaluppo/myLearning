import {Request} from "express"

export default interface IAuthenticatedInterface extends Request{
    employee?:{
        id:string | (() => string);
        employeeRole: string | (() => string);
    }
}