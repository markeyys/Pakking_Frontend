import axios from 'axios';
import { API_URL } from '../config';

const VehicleService = {
  AllVehicles: function() {
       return axios.get(API_URL + '/api/vehicles');
  },
  NewVehicle: function(vehicleNo, type){
        return axios.post(API_URL + '/api/vehicles/', {
            vehicleNo: vehicleNo,
            type: type
        })
  },
  DeleteVehicle: function(id) {
    return axios.delete(API_URL + `/api/vehicles/${ id }`);
  },
  setMainVehicle: function(id){
      return axios.post(API_URL + `/api/vehicles/${ id }/set_main`);
  }

}

export default VehicleService