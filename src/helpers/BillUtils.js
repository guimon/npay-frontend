import Formatter from "./Formatter";
import DateUtils from "./DateUtils";
import CheckoutService from "../services/CheckoutService";

export const BillUtils = {
  sumTotalPaidAmount,
  outstandingAmount,
  nextInstallmentAmount,
  installmentAmount,
  lastInstallmentAmount,
  financingOptionAvailable,
  financingOfferWaiting,
  financingOfferAcceptedButUnpaid,
  dueDates,
};

export default BillUtils;

function financingOfferWaiting(bill) {
  let applications = bill.attributes.credit_applications;
  if (applications.length === 0) return false;
  if (applications[0].attributes.status !== 'Approved') return false;
  if (applications[0].attributes.credit_offers.length === 0) return false;
  if (applications[0].attributes.credit_offers[0].attributes.status === "Offered") return true;

  return false;
}

function financingOfferAcceptedButUnpaid(bill) {
  return financingOptionAvailable(bill) && CheckoutService.termsAccepted(bill.attributes.slug);
}

function financingOptionAvailable(bill) {
  let applications = bill.attributes.credit_applications;
  if (applications.length === 0) return true;
  if (applications[0].attributes.status === 'Rejected') return false;

  return true;
}

function sumTotalPaidAmount(bill) {
  let payments = bill.attributes.payments;
  return payments.reduce((total, arr) => { return total += arr.attributes.amount}, 0);
}

function outstandingAmount(bill) {
  return bill.attributes.billed_amount - sumTotalPaidAmount(bill);
}

function nextInstallmentAmount(bill) {
  let installmentAmount = bill.attributes.selected_credit_offer.attributes.payment_amount;
  let outstanding = outstandingAmount(bill);

  if (outstanding - installmentAmount < 100) {
    return outstanding;
  } else {
    return Math.min(outstandingAmount(bill), installmentAmount);
  }
}

function installmentAmount(bill) {
  return bill.attributes.credit_applications[0].attributes.credit_offers[0].attributes.payment_amount;
}

function lastInstallmentAmount(bill) {
  return bill.attributes.billed_amount - (installmentAmount(bill) * 3)
}

function dueDates(bill) {
  let dates = bill.attributes.credit_applications[0].attributes.credit_offers[0].attributes.due_dates;
  return dates.map((date) => (DateUtils.isToday(date) ? "Today" : Formatter.formatDate(date)));
}