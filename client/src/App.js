import React from 'react';

import { BrowserRouter} from 'react-router-dom';
import store from './redux/redux-store'
import {Provider} from 'react-redux'

import css from './App.module.css'
import WrappedApp from './components/WrappedApp/WrappedApp';

function App() {
  return (
    <BrowserRouter>
    <Provider store = {store}>
      <WrappedApp className = {`${css.neonText} css.apo`} />
    </Provider>
    </BrowserRouter>
  )
}

export default App;
