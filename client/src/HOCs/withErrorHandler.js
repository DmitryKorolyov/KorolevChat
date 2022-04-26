import React from "react"
import { connect } from "react-redux"
import Notice from '../components/Notice/Notice'
import {clearErrorCreator} from '../redux/errorReducer' 

const mapStateToProps = (state) => {
    return {
        isError: state.error.isError,
        errorInfo: state.error.errorInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearError: () => {dispatch(clearErrorCreator())}
    }
}

const withErrorHandler = (Component) => connect(mapStateToProps, mapDispatchToProps)((props) => {
        if (props.isError) {
            return <Notice
                title = 'ВНИМАНИЕ!'
                text = {props.errorInfo}
                buttonLabel = 'понятно'
                handleClick = {props.clearError}
            />
        }
        else return <Component/> 
})

export default withErrorHandler