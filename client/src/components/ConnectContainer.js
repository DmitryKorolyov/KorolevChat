import React, {useEffect} from "react"
import { connect } from "react-redux"
import { connectThunkCreator } from "../redux/dialogsReducer"

const ConnectContainer = (props) => {
    useEffect(() => {
        // if (props.isAuthenticated) props.connect()
        props.connect()
    }, [typeof(props.dialogs)])
    // }, [props.isAuthenticated])

    return props.children
}


const mapStateToProps = (state) => {
    return {
            dialogs: state.dialogs.dialogs
        }
}




const mapDispatchToProps = (dispatch) => {
    return {
            connect: () => {dispatch(connectThunkCreator())},
        }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectContainer)