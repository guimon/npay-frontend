import Rollbar from "rollbar";

export const RollbarClient = {
  handleHttpFailure,
  error,
};

export default RollbarClient;

function handleHttpFailure(error) {
  if (error.response.status === 400) {
    RollbarClient.error("Received 400 from backend " + error.request.responseURL);
  } else if (error.response.status === 500) {
    RollbarClient.error("Received 500 from backend " + error.request.responseURL);
  }
}

function error(message, hash) {
  let rollbar = new Rollbar({
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });

  rollbar.error(message, hash);
}