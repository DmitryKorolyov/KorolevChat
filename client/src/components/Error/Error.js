import React from "react"

export default Error = (props) => <div>
    <div>{props.errorInfo}</div>
    qwerty
    <div onClick = {props.clearError}>Принято</div>
</div>