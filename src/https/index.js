import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});





// api endpoints
export const login = (data) => api.post("/api/user/login", data);
export const register = (data) => api.post("/api/user/register", data);
export const getUserData = () => api.get("/api/user");
export const logout = () => api.post("/api/user/logout");

// Table endpoints
export const addTable = (data) => api.post("/api/table/", data);
export const getTables = () => api.get("/api/table");
export const updateTable = () => api.put("/api/table", data); 

// payment endpoints
export const createOrderRazorpay = (data) => api.post("/api/payment/create-order", data);
export const verifyPaymentRazorpay = (data) => api.post("/api/payment/verify-payment", data);

// Order endpoints
export const addOrder = (data) => api.post("/api/order/", data);