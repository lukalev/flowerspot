import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import configureStore from './store/configureStore';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-xxl/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';
// Create browser history to use in the Redux store
//const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const history = createBrowserHistory();

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState;
export const store = configureStore(history, initialState);

const rootElement = document.getElementById('root') || document.createElement('div');

store.subscribe(()=>{
  localStorage.setItem('reduxState', JSON.stringify(store.getState()))
})

ReactDOM.render(
  <Provider store={store as any}>
    <ConnectedRouter history={history}>
    	<App history={history}/>
    </ConnectedRouter>
  </Provider>,
rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
