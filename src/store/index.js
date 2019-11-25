import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import rootReducer from "./reducers/index";

const initialState = {
  user: {
    isAuthenticated: false,
    profile: {}
  }
};

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__&& window.__REDUX_DEVTOOLS_EXTENSION__()
);




export default function getStore() {
  return store;
}
