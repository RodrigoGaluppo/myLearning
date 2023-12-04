import axios from "axios"


const api = axios.create({
    //https://my--menu.herokuapp.com/
    baseURL:"https://mylearning.icu/anonymous/" ,
})

export default api