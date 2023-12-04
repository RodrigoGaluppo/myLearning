import axios from "axios"


const api = axios.create({
    baseURL:"https://mylearning.icu/employee/" ,
})

export default api