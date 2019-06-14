import axios from 'axios/index';
import _ from "lodash";

import RollbarClient from '../clients/RollbarClient';

export const ConsumerService = {
  loggedIn,
  deleteAuthToken,
  sendLoginSms,
  verifySms,
  getBills,
  getBill,
  submitApplication,
  addPaymentMethod,
  getPaymentMethods,
  selectPaymentMethod,
  sendPayment,
  setAuthToken,
  getAuthTokenHeader,
  handleAuthErrors,
  takeOffer,
  storeCustomer,
  loadCustomer,
  recordConsent,
};

export default ConsumerService;

const ApiLocation = process.env.REACT_APP_API_HOST;

function storeCustomer(customer) {
  sessionStorage.setItem("Customer", JSON.stringify(customer));
}

function loadCustomer() {
  let data = sessionStorage.getItem("Customer");

  if (data) {
    return JSON.parse(data);
  }
}

function getAuthToken() {
  return localStorage.getItem("CustomerAuthorizarion");
}

function setAuthToken(token) {
  return localStorage.setItem("CustomerAuthorizarion", token);
}

function getAuthTokenHeader() {
  if (_.isEmpty(getAuthToken())) {
    return {headers: {}};
  } else {
    return {headers: {"Authorization": localStorage.getItem('CustomerAuthorizarion')}};
  }
}

function deleteAuthToken() {
  localStorage.removeItem("CustomerAuthorizarion");
}
function loggedIn() {
  return !_.isEmpty(getAuthToken()) && !_.isEmpty(loadCustomer());
}

function sendLoginSms(phone, date_of_birth, onSuccess, onError) {
  let tokenParam = {
    date_of_birth: date_of_birth,
    phone: phone
  };

  axios.post(ApiLocation + '/consumer/send_auth_sms/', tokenParam).then(response => {
    onSuccess(response)
  }).catch(error => {
    onError(error);
  });
}

function addPaymentMethod(stripeToken, onSuccess, onError) {
  let stripeTokenParam = { token: stripeToken };
  axios.post(ApiLocation + '/consumer/add_payment_method/', stripeTokenParam, getAuthTokenHeader()).then(response => {
    localStorage.setItem("paymentMethods", JSON.stringify(response.data.data));
    onSuccess(response.data.data)
  }).catch(error => {
    onError(error, handleAuthErrors);
  });
}

function selectPaymentMethod(id, onSuccess, onError) {
  let params = { payment_method_id: id };
  axios.post(ApiLocation + '/consumer/toggle_payment_method/', params, getAuthTokenHeader()).then(response => {
    localStorage.setItem("paymentMethods", JSON.stringify(response.data.data));
    onSuccess(response.data.data)
  }).catch(error => {
    onError(error, handleAuthErrors);
  });
}

function takeOffer(slug, amount, autoPay, onSuccess, onError) {
  let params = { slug: slug, amount_in_cents: amount, auto_pay: autoPay };
  axios.post(ApiLocation + '/consumer/take_offer/', params, getAuthTokenHeader()).then(response => {
    onSuccess(response)
  }).catch(error => {
    onError(error, handleAuthErrors);
  });
}

function sendPayment(slug, amount, onSuccess, onError) {
  let params = { slug: slug, amount_in_cents: amount };
  axios.post(ApiLocation + '/consumer/make_payment/', params, getAuthTokenHeader()).then(response => {
    onSuccess(response)
  }).catch(error => {
    onError(error, handleAuthErrors);
  });
}

function verifySms(phone, token, onSuccess, onError) {
  let tokenParam = { token: token };
  axios.post(ApiLocation + '/consumer/verify_auth_sms/' + phone, tokenParam).then(response => {
    setAuthToken(response.headers["authorization"]);
    storeCustomer(response.data.data.attributes);
    onSuccess(response)
  }).catch(error => {
    onError(error);
  });
}

function getPaymentMethods(onSuccess, onError) {
  if (localStorage.getItem("paymentMethods")) {
    onSuccess(JSON.parse(localStorage.getItem("paymentMethods")));
  } else {
    axios.get(ApiLocation + '/consumer/payment_methods/', getAuthTokenHeader()).then(response => {
      localStorage.setItem("paymentMethods", JSON.stringify(response.data.data));
      onSuccess(response.data.data)
    }).catch(error => {
      onError(error, handleAuthErrors);
    });
  }
}

function getBills(onSuccess, onError) {
  axios.get(ApiLocation + '/consumer/bills/', getAuthTokenHeader()).then(response => {
    onSuccess(response)
  }).catch(error => {
    onError(error, handleAuthErrors);
  });
}

function recordConsent(slug, consents, agreed) {
  let params = {
    consents: consents,
    agreed: agreed
  };
  axios.put(ApiLocation + '/consumer/bill/'+ slug + "/consents", params, getAuthTokenHeader());
}

function getBill(slug, onSuccess, onError) {
  axios.get(ApiLocation + '/consumer/bill/'+ slug, getAuthTokenHeader()).then(response => {
    onSuccess(response)
  }).catch(error => {
    onError(error, handleAuthErrors);
  });
}

function submitApplication(slug, income, last_4_ssn, onSuccess, onError) {
  let customer = loadCustomer();
  let params = {
    slug: slug,
    household_income: income,
    last_4_ssn: last_4_ssn,
    first_name: customer.first_name,
    last_name: customer.last_name,
    street_address: customer.street_address,
    address_complement: customer.address_complement,
    city: customer.city,
    state: customer.state,
    zip_code: customer.zip_code
  };

  axios.post(ApiLocation + '/consumer/submit_application/', params, getAuthTokenHeader()).then(response => {
    onSuccess(response)
  }).catch(error => {
    onError(error, handleAuthErrors);
  });
}

function handleAuthErrors(history, error) {
  if (error.response.status === 401) {
    deleteAuthToken();
    history.push("/");
  }

  RollbarClient.handleHttpFailure(error);
}