import axios from 'axios/index';
import RollbarClient from "../clients/RollbarClient";
import ConsumerService from "./ConsumerService";

export const CheckoutService = {
  clicked,
  viewed,
  selectedPayInFull,
  selectedFinance,
  validateDateOfBirth,
  getOptions,
  acceptTerms,
  termsAccepted,
  clearTermsAcceptance,
  autoPayEnabled,
};

export default CheckoutService;

const ApiLocation = process.env.REACT_APP_API_HOST;

function recordEvent(slug, event_type) {
  axios.get(ApiLocation + '/bill/' + slug + '/event/' + event_type).catch(error => {
    RollbarClient.handleHttpFailure(error);
  });
}

function clicked(slug) {
  recordEvent(slug, "Clicked")
}

function viewed(slug) {
  recordEvent(slug, "Viewed")
}

function selectedPayInFull(slug) {
  recordEvent(slug, "Selected full")
}

function selectedFinance(slug) {
  recordEvent(slug, "Selected finance")
}

function acceptTerms(slug, autoPay) {
  localStorage.setItem('acceptedTerms' + slug, true);
  localStorage.setItem('autoPay' + slug, autoPay);
}

function termsAccepted(slug) {
  return localStorage.getItem('acceptedTerms' + slug) === "true";
}

function autoPayEnabled(slug) {
  return localStorage.getItem('autoPay' + slug) === "true";
}

function clearTermsAcceptance(slug) {
  localStorage.removeItem('acceptedTerms' + slug);
  localStorage.removeItem('autoPay' + slug);
}

function validateDateOfBirth(slug, dob, onSuccess, onError) {
  axios.post(ApiLocation + '/bill/'+ slug+'/validate_dob',{ dob: dob}).then(response => {
    ConsumerService.setAuthToken(response.headers["authorization"]);
    ConsumerService.storeCustomer(response.data.data.attributes);
    onSuccess(response)
  }).catch(error => {
    onError(error);
    RollbarClient.handleHttpFailure(error);
  });
}

function getOptions(slug, onSuccess, onError) {
  axios.get(ApiLocation + '/bill/'+ slug+'/options', ConsumerService.getAuthTokenHeader()).then(response => {
    onSuccess(response)
  }).catch(error => {
    onError(error, ConsumerService.handleAuthErrors);
    RollbarClient.handleHttpFailure(error);
  });
}
