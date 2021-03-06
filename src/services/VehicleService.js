import axios from 'axios';
import { API_URL } from '../config';
import AuthService from '../services/AuthService'

// This gets the API-endpoint from the Vehicle, backend
const VehicleService = {
  AllVehicles: function() {
       return axios.get(API_URL + '/api/vehicles',  { headers: AuthService.authHeader() });
  },
  NewVehicle: function(vehicleNo, type){
        return axios.post(API_URL + '/api/vehicles/', {
            vehicleNo: vehicleNo,
            type: type
        }, { headers: AuthService.authHeader() })
  },
  DeleteVehicle: function(id) {
    return axios.delete(API_URL + `/api/vehicles/${ id }`, { headers: AuthService.authHeader() });
  },
  setMainVehicle: function(id){
      return axios.post(API_URL + `/api/vehicles/${ id }/set_main`, null, {headers: AuthService.authHeader() });
  }

}

export default VehicleService