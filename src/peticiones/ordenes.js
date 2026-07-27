import axios from "axios";
// const apiUrl= axios.create({
//     origin: 'http://localhost:3000',
//   credentials: true,
//     baseURL:"https://mockme.mockapi.dog",
//     withCredentials:true,
//     headers:{
//          "Accept": "application/json; odata=verbose",
//          "Content-Type": "application/json"
//     },
//     AccessControlAllowCredentials:true,
// })
//const axios = require("axios");
export const obtenerOrdenes= async() => {
    try {
        const res= await axios.get("https://mockme.mockapi.dog/orders");
        return res;
    } catch (error) {
        return error;
    }
       
}