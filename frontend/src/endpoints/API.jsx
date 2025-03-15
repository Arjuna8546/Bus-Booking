
 import axios from 'axios'

 const ADMIN_BASE_URL = "http://127.0.0.1:8000/api/admin/"
 const ADMIN_LOGIN_URL = `${ADMIN_BASE_URL}token/`
 const ADMIN_GETBUSSTOP_URL = `${ADMIN_BASE_URL}get-bus-stop/`
 const ADMIN_REGISTER_BUS_URL = `${ADMIN_BASE_URL}register-bus/`

 const BASE_URL = "http://127.0.0.1:8000/api/"
 const REGISTER_URL = `${BASE_URL}register/`
 const LOGIN_URL = `${BASE_URL}token/`
 const ROUTE_SELECT_URL = `${BASE_URL}route/`

 export const register = async(formData) =>{
    try {
        const res = await axios.post(
            REGISTER_URL,
            formData,
            {withCredentials: true} 
         )
         return res.data
    } catch (error) {
        console.log(error.response.data.detail)
    }       
 }

 export const login = async(formData) =>{
    try{
        const res = await axios.post(
            LOGIN_URL,
            formData,
            {withCredentials:true}
        )
        return { success: true, data: res.data };     
    }
    catch(error){
        return {
            success: false,
            error: error.response?.data?.detail || "Something went wrong",
        };
    }
 }

 export const adminLogin = async(formData) =>{
    try{
        const res = await axios.post(
            ADMIN_LOGIN_URL,
            formData,
            {withCredentials:true}
        )
        return { success: true, data: res.data };     
    }
    catch(error){
        
        return {
            success: false,
            error: error.response?.data?.message || "Something went wrong",
        };
    }
 }

 export  const getbusstop = async(place) =>{
    try{
        const res = await axios.get(
            ADMIN_GETBUSSTOP_URL,
            {params: { district: place },
            withCredentials:true}
        )
        return res.data.bus_stops;
    }
    catch(error){
        return error
    }
 }

 export const busregister = async(formData) =>{
    try {
        const res = await axios.post(
            ADMIN_REGISTER_BUS_URL,
            formData,
            {withCredentials: true} 
         )
         return res.data
    } catch (error) {
        console.log(error.response.data.detail)
    }       
 }

 export const getAllBus = async()=>{
    try{
        const res = await axios.get(
            ADMIN_REGISTER_BUS_URL,
            {withCredentials:true}
        )
        return res.data
    }
    catch(error){
        return (error)
    }
 }

 export const routeSelect = async(id)=>{
    try{
        const res = await axios.get(
            ROUTE_SELECT_URL,
            {
                params: { id: id },
                withCredentials:true
            }
        )
        return res.data
    }
    catch(error){
        return error
    }
 }

 const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYXJqdW5hY2hhbmRyYW52diIsImEiOiJjbTg5cHNpZ2MwMzdjMmxyMHNjcjRsMWJoIn0.OldnwVWzWiJ5ZdWr9-1Vwg";

 export const getRoadDistance = async (start, end) => {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?access_token=${MAPBOX_ACCESS_TOKEN}&geometries=geojson`;
  
      const response = await axios.get(url);
      const distanceInMeters = response.data.routes[0].distance; // Distance in meters
      const distanceInKm = (distanceInMeters / 1000).toFixed(2); // Convert to km
  
      return distanceInKm;
    } catch (error) {
      console.error("Error fetching road distance:", error);
      return null;
    }
  };