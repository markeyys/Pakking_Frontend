
/**
 * Auth Service
 */
import axios from 'axios';
import { API_URL } from '../config';
import getStore from '../store/index'
import { logoutUser } from '../store/actions/actionCreators'

// This code handles the authentication with  the backend
const AuthService = {
  login: function(email, password) {
    return axios.post(API_URL + '/api/sessions/login', { email: email, password: password });
  },
  register: function(data) {
    return axios.post(API_URL + '/api/sessions/register', { data });
  },
  getProfile: async function() {
    try{
      const response = await axios.get(API_URL + '/api/users/me', { headers: this.authHeader() });
      return response
    }catch(error){
      console.log(error.response);
      if (error.response.status === 401){
        getStore().dispatch(logoutUser())
        return {};
      }
      throw error;
    }
 },
  logout: function () {
    localStorage.removeItem('token');
  },
  getToken: function() {
    return localStorage.getItem('token');
  },
  saveToken: function(token) {
    localStorage.setItem('token', token);
  },
  authHeader: function () {
    return { Authorization: this.getToken() }
  },
  updateProfile: function(key, value){
     return axios.put(API_URL + '/api/users/update_profile',{
        key: key,
        value: value
      }, { headers: this.authHeader() });



  }


}

export default AuthService
