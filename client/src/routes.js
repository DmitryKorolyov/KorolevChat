import React from "react"
import {Route, Navigate, Routes} from 'react-router-dom'
import DialogsPage from "./components/DialogsPage/DialogsPage"
import {AuthPageContainer}  from "./components/AuthPage/AuthPage"
import FirstComponentContainer from "./components/testPage"
//import CurrentDialog from "./components/CurrentDialog/CurrentDialog"
import CurrentDialog from "./components/CurrentDialog/CurrentDialog"
import ConnectContainer from "./components/ConnectContainer"
import FullscreenMode from "./components/FullscreenMode/FullscreenMode"

export const useRoutes = (isAuthenticated) => {


        


    if (isAuthenticated) {
        return (
            <ConnectContainer>
                <Routes>
                    <Route path = "/fullscreen" exact element = {<FullscreenMode isAuthenticated = {isAuthenticated}/>} />
                    <Route path = "/dialogs" exact element = {<DialogsPage/>} />
                    <Route path = "dialogs/current/:dialogId/*" element = {<CurrentDialog/>} />
                    <Route path="*" element={<Navigate to="/dialogs" />} />
                </Routes>
            </ConnectContainer>
        )
    }
    else {
        return(
            <Routes>
                <Route path = "/fullscreen" exact element = {<FullscreenMode isAuthenticated = {isAuthenticated}/>} /> 
                <Route path = '/auth' exact element = {<AuthPageContainer/>} />
                <Route path = '/test' exact element = {<FirstComponentContainer/>} />
                <Route path="*" element={<Navigate to="/auth" />} />
            </Routes>      
        )    
}
}

    // <ConnectContainer isAuthenticated = {isAuthenticated}>
    //     <Routes>
    //         <Route path = "/fullscreen" exact element = {<FullscreenMode/>} />
    //         {isAuthenticated ? 
    //                 (<Route path = "/dialogs" exact element = {<DialogsPage/>} />,
    //                 <Route path = "dialogs/current/:dialogId/*" element = {<CurrentDialogContainer/>} />,
    //                 <Route path="*" element={<Navigate to="/dialogs" />} />)
    //         :
    //             (<Route path = '/auth' exact element = {<AuthPageContainer/>} />,
    //             <Route path = '/test' exact element = {<FirstComponentContainer/>} />,
    //             <Route path="*" element={<Navigate to="/auth" />} />)
    //         }
    //     </Routes>
    // </ConnectContainer>