import React, {useRef} from 'react'
import {connect} from 'react-redux'
import { applyer, sendRecordCreator } from '../redux/testReducer'

const FirstComponent = (props) => {
    
    let element = useRef(null);
    console.log('отрисовалось');
    console.log(props.someData);

    let send = () => {
        let text = element.current.value;
        props.sendRecord(text);
    } 


    let dataList = props.someData.map((record) => (<div key={record.id}>{record.title}</div>));

    return(
        <div>
            <div>
                <input type='text' ref={element}></input>
                <button onClick={()=>{send()}}> в стейт</button>
                <p>Пришла какая-то информация из пропсов:</p>
                {dataList}
            </div>
        </div>
    )
}  

let mapStateToProps = (state) => {
    return{
        someData: state.test.records
    }
}

let mapDispatchToProps = (dispatch) => {
    return{
        sendRecord: (record) => {
            dispatch(sendRecordCreator(record))
        },
            apply: () => {
            dispatch(applyer())
        }
        

    }
}

let FirstComponentContainer = connect(mapStateToProps,mapDispatchToProps)(FirstComponent);

export default FirstComponentContainer;         