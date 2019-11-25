import AuthService from "../../services/AuthService";
import { setCurrentUser } from "./actionCreators";

/**
 * Get user profile based on token
 */
export function getProfile() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const token = AuthService.getToken();
      if (token) {
        AuthService.getProfile().then(resp => {
          if (resp.data) {
            dispatch(setCurrentUser(resp.data));
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
