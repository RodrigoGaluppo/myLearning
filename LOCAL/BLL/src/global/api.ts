import axios from "axios"

const api = axios.create({

    // base url for all requests

    baseURL:"http://localhost:5000/" ,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

export default api