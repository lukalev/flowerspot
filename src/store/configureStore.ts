import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import * as Flowrs from './Flowrs';

export default function configureStore(history: any, initialState: any) {
  
  const reducers = {
    flowrs: Flowrs.reducer,
  };

  const middleware = [
    thunk,
    routerMiddleware(history),
  ];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment && typeof window !== 'undefined' && (window as any).devToolsExtension) {
    enhancers.push((window as any).devToolsExtension());
  }

  const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer,
  });
 
  const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState') || '') : initialState

  return createStore(
    rootReducer,
    persistedState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}
