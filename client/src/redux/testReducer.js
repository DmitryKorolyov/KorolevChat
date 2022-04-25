const TEST_ACTION = 'TEST-ACTION';

let initialState = {
    records: [{title:'Very first hardcode record',
                id:1}
                ]
}

const testReducer = (state = initialState, action) => {
    if (action.type === TEST_ACTION) {
        let stateCopy = {...state,
                            records: [...state.records, {title:action.newRecord, id: state.records.length + 1}]};
        return stateCopy
    }
    return {...state}
} 

export default testReducer;

export const sendRecordCreator = (record) => ({type: TEST_ACTION, newRecord: record})
export const applyer = () => ({type:'where is your passport?'})