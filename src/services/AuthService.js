
/**
 * Auth Service
 */
import axios from 'axios';
import { API_URL } from '../config';

const AuthService = {
  login: function(email, password) {
    return axios.post(API_URL + '/api/sessions/login', { email: email, password: password });
  },
  register: function(data) {
    return axios.post(API_URL + '/api/sessions/register', { data });
  },
  getProfile: function() {
    return axios.get(API_URL + '/api/users/me', { headers: this.authHeader() });
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
  }
}

export default AuthService
