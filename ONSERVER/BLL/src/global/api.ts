import axios from "axios"

const api = axios.create({

    // base url for all requests

    baseURL:"http://10.0.2.4/" ,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

export default api