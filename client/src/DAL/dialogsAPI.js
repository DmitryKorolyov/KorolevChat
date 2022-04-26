export const dialogsAPI = {
    baseURL: "http://192.168.1.51:5000/api/",
    receiveDialogs: async function(token){
        const response = await fetch(`${this.baseURL}dialogs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return await response.json()
    },
    createDialog: async function(id, token){
        const response = await fetch(`${this.baseURL}dialogs/create`, {
            method: 'POST',
            body: JSON.stringify({id}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return response.json()
        
    },
    receiveDialogMessages: async function(dialogId, token){
        const response = await fetch(`${this.baseURL}dialogs/messages?${new URLSearchParams({id: dialogId})}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return response.json()
    }

}