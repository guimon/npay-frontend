import axios from 'axios/index';

import ProviderAuthService from './ProviderAuthService';

export const ProviderService = {
  getBills,
  getBill,
  cancelBill,
  resendSms,
  save,
};

export default ProviderService;

const ApiLocation = process.env.REACT_APP_API_HOST;

function getBills(searchTerm, onSuccess, onError) {
  axios.get(ApiLocation + '/provider/bill_search/'+ searchTerm , ProviderAuthService.getAuthTokenHeader()).then(response => {
    onSuccess(response)
   }).catch(error => {
     onError(error, ProviderAuthService.handleAuthErrors);
   });
}

function getBill(slug, onSuccess, onError) {
  axios.get(ApiLocation + '/provider/bill/'+ slug, ProviderAuthService.getAuthTokenHeader()).then(response => {
    onSuccess(response);
  }).catch(error => {
    onError(error, ProviderAuthService.handleAuthErrors);
  });
}

function cancelBill(slug, onSuccess, onError) {
  axios.get(ApiLocation + '/provider/bill/'+ slug +'/cancel', ProviderAuthService.getAuthTokenHeader()).then(response => {
    onSuccess(response);
  }).catch(error => {
    onError(error, ProviderAuthService.handleAuthErrors);
  });
}

function resendSms(slug, onSuccess, onError) {
  axios.get(ApiLocation + '/provider/bill/'+ slug +'/resend_sms', ProviderAuthService.getAuthTokenHeader()).then(response => {
    onSuccess(response);
  }).catch(error => {
    onError(error, ProviderAuthService.handleAuthErrors);
  });
}

function save(payload, onSuccess, onError) {
  axios.post(ApiLocation + '/provider/bill/', payload, ProviderAuthService.getAuthTokenHeader()).then(response => {
    onSuccess(response);
  }).catch(error => {
    onError(error, ProviderAuthService.handleAuthErrors);
  });
}