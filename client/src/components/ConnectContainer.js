import { useEffect } from "react"
import { connect } from "react-redux"
import { connectThunkCreator } from "../redux/dialogsReducer"

const ConnectContainer = (props) => {
    useEffect(() => {
        props.connect()
    }, [typeof(props.dialogs)])
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