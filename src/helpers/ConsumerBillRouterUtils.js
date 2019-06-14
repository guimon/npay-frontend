import BillUtils from "./BillUtils";

export const ConsumerBillRouterUtils = {
  routeBill,
};

export default ConsumerBillRouterUtils;

function routeBill(bill, history) {
  let currentLocation = history.location.pathname;
  let currentState = history.location.state;

  let desiredLocation = undefined;
  let desiredState = undefined;

  if (bill.attributes.payment_status !== "Pending") {
    desiredLocation = "/consumer/bill/" + bill.attributes.slug;
    desiredState = {bill: bill};
  } else if (BillUtils.financingOfferAcceptedButUnpaid(bill)) {
    desiredLocation = "/b/" + bill.attributes.slug + "/down_payment";
  } else if (BillUtils.financingOfferWaiting(bill)) {
    desiredLocation = "/b/" + bill.attributes.slug + "/qualified";
  } else if (BillUtils.financingOptionAvailable(bill)) {
    desiredLocation = "/b/" + bill.attributes.slug + "/options";
  } else {
    desiredLocation = "/b/" + bill.attributes.slug + "/unqualified";
  }

  if (currentLocation !== desiredLocation || currentState !== desiredState) {
    history.replace(desiredLocation, desiredState);
  }
}
