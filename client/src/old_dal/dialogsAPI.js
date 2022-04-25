import * as axios from 'axios'

const instance = axios.create({
    withCredentials: false,
    baseURL: 'http://192.168.1.51:5000/api/'
})

export const dialogsAPI = {
    receiveDialogs: async (token) => {
        
        const response = await instance.get('dialogs', {
            headers: {'Authorization': `Bearer ${token}`}
        })
        return response.data

    },
    createDialog: async (id, token) => {
        console.log(id)
        const response = await instance.post('dialogs/create', {id}, {
            headers: {'Authorization': `Bearer ${token}`}
        })
        return response.data
    },
    receiveDialogMessages: async (dialogId, token) => {
        console.log('доходит до апи')
        const response = await instance.get('dialogs/messages', {
            params: {id: dialogId},
            headers: {'Authorization': `Bearer ${token}`}
        })
        return response.data

    }

}