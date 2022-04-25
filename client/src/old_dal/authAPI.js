import * as axios from 'axios'
import raiseErrorCreator from '../redux/errorReducer'



const instance = axios.create({
    withCredentials: false,
    baseURL: 'http://192.168.1.51:5000/api/'
})

// instance.interceptors.response.use(
//     response => {
//       debugger
//       return response
//     },
//     error => {
//       debugger
//       return error
//     }
//   )


export const authorizeAPI = {
    register: async (email, password) => {
        
        const response = await instance.post('auth/register', {email, password})
        return response.data
    },
    login: async (email, password) => {
      try{
              const response = await instance.post('auth/login', {email, password})
              return response.data
        } catch (error) {
          debugger
        }
    }
    
}