import axios from 'axios'

const Api = axios.create({baseURL: "https://serve-loja.herokuapp.com"})


export default Api