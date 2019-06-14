import axios from 'axios/index';

import ProviderAuthService from "./ProviderAuthService";

export const ProviderCustomerService = {
  find,
  save,
};

export default ProviderCustomerService;

const ApiLocation = process.env.REACT_APP_API_HOST;

function find(phone, onSuccess, onError) {
  axios.get(ApiLocation + '/provider/customer/' + phone, ProviderAuthService.getAuthTokenHeader()).then(response => {
    onSuccess(response)
  }).catch(error => {
    onError(error, ProviderAuthService.handleAuthErrors);
  });
}

function save(payload, onSuccess, onError) {
  axios.post(ApiLocation + '/provider/customer/', payload, ProviderAuthService.getAuthTokenHeader()).then(response => {
    onSuccess(response)
  }).catch(error => {
    onError(error, ProviderAuthService.handleAuthErrors);
  });
}