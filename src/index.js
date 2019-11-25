import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import getStore from './store/index'
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import 'semantic-ui-css/semantic.min.css';
import './style.css';


ReactDom.render(
  <Provider store={getStore()} >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root')
)