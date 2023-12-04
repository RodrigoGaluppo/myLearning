import axios from "axios"


const api = axios.create({
    //https://my--menu.herokuapp.com/
    baseURL:"http://localhost:4000" + "/customer/" ,
})

export default api