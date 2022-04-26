export const authorizeAPI = {
    baseURL: "http://192.168.1.51:5000/api/",
    register: async function(email, password){
        const response = await fetch(`${this.baseURL}auth/register`, {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return await response.json()
    },
    login: async function (email, password){
        const response = await fetch(`${this.baseURL}auth/login`,{
            method: 'POST', 
            body: JSON.stringify({email, password}),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return await response.json()
    }
    
}