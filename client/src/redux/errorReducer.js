const CLEAR_ERROR = 'CLEAR_ERROR'
const RAISE_ERROR = 'RAISE_ERROR'
let initialState = {
    isError: false,
    errorInfo: ''
}


const errorReducer = (state = initialState, action) => {
    switch (action.type){
        case CLEAR_ERROR:
            return {
                ...state,
                isError: false,
                errorInfo: ''
            }
        case RAISE_ERROR:
            return {
                ...state,
                isError: true,
                errorInfo: action.errorInfo
            }
        default:
            return {...state}
        
    }
}


export default errorReducer

export const clearErrorCreator = () => ({type: CLEAR_ERROR})
export const raiseErrorCreator = (errorInfo) => ({type: RAISE_ERROR, errorInfo})