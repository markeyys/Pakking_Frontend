import AuthService from '../../services/AuthService';
import { setCurrentUser, registerSuccess, logoutUser, getErrors } from "./actionCreators";

/**
 * Login user action
 */
export const loginUser = (state, history) => dispatch => {
  AuthService.login(state.email, state.password).then(resp => {
    if (resp.status === 200) {
      dispatch(setCurrentUser({email: resp.data.email, address: resp.data.address}));
      AuthService.saveToken(resp.data.token);
      history.push('/');
    }
  }).catch(error => {
    if (error.response) {
      dispatch(getErrors({
        loginError: error.response
      }));
    }
  });
}

/**
 * Logout action
 */
export const logout = (history) => dispatch => {
  AuthService.logout();
  dispatch(logoutUser());
  history.push('/')
  window.location.reload();
}

/**
 * Register user action
 */
export const registerUser = (data, history) => dispatch => {
  console.log(data);
  AuthService.register(data).then(resp => {
    if (resp.status === 200) {
      dispatch(registerSuccess());
      history.push('/login');
    }
  }).catch(error => {
    if (error.response) {
      dispatch(getErrors({
        registerError: error.response
      }));
    }
  });
}
