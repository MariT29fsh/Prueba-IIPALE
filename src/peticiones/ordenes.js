import axios from "axios";

export const obtenerOrdenes= async() => {
    try {
        const res= await axios.get("https://mockme.mockapi.dog/orders");
        return res;
    } catch (error) {
        return error;
    }
       
}