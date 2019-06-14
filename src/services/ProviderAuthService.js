import axios from 'axios/index';
import _ from 'lodash';

import RollbarClient from "../clients/RollbarClient";

export const ProviderAuthService = {
  loggedIn,
  login,
  logout,
  resetPassword,
  saveNewPassword,
  resendAuthy,
  verifyAuthy,
  getAuthTokenHeader,
  deleteAuthToken,
  handleAuthErrors
};

export default ProviderAuthService;

const ApiLocation = process.env.REACT_APP_API_HOST;

function getAuthToken() {
  return localStorage.getItem("Authorizarion");
}

function getAuthTokenHeader() {
  return { headers: {"Authorization": localStorage.getItem('Authorizarion')} };
}

function deleteAuthToken() {
  localStorage.removeItem("Authorizarion");
}

function loggedIn() {
  return !_.isEmpty(getAuthToken());
}

function login(email, password, onSuccess, onError) {
  let credentials = {
    provider_user: {
      email: email,
      password: password
    }
  };

  axios.post(ApiLocation + "/provider/login", credentials).then(response => {
    localStorage.setItem("Authorizarion", response.headers["authorization"]);
    onSuccess(response);
  }).catch(error => {
    RollbarClient.handleHttpFailure(error);
    onError(error);
  });
}

function logout(onSuccess, onError) {
  axios.delete(ApiLocation + '/provider/logout', getAuthTokenHeader()).then(response => {
    deleteAuthToken();
    onSuccess(response);
  }).catch(error => {
    RollbarClient.handleHttpFailure(error);
    onError(error)
  });
}

function resetPassword(email, onSuccess, onError) {
  let credentials = { provider_user: { email: email } };

  axios.post(ApiLocation + '/provider/password', credentials).then(response => {
    onSuccess(response);
  }).catch(error => {
    RollbarClient.handleHttpFailure(error);
    onError(error);
  });
}

function saveNewPassword(email, password, token, onSuccess, onError) {
  let credentials = {
    provider_user: {
      email: email,
      password: password,
      password_confirmation: password,
      reset_password_token: token
    }
  };

  axios.put(ApiLocation + '/provider/password', credentials).then(response => {
    onSuccess(response)
  }).catch(error => {
    RollbarClient.handleHttpFailure(error);
    onError(error);
  });
}

function resendAuthy(onSuccess, onError) {
  axios.get(ApiLocation + '/provider/resend_authy', getAuthTokenHeader()).then(response => {
    onSuccess(response)
  }).catch(error => {
    RollbarClient.handleHttpFailure(error);
    onError(error);
  });
}

function verifyAuthy(verificationCode, onSuccess, onError) {
  let token = { authy_token: verificationCode };

  axios.post(ApiLocation + '/provider/validate_authy', token, getAuthTokenHeader()).then(response => {
    onSuccess(response)
  }).catch(error => {
    RollbarClient.handleHttpFailure(error);
    onError(error);
  });
}

function handleAuthErrors(history, error) {
  console.log(error);
  if (error.response.status === 401) {
    ProviderAuthService.deleteAuthToken();
    history.push("/provider");
  } else if (error.response.status === 412) {
    history.push("/provider/authy_challenge");
  }
}