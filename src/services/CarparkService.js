import axios from 'axios';
import { API_URL } from '../config';
import AuthService from '../services/AuthService'

// This gets the API-endpoint from the Carpark, backend
const CarparkService = {
  allCaparks: function() {
       return axios.get(API_URL + '/api/carparks', {headers: AuthService.authHeader() });
  },
  searchByAddress: function(address) {
    return axios.get(API_URL + '/api/carparks/search_by_address', {headers: AuthService.authHeader(), params: {q: address} });
  },
  getCarpark: function(id){
      return axios.get(API_URL + `/api/carparks?id=${ id }`, {headers: AuthService.authHeader() });
  },
  addFavouriteCarpark: function(id){
      return axios.post(API_URL + `/api/carparks/${ id }/favorite`,null, {headers: AuthService.authHeader() });
  },
  likeCarpark: function(id){
    return axios.post(API_URL + `/api/carparks/${ id }/like`,null, {headers: AuthService.authHeader() });
  }

}

export default CarparkService